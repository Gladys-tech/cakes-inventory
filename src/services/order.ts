interface OrderCreationResponse {
    orders?: Order[];
    message?: string;
    status:
        | 'Success'
        | 'EmptyCartError'
        | 'OtherError'
        | 'CustomerNotFoundError'; // Add more statuses as needed
    shops?: Shop[];
}

import { Request, Response } from 'express';
import { Order } from '../models/order';
import {
    CustomerRepository,
    OrderRepository,
    ProductRepository,
    ShopRepository,
} from '../repositories';
import { Product } from '../models/product';
import { Customer } from '../models/customer';
import { DeepPartial } from 'typeorm';
import { PaymentMethod } from '../models/order';
import { Shop } from '../models/shop';

class OrderService {
    private readonly orderRepository: typeof OrderRepository;
    private readonly productRepository: typeof ProductRepository;
    private readonly customerRepository: typeof CustomerRepository;
    private readonly shopRepository: typeof ShopRepository;

    constructor() {
        this.orderRepository = OrderRepository;
        this.productRepository = ProductRepository;
        this.customerRepository = CustomerRepository;
        this.shopRepository = ShopRepository;
    }

    /**
     * Retrieve all orders
     */

    public getAllOrders = async (
        req: Request,
        res: Response
    ): Promise<Order[]> => {
        try {
            // Retrieve all orders with related data including products
            const orders = await this.orderRepository.find({
                relations: ['customer', 'product', 'product.shops'],
            });

            // Return the orders with products
            return orders;
        } catch (error) {
            console.error('Error retrieving orders:', error.message);
            return []; // Return an empty array in case of an error
        }
    };

    /**
     * Retrieve an order by ID with detailed product information
     */

    // public getOrderById = async (orderId: string): Promise<Order | null> => {
    //     try {
    //         const order = await this.orderRepository.findOneOrFail({
    //             where: { id: orderId },
    //             relations: ['customer', 'product', 'product.shops'],
    //         });

    //         // Fetch detailed product information for each item in the cart
    //         const productInfo = await this.productRepository.findOne({
    //             where: { id: order.product.id }, // Use order.product.id instead of order.customer.cart.productId
    //         });

    //         // Modify the order object to include detailed product information
    //         const orderWithProductInfo = {
    //             ...order,
    //             product: {
    //                 ...order.product,
    //                 productInfo: productInfo || null, // Include product information or null if not found
    //             },
    //         };

    //         return orderWithProductInfo;
    //     } catch (error) {
    //         console.error('Error retrieving order by ID:', error.message);
    //         return null;
    //     }
    // };

    public getOrderById = async (orderId: string): Promise<Order | null> => {
        try {
            const order = await this.orderRepository.findOneOrFail({
                where: { id: orderId },
                relations: [
                    'product',
                    'product.supplier',
                    'product.shops',
                    'customer',
                ], // Define relations to eager load
            });

            if (order.product) {
                // Fetch additional details if needed
                const product = await this.productRepository.findOneOrFail({
                    where: { id: order.product.id },
                    relations: ['supplier', 'shops'],
                });

                order.product = product; // Replace order's product with detailed product info
            }

            return order;
        } catch (error) {
            console.error(
                'Error fetching order by ID with product details:',
                error.message
            );
            return null;
        }
    };

    // get orders by shop id.
    public getOrdersByShopId = async (shopId: string): Promise<Order[]> => {
        try {
            // Retrieve orders with their associated shops filtered by the provided shop ID
            const orders = await this.orderRepository
                .createQueryBuilder('order')
                .leftJoinAndSelect('order.shops', 'shop')
                .where('shop.id = :shopId', { shopId })
                .getMany();

            return orders;
        } catch (error) {
            console.error('Error retrieving orders by shop ID:', error.message);
            return []; // Return an empty array in case of an error
        }
    };

    /**
     * Generate client name based on customer's first and last names
     */
    private async generateClientName(customerId: string): Promise<string> {
        try {
            const customer = await this.customerRepository.findOneOrFail({
                where: { id: customerId },
            });

            if (customer.firstName && customer.lastName) {
                return `${customer.firstName} ${customer.lastName}`;
            }

            return ''; // Return an empty string if either firstName or lastName is undefined
        } catch (error) {
            console.error('Error retrieving customer:', error.message);
            return ''; // Return an empty string in case of an error
        }
    }

    /**
     * Create a new order
     */

