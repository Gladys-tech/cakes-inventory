import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import { CustomerRepository } from '../repositories';
import { Order } from '../models/order';

class CustomerService {
    private readonly customerRepository: typeof CustomerRepository;

    constructor() {
        this.customerRepository = CustomerRepository;
    }

    // Get all customers
    public getAllCustomers = async (
        req: Request,
        res: Response
    ): Promise<Customer[]> => {
        const customers = await this.customerRepository.find();
        return customers;
    };

    // Get customer by ID
    public getCustomerById = async (
        customerId: string
    ): Promise<Customer | null> => {
        const customer = await this.customerRepository.findOne({
            where: { id: customerId },
        });
        return customer || null;
    };

    // Create a new customer
    public createCustomer = async (customerData: any): Promise<Customer> => {
        const newCustomer = this.customerRepository.create({
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            location: customerData.location,
            telphone: customerData.telphone,
            isEmailVerified: customerData.isEmailVerified,
            cart: customerData.cart || [], // Initialize cart as an empty array if not provided
            userId: customerData.userId, // Add userId here
        });

        await this.customerRepository.save(newCustomer);

        return newCustomer;
    };

    // Update a customer by ID
    public updateCustomer = async (
        customerId: string,
        customerData: any
    ): Promise<Customer | null> => {
        const existingCustomer = await this.customerRepository.findOne({
            where: { id: customerId },
        });

        if (!existingCustomer) {
            return null; // Customer not found
        }

        // Ensure the cart is updated correctly
        if (customerData.cart) {
            existingCustomer.cart = customerData.cart;
        }

        const updatedCustomer = this.customerRepository.merge(
            existingCustomer,
            customerData
        );
        await this.customerRepository.save(updatedCustomer);

        return updatedCustomer;
    };

    // Delete a customer by ID
    public deleteCustomer = async (
        customerId: string
    ): Promise<Customer | null> => {
        const customerToDelete = await this.customerRepository.findOne({
            where: { id: customerId },
        });

        if (!customerToDelete) {
            return null; // Customer not found
        }

        await this.customerRepository.remove(customerToDelete);

        return customerToDelete;
    };


    // Get customer by userId
    public getCustomerByUserId = async (userId: string): Promise<Customer | null> => {
        const customer = await this.customerRepository.findOne({
            where: { userId },
        });
        return customer || null;
    };

     // Get all orders for a user
    //  public getOrdersByUserId = async (userId: string): Promise<Order[]> => {
    //     const customers = await this.customerRepository.find({
    //         where: { user: { id: userId } },
    //         relations: ['orders',],
    //     });

    //     let orders: Order[] = [];
    //     customers.forEach((customer) => {
    //         orders = orders.concat(customer.orders);
    //     });

    //     return orders;
    // };

 
    public async getOrdersByUserId(userId: string): Promise<Order[]> {
        const customers = await this.customerRepository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.orders', 'order')
            .leftJoinAndSelect('order.product', 'product')
            .where('customer.userId = :userId', { userId })
            .getMany();

        const orders: Order[] = customers.reduce((acc, customer) => {
            acc.push(...customer.orders);
            return acc;
        }, []);

        return orders;
    }
}

export default new CustomerService();
