import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import { CustomerRepository } from '../repositories';

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
    public getCustomerById = async (customerId: string): Promise<Customer | null> => {
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
            cart: customerData.cart,
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

        const updatedCustomer = this.customerRepository.merge(
            existingCustomer,
            customerData
        );
        await this.customerRepository.save(updatedCustomer);

        return updatedCustomer;
    };

    // Delete a customer by ID
    public deleteCustomer = async (customerId: string): Promise<Customer | null> => {
        const customerToDelete = await this.customerRepository.findOne({
            where: { id: customerId },
        });

        if (!customerToDelete) {
            return null; // Customer not found
        }

        await this.customerRepository.remove(customerToDelete);

        return customerToDelete;
    };
}

export default new CustomerService();