    public createOrder = async (
        orderData: any
    ): Promise<OrderCreationResponse> => {
        const currentDate = new Date();
        const expectedDeliveryDate = new Date(currentDate);
        expectedDeliveryDate.setDate(currentDate.getDate() + 3);

        try {
            // If 'customer' is provided in orderData, find customer.
            if (orderData.customer && orderData.customer.customerId) {
                const customer = await this.customerRepository.findOneOrFail({
                    where: { id: orderData.customer.customerId },
                    // relations: ['cart'], // Load cart relation
                });

                // Check if the customer has a cart
                if (customer.cart && customer.cart.length > 0) {
                    const orders: Order[] = [];

                    // Loop through the customer's cart
                    for (const cartItem of customer.cart) {
                        const productId = cartItem.productId;
                        const productQuantity = cartItem.quantity;

                        try {
                            // Find the product by ID
                            const product =
                                await this.productRepository.findOneOrFail({
                                    where: { id: productId },
                                    relations: ['shops'], // Optionally load related shops
                                });

                            // Create a new order instance for the current product
                            const newOrder = this.orderRepository.create({
                                orderValue: product.price * productQuantity, // Use product price multiplied by quantity as order value
                                quantity: productQuantity, // Set quantity to cart item quantity
                                totalCommission:
                                    product.price * productQuantity * 0.2, // Assuming commission is 20% of the total price
                                actualMoney:
                                    product.price * productQuantity * 0.8, // Assuming 80% of the total price is actual money
                                client:
                                    customer.firstName && customer.lastName
                                        ? `${customer.firstName} ${customer.lastName}`
                                        : '', // Set client name from customer data
                                expectedDeliveryDate: expectedDeliveryDate
                                    .toISOString()
                                    .split('T')[0],
                                status: orderData.status,
                                paymentMethod: orderData.paymentMethod,
                                customer: customer, // Set customer for the order
                                product: product, // Set product for the order
                                shops: product.shops, // Set shops for the order
                            });

                            // Save the new order to the database
                            const savedOrder = await this.orderRepository.save(
                                newOrder
                            );
                            orders.push(savedOrder);

                            // Update product inventory quantity
                            product.inventoryQuantity -= productQuantity;
                            await this.productRepository.save(product);
                        } catch (error) {
                            console.error(
                                'Error creating order for product:',
                                productId,
                                error.message
                            );
                        }
                    }

                    // Empty the customer's cart after orders are created
                    customer.cart = [];
                    await this.customerRepository.save(customer);

                    return {
                        status: 'Success',
                        orders: orders,
                    };
                } else {
                    // If the cart is empty, throw an error or handle it as needed
                    console.error(
                        'Customer cart is empty. Cannot create orders.'
                    );
                    return {
                        message:
                            'Customer cart is empty. Cannot create orders.',
                        status: 'EmptyCartError',
                    };
                }
            } else {
                // If customer is not provided or not found, return an error
                console.error('Customer not found.');
                return {
                    message: 'Customer not found.',
                    status: 'CustomerNotFoundError',
                };
            }
        } catch (error) {
            console.error('Error creating orders:', error.message);
            return {
                message: 'Error creating orders.',
                status: 'OtherError',
            };
        }
    };

    /**
     * Update an order by ID
     */
    public updateOrder = async (
        orderId: string,
        orderData: any
    ): Promise<Order | null> => {
        const existingOrder = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!existingOrder) {
            return null; // order not found
        }

        const updatedOrder = this.orderRepository.merge(
            existingOrder,
            orderData
        );
        await this.orderRepository.save(updatedOrder);

