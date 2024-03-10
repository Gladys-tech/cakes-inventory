"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
class OrderService {
    constructor() {
        /**
         * Retrieve all orders
         */
        this.getAllOrders = async (req, res) => {
            const orders = await this.orderRepository.find();
            return orders;
        };
        /**
         * Retrieve an order by ID with detailed product information
         */
        this.getOrderById = async (orderId) => {
            try {
                const order = await this.orderRepository.findOneOrFail({
                    where: { id: orderId },
                    relations: ['customer', 'products'],
                });
                // Fetch detailed product information for each item in the cart
                const cartWithProductInfo = await Promise.all(order.customer.cart.map(async (cartItem) => {
                    const productInfo = await this.productRepository.findOne({
                        where: { id: cartItem.productId },
                    });
                    return {
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        productInfo: productInfo || null, // Include product information or null if not found
                    };
                }));
                // Modify the order object to include detailed product information in the cart
                const orderWithCartInfo = Object.assign(Object.assign({}, order), { products: cartWithProductInfo
                        .map((cartItem) => cartItem.productInfo)
                        .filter((productInfo) => productInfo !== null) });
                return orderWithCartInfo;
            }
            catch (error) {
                console.error('Error retrieving order by ID:', error.message);
                return null;
            }
        };
        /**
         * Create a new order
         */
        this.createOrder = async (orderData) => {
            const currentDate = new Date();
            const expectedDeliveryDate = new Date(currentDate);
            expectedDeliveryDate.setDate(currentDate.getDate() + 3);
            // Create a new order instance with basic data
            const newOrder = this.orderRepository.create({
                // serialNumber: orderData.serialNumber, // Add 'serialNumber' to your Order model if necessary
                orderValue: 0,
                quantity: 0,
                // client: orderData.client,
                client: orderData.customer
                    ? this.generateClientName(orderData.customer)
                    : '',
                expectedDeliveryDate: expectedDeliveryDate
                    .toISOString()
                    .split('T')[0], // Format as 'YYYY-MM-DD'
                status: orderData.status,
                paymentMethod: orderData.paymentMethod,
            });
            // If 'customer' is provided in orderData, find customer.
            if (orderData.customer && orderData.customer.customerId) {
                try {
                    const customer = await this.customerRepository.findOneOrFail({
                        where: { id: orderData.customer.customerId },
                    });
                    newOrder.customer = customer;
                    // If 'cart' is available in the customer data, proceed with updating products
                    if (customer.cart && customer.cart.length > 0) {
                        const productEntities = [];
                        // Concatenate first and last names for the client field
                        const clientName = customer.firstName && customer.lastName
                            ? `${customer.firstName} ${customer.lastName}`
                            : '';
                        // Set the client field
                        newOrder.client = clientName;
                        // Loop through the customer's cart before checking products
                        for (const cartItem of customer.cart) {
                            const productId = cartItem.productId;
                            const productQuantity = cartItem.quantity;
                            try {
                                // Find existing product by ID
                                const product = await this.productRepository.findOne({
                                    where: { id: cartItem.productId },
                                });
                                if (product) {
                                    // Check if the product is in the customer's cart
                                    // Reduce inventoryQuantity by the quantity in the customer's cart
                                    const reducedQuantity = Math.min(cartItem.quantity, product.inventoryQuantity);
                                    product.inventoryQuantity -= reducedQuantity;
                                    // Check if inventoryQuantity is non-negative
                                    if (product.inventoryQuantity < 0) {
                                        console.error('Insufficient inventory for product:', product.name);
                                        throw new Error('Insufficient inventory');
                                    }
                                    // Calculate orderValue based on product price and quantity
                                    newOrder.orderValue +=
                                        product.price * reducedQuantity;
                                    // Update quantity
                                    newOrder.quantity += reducedQuantity;
                                    // Save the updated product to the database
                                    await this.productRepository.save(product);
                                    productEntities.push(product);
                                }
                                else {
                                    console.error('Product not found with ID:', cartItem.productId);
                                }
                            }
                            catch (error) {
                                console.error('Error retrieving product:', error.message);
                            }
                        }
                        // Set the products for the order
                        newOrder.products = productEntities;
                    }
                    else {
                        // If the cart is empty, throw an error or handle it as needed
                        console.error('Customer cart is empty. Cannot create an order.');
                        return {
                            message: 'Customer cart is empty. Cannot create an order.',
                            status: 'EmptyCartError',
                        };
                    }
                }
                catch (error) {
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
            // if (savedOrder.status === 'order made' && savedOrder.customer) {
            //     savedOrder.customer.cart = [];
            //     await this.customerRepository.save(savedOrder.customer);
            // }
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
        this.updateOrder = async (orderId, orderData) => {
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
        this.deleteOrder = async (orderId) => {
            const orderToDelete = await this.orderRepository.findOne({
                where: { id: orderId },
            });
            if (!orderToDelete) {
                return null; // order not found
            }
            await this.orderRepository.remove(orderToDelete);
            return orderToDelete;
        };
        this.orderRepository = repositories_1.OrderRepository;
        this.productRepository = repositories_1.ProductRepository;
        this.customerRepository = repositories_1.CustomerRepository;
    }
    /**
     * Generate client name based on customer's first and last names
     */
    async generateClientName(customerId) {
        try {
            const customer = await this.customerRepository.findOneOrFail({
                where: { id: customerId },
            });
            if (customer.firstName && customer.lastName) {
                return `${customer.firstName} ${customer.lastName}`;
            }
            return ''; // Return an empty string if either firstName or lastName is undefined
        }
        catch (error) {
            console.error('Error retrieving customer:', error.message);
            return ''; // Return an empty string in case of an error
        }
    }
}
exports.default = new OrderService();
//# sourceMappingURL=order.js.map