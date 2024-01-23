import { Request, Response } from 'express';
import { Order } from '../models/order';
import { CustomerRepository, OrderRepository, ProductRepository } from '../repositories';
import { Product } from '../models/product';
import { Customer } from '../models/customer';

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
     * Retrieve an order by ID
     */
    public getOrderById = async (orderId: string): Promise<Order | null> => {
        try {
            const order = await this.orderRepository.findOneOrFail({
                where: { id: orderId },
                relations: ['customer', 'products'],
            });
            return order;
        } catch (error) {
            console.error('Error retrieving order by ID:', error.message);
            return null;
        }
    };

    /**
     * Create a new order
     */
    public createOrder = async (orderData: any): Promise<Order> => {
        // Create a new order instance with basic data
        const newOrder = this.orderRepository.create({
            serialNumber: orderData.serialNumber,
            orderValue: orderData.orderValue,
            quantity: orderData.quantity,
            client: orderData.client,
            expectedDeliveryDate: orderData.expectedDeliveryDate,
            status: orderData.status,
        });

        // If 'customer' is provided in orderData, find or create the customer entity
        if (orderData.customer && orderData.customer.id) {
            try {
                const customer = await this.customerRepository.findOneOrFail(
                    orderData.customer.id
                );
                newOrder.customer = customer;
            } catch (error) {
                console.error('Error retrieving customer:', error.message);
            }
        }

        // If 'products' are provided in orderData, find or create the product entities
        if (orderData.products && orderData.products.length > 0) {
            const productEntities: Product[] = [];

            for (const productData of orderData.products) {
                if (productData.id) {
                    try {
                        const product = await this.productRepository.findOneOrFail(
                            productData.id
                        );
                        productEntities.push(product);
                    } catch (error) {
                        console.error('Error retrieving product:', error.message);
                    }
                }
                // Handle case where productData.id is not provided and you need to create a new product
                // ...
            }

            // Set the products for the order
            newOrder.products = productEntities;
        }

        // Save the new order with its relationships
        await this.orderRepository.save(newOrder);

        return newOrder;
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

        const updatedOrder = this.orderRepository.merge(existingOrder, orderData);
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
}

export default new OrderService();
