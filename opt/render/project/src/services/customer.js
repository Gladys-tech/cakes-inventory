"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
class CustomerService {
    constructor() {
        // Get all customers
        this.getAllCustomers = async (req, res) => {
            const customers = await this.customerRepository.find();
            return customers;
        };
        // Get customer by ID
        this.getCustomerById = async (customerId) => {
            const customer = await this.customerRepository.findOne({
                where: { id: customerId },
            });
            return customer || null;
        };
        // Create a new customer
        this.createCustomer = async (customerData) => {
            const newCustomer = this.customerRepository.create({
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                email: customerData.email,
                location: customerData.location,
                telphone: customerData.telphone,
                isEmailVerified: customerData.isEmailVerified,
                cart: customerData.cart || [], // Initialize cart as an empty array if not provided
            });
            await this.customerRepository.save(newCustomer);
            return newCustomer;
        };
        // Update a customer by ID
        this.updateCustomer = async (customerId, customerData) => {
            const existingCustomer = await this.customerRepository.findOne({
                where: { id: customerId },
            });
            if (!existingCustomer) {
                return null; // Customer not found
            }
            const updatedCustomer = this.customerRepository.merge(existingCustomer, customerData);
            await this.customerRepository.save(updatedCustomer);
            return updatedCustomer;
        };
        // Delete a customer by ID
        this.deleteCustomer = async (customerId) => {
            const customerToDelete = await this.customerRepository.findOne({
                where: { id: customerId },
            });
            if (!customerToDelete) {
                return null; // Customer not found
            }
            await this.customerRepository.remove(customerToDelete);
            return customerToDelete;
        };
        this.customerRepository = repositories_1.CustomerRepository;
    }
}
exports.default = new CustomerService();
//# sourceMappingURL=customer.js.map