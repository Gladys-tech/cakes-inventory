"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class CustomerController {
    constructor() {
        // Get all customers
        this.getCustomers = async (req, res) => {
            try {
                const customers = await services_1.CustomerService.getAllCustomers(req, res);
                res.status(200).json({
                    status: 'OK',
                    customers,
                });
            }
            catch (error) {
                console.error('Error retrieving customers:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving customers.',
                });
            }
        };
        // Get customer by ID
        this.getCustomerById = async (req, res) => {
            const customerId = req.params.id;
            try {
                const customer = await services_1.CustomerService.getCustomerById(customerId);
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
            }
            catch (error) {
                console.error('Error retrieving customer by ID:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving customer by ID.',
                });
            }
        };
        // Create a customer
        this.createCustomer = async (req, res) => {
            const customerData = req.body;
            try {
                const newCustomer = await services_1.CustomerService.createCustomer(customerData);
                res.status(201).json({
                    status: 'CREATED',
                    customer: newCustomer,
                });
            }
            catch (error) {
                console.error('Error creating customer:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating customer.',
                });
            }
        };
        // Update a customer
        this.updateCustomer = async (req, res) => {
            const customerId = req.params.id;
            const customerData = req.body;
            try {
                const updatedCustomer = await services_1.CustomerService.updateCustomer(customerId, customerData);
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
            }
            catch (error) {
                console.error('Error updating customer:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error updating customer.',
                });
            }
        };
        // Delete a customer
        this.deleteCustomer = async (req, res) => {
            const customerId = req.params.id;
            try {
                const deletedCustomer = await services_1.CustomerService.deleteCustomer(customerId);
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
            }
            catch (error) {
                console.error('Error deleting customer:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error deleting customer.',
                });
            }
        };
    }
}
exports.default = new CustomerController();
//# sourceMappingURL=customer.js.map