import { Request, Response } from 'express';
import { CustomerService } from '../services';

class CustomerController {
    // Get all customers
    public getCustomers = async (req: Request, res: Response) => {
        try {
            const customers = await CustomerService.getAllCustomers(req, res);
            res.status(200).json({
                status: 'OK',
                customers,
            });
        } catch (error) {
            console.error('Error retrieving customers:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving customers.',
            });
        }
    };

    // Get customer by ID
    public getCustomerById = async (req: Request, res: Response) => {
        const customerId = req.params.id;

        try {
            const customer = await CustomerService.getCustomerById(customerId);

            if (!customer) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Customer not found with id: ${customerId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                customer,
            });
        } catch (error) {
            console.error('Error retrieving customer by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving customer by ID.',
            });
        }
    };

    // Create a customer
    public createCustomer = async (req: Request, res: Response) => {
        const customerData = req.body;

        try {
            const newCustomer = await CustomerService.createCustomer(customerData);

            res.status(201).json({
                status: 'CREATED',
                customer: newCustomer,
            });
        } catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating customer.',
            });
        }
    };

    // Update a customer
    public updateCustomer = async (req: Request, res: Response) => {
        const customerId = req.params.id;
        const customerData = req.body;

        try {
            const updatedCustomer = await CustomerService.updateCustomer(
                customerId,
                customerData
            );

            if (!updatedCustomer) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Customer not found with id: ${customerId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                customer: updatedCustomer,
            });
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating customer.',
            });
        }
    };

    // Delete a customer
    public deleteCustomer = async (req: Request, res: Response) => {
        const customerId = req.params.id;

        try {
            const deletedCustomer = await CustomerService.deleteCustomer(customerId);

            if (!deletedCustomer) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Customer not found with id: ${customerId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                message: `Customer with id ${customerId} has been deleted.`,
            });
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting customer.',
            });
        }
    };
}

export default new CustomerController();