        return updatedOrder;
    };

    // {
    //     "status": "CREATED",
    //     "order": {
    //         "status": "Success",
    //         "orders": [
    //             {
    //                 "orderValue": 200000,
    //                 "quantity": 2,
    //                 "totalCommission": 40000,
    //                 "actualMoney": 160000,
    //                 "client": "gladys mukasa",
    //                 "expectedDeliveryDate": "2024-06-09",
    //                 "customer": {
    //                     "id": "1be13ada-8e1a-4ebe-80c4-e6ee924e60f1",
    //                     "firstName": "gladys",
    //                     "lastName": "mukasa",
    //                     "email": "gladysca@gmail.com",
    //                     "location": "kampala",
    //                     "telphone": "1234567890",
    //                     "isEmailVerified": true,
    //                     "cart": [
    //                         {
    //                             "productId": "3d442e46-6747-404d-bc6e-e3a9264f5f94",
    //                             "quantity": 2
    //                         },
    //                         {
    //                             "productId": "ca264d0b-9b6b-4409-9e1b-5c54123e9d7d",
    //                             "quantity": 2
    //                         }
    //                     ]
    //                 },
    //                 "product": {
    //                     "id": "3d442e46-6747-404d-bc6e-e3a9264f5f94",
    //                     "name": "herbal lotions",
    //                     "description": "This is a sample product description.",
    //                     "price": "100000.00",
    //                     "inventoryQuantity": 100,
    //                     "productStatus": "order made",
    //                     "primaryImageUrl": "https://res.cloudinary.com/ddpv9z6rn/image/upload/v1707662658/sl2bbzmt77nogdei3tda.jpg",
    //                     "category": null,
    //                     "createdAt": "2024-02-11T14:44:15.426Z",
    //                     "updatedAt": "2024-02-11T14:44:15.426Z",
    //                     "shops": [
    //                         {
    //                             "id": "3bdc9e44-94f2-43fb-9078-646cdde827da",
    //                             "name": "shop4",
    //                             "description": "Description for shop4",
    //                             "ownerName": "glad4",
    //                             "email": "glad4@gmail.com",
    //                             "type": "online",
    //                             "createdAt": "2024-01-18T19:25:29.026Z",
    //                             "updatedAt": "2024-01-18T19:25:29.026Z",
    //                             "userId": null
    //                         }
    //                     ]
    //                 },
    //                 "shops": [
    //                     {
    //                         "id": "3bdc9e44-94f2-43fb-9078-646cdde827da",
    //                         "name": "shop4",
    //                         "description": "Description for shop4",
    //                         "ownerName": "glad4",
    //                         "email": "glad4@gmail.com",
    //                         "type": "online",
    //                         "createdAt": "2024-01-18T19:25:29.026Z",
    //                         "updatedAt": "2024-01-18T19:25:29.026Z",
    //                         "userId": null
    //                     }
    //                 ],
    //                 "id": "55385fce-faad-42df-a0a0-f1eb7c62c1f9",
    //                 "status": "order made",
    //                 "paymentMethod": "cash_on_delivery",
    //                 "createdAt": "2024-06-06T09:32:24.700Z",
    //                 "updatedAt": "2024-06-06T09:32:24.700Z"
    //             },
    //             {
    //                 "orderValue": 59.98,
    //                 "quantity": 2,
    //                 "totalCommission": 11.996,
    //                 "actualMoney": 47.984,
    //                 "client": "gladys mukasa",
    //                 "expectedDeliveryDate": "2024-06-09",
    //                 "customer": {
    //                     "id": "1be13ada-8e1a-4ebe-80c4-e6ee924e60f1",
    //                     "firstName": "gladys",
    //                     "lastName": "mukasa",
    //                     "email": "gladysca@gmail.com",
    //                     "location": "kampala",
    //                     "telphone": "1234567890",
    //                     "isEmailVerified": true,
    //                     "cart": [
    //                         {
    //                             "productId": "3d442e46-6747-404d-bc6e-e3a9264f5f94",
    //                             "quantity": 2
    //                         },
    //                         {
    //                             "productId": "ca264d0b-9b6b-4409-9e1b-5c54123e9d7d",
    //                             "quantity": 2
    //                         }
    //                     ]
    //                 },
    //                 "product": {
    //                     "id": "ca264d0b-9b6b-4409-9e1b-5c54123e9d7d",
    //                     "name": "herbal Product",
    //                     "description": "This is a sample product description.",
    //                     "price": "29.99",
    //                     "inventoryQuantity": 98,
    //                     "productStatus": "order made",
    //                     "primaryImageUrl": "https://res.cloudinary.com/ddpv9z6rn/image/upload/v1706791022/v84le0xf7ar1n10me90b.jpg",
    //                     "category": null,
    //                     "createdAt": "2024-02-01T12:36:59.941Z",
    //                     "updatedAt": "2024-02-01T12:36:59.941Z",
    //                     "shops": [
    //                         {
    //                             "id": "3bdc9e44-94f2-43fb-9078-646cdde827da",
    //                             "name": "shop4",
    //                             "description": "Description for shop4",
    //                             "ownerName": "glad4",
    //                             "email": "glad4@gmail.com",
    //                             "type": "online",
    //                             "createdAt": "2024-01-18T19:25:29.026Z",
    //                             "updatedAt": "2024-01-18T19:25:29.026Z",
    //                             "userId": null
    //                         }
    //                     ]
    //                 },
    //                 "shops": [
    //                     {
    //                         "id": "3bdc9e44-94f2-43fb-9078-646cdde827da",
    //                         "name": "shop4",
    //                         "description": "Description for shop4",
    //                         "ownerName": "glad4",
    //                         "email": "glad4@gmail.com",
    //                         "type": "online",
    //                         "createdAt": "2024-01-18T19:25:29.026Z",
    //                         "updatedAt": "2024-01-18T19:25:29.026Z",
    //                         "userId": null
    //                     }
    //                 ],
    //                 "id": "dcab2b9b-0389-4570-956d-834e4ffa1157",
    //                 "status": "order made",
    //                 "paymentMethod": "cash_on_delivery",
    //                 "createdAt": "2024-06-06T09:32:25.618Z",
    //                 "updatedAt": "2024-06-06T09:32:25.618Z"
    //             }
    //         ]
    //     }
    // }

    /**
     * Delete an order by ID
     */
    public deleteOrder = async (orderId: string): Promise<Order | null> => {
        const orderToDelete = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!orderToDelete) {
            return null; // order not found
        }

        await this.orderRepository.remove(orderToDelete);

        return orderToDelete;
    };
}

export default new OrderService();
