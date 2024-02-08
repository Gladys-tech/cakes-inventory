interface OrderCreationResponse {
    order?: Order;
    message?: string;
    status: 'Success' | 'EmptyCartError' | 'OtherError'; // Add more statuses as needed
}

import { Request, Response } from 'express';
import { Order } from '../models/order';
import {
    CustomerRepository,
    OrderRepository,
    ProductRepository,
} from '../repositories';
import { Product } from '../models/product';
import { Customer } from '../models/customer';
import { DeepPartial } from 'typeorm';
import { PaymentMethod } from '../models/order';

class OrderService {
    private readonly orderRepository: typeof OrderRepository;
    private readonly productRepository: typeof ProductRepository;
    private readonly customerRepository: typeof CustomerRepository;

    constructor() {
        this.orderRepository = OrderRepository;
        this.productRepository = ProductRepository;
        this.customerRepository = CustomerRepository;
    }

    /**
     * Retrieve all orders
     */
    public getAllOrders = async (
        req: Request,
        res: Response
    ): Promise<Order[]> => {
        const orders = await this.orderRepository.find();
        return orders;
    };

    /**
     * Retrieve an order by ID with detailed product information
     */
    public getOrderById = async (orderId: string): Promise<Order | null> => {
        try {
            const order = await this.orderRepository.findOneOrFail({
                where: { id: orderId },
                relations: ['customer', 'products'],
            });

            // Fetch detailed product information for each item in the cart
            const cartWithProductInfo = await Promise.all(
                order.customer.cart.map(async (cartItem) => {
                    const productInfo = await this.productRepository.findOne({
                        where: { id: cartItem.productId },
                    });
                    return {
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        productInfo: productInfo || null, // Include product information or null if not found
                    };
                })
            );

            // Modify the order object to include detailed product information in the cart
            const orderWithCartInfo = {
                ...order,
                products: cartWithProductInfo
                    .map((cartItem) => cartItem.productInfo)
                    .filter((productInfo) => productInfo !== null),
            };

            return orderWithCartInfo;
        } catch (error) {
            console.error('Error retrieving order by ID:', error.message);
            return null;
        }
    };


    /**
     * Create a new order
     */


    public createOrder = async (orderData: any): Promise<OrderCreationResponse> => {
        const currentDate = new Date();
        const expectedDeliveryDate = new Date(currentDate);
        expectedDeliveryDate.setDate(currentDate.getDate() + 3);

        // Create a new order instance with basic data
        const newOrder = this.orderRepository.create({
            // serialNumber: orderData.serialNumber, // Add 'serialNumber' to your Order model if necessary
            orderValue: orderData.orderValue,
            quantity: orderData.quantity,
            client: orderData.client,
            expectedDeliveryDate: expectedDeliveryDate
                .toISOString()
                .split('T')[0], // Format as 'YYYY-MM-DD'
            status: orderData.status,
            paymentMethod: orderData.paymentMethod,
        } as DeepPartial<Order>);

        // If 'customer' is provided in orderData, find customer.
        if (orderData.customer && orderData.customer.customerId) {
            try {
                const customer = await this.customerRepository.findOneOrFail({
                    where: { id: orderData.customer.customerId },
                });
                newOrder.customer = customer;

                // If 'cart' is available in the customer data, proceed with updating products
                if (customer.cart && customer.cart.length > 0) {
                    const productEntities: Product[] = [];

                    // Loop through the customer's cart before checking products
                    for (const cartItem of customer.cart) {
                        try {
                            // Find existing product by ID
                            const product = await this.productRepository.findOne({
                                where: { id: cartItem.productId },
                            });

                            if (product) {
                                // Check if the product is in the customer's cart

                                // Reduce inventoryQuantity by the quantity in the customer's cart
                                const reducedQuantity = Math.min(
                                    cartItem.quantity,
                                    product.inventoryQuantity
                                );

                                product.inventoryQuantity -= reducedQuantity;

                                // Check if inventoryQuantity is non-negative
                                if (product.inventoryQuantity < 0) {
                                    console.error(
                                        'Insufficient inventory for product:',
                                        product.name
                                    );
                                    throw new Error('Insufficient inventory');
                                }

                                // Save the updated product to the database
                                await this.productRepository.save(product);


                                productEntities.push(product);
                            } else {
                                console.error(
                                    'Product not found with ID:',
                                    cartItem.productId
                                );
                            }
                        } catch (error) {
                            console.error(
                                'Error retrieving product:',
                                error.message
                            );
                        }
                    }

                    // Set the products for the order
                    newOrder.products = productEntities;
                } else {
                    // If the cart is empty, throw an error or handle it as needed
                    console.error('Customer cart is empty. Cannot create an order.');
                    return {
                        message: 'Customer cart is empty. Cannot create an order.',
                        status: 'EmptyCartError',
                    };
                }
            } catch (error) {
                console.error('Error retrieving customer:', error.message);
            }
        }

        // Save the new order with its relationships
        await this.orderRepository.save(newOrder);

        // Reload the order with products to ensure the correct association is reflected in the response
        const savedOrder = await this.orderRepository.findOneOrFail({
            where: { id: newOrder.id },
            relations: ['customer', 'products'],
        });

        // Empty the customer's cart after the order is made
        if (savedOrder.status === 'order made' && savedOrder.customer) {
            savedOrder.customer.cart = [];
            await this.customerRepository.save(savedOrder.customer);
        }

        // return savedOrder;
        // return newOrder;
        return {
            status: 'Success',
            order: savedOrder,
        };
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

    /**
     * Process Payment for an Order
     */
    // public async processPayment(order: Order): Promise<boolean> {
    //     const paymentMethod = order.paymentMethod;

    //     switch (paymentMethod) {
    //         case PaymentMethod.AirtelMoney:
    //             // Call Airtel Money API to process payment
    //             const airtelMoneyPaymentSuccess = await this.processAirtelMoneyPayment(order);
    //             return airtelMoneyPaymentSuccess;

    //         case PaymentMethod.MTNMobileMoney:
    //             // Call MTN Mobile Money API to process payment
    //             const mtnMobileMoneyPaymentSuccess = await this.processMTNMobileMoneyPayment(order);
    //             return mtnMobileMoneyPaymentSuccess;

    //         case PaymentMethod.CashOnDelivery:
    //             // For Cash on Delivery, assume success since payment is collected offline
    //             return true;

    //         default:
    //             console.error('Invalid payment method:', paymentMethod);
    //             return false;
    //     }
    // }

    // private async processAirtelMoneyPayment(order: Order): Promise<boolean> {
    //     // Implement logic to interact with Airtel Money API
    //     // Set order status based on payment success or failure

    //     const paymentSuccess = /* Your logic to determine if payment is successful or not */;

    //     // Set order status based on payment success or failure
    //     order.status = paymentSuccess ? 'confirmed' : 'cancelled';

    //     // Return true if payment is successful, false otherwise
    //     return paymentSuccess;
    // }

    // private async processMTNMobileMoneyPayment(order: Order): Promise<boolean> {
    //     // Implement logic to interact with MTN Mobile Money API
    //     // Set order status based on payment success or failure

    //     const paymentSuccess = /* Your logic to determine if payment is successful or not */;

    //     // Set order status based on payment success or failure
    //     order.status = paymentSuccess ? 'confirmed' : 'cancelled';

    //     // Return true if payment is successful, false otherwise
    //     return paymentSuccess;
    // }
}

export default new OrderService();
