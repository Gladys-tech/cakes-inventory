"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class ProductController {
    constructor() {
        //getting all products
        this.getProducts = async (req, res) => {
            const products = await services_1.ProductService.getAllProducts(req, res);
            if (!products) {
                return res.status(404).send({
                    status: 'NOT_FOUND',
                    message: `product not found.`,
                });
            }
            res.status(200).json({
                status: 'OK',
                products,
            });
        };
        // getting product by id
        this.getProductById = async (req, res) => {
            const productId = req.params.id;
            try {
                const product = await services_1.ProductService.getProductById(productId);
                if (!product) {
                    return res.status(404).send({
                        status: 'NOT_FOUND',
                        message: `product not found with id: ${productId}`,
                    });
                }
                res.status(200).json({
                    status: 'OK',
                    product,
                });
            }
            catch (error) {
                console.error('Error retrieving product by ID:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving product by ID.',
                });
            }
        };
        // creating a product
        this.createProduct = async (req, res) => {
            const productData = req.body;
            try {
                const newProduct = await services_1.ProductService.createProduct(productData);
                res.status(201).json({
                    status: 'CREATED',
                    product: newProduct,
                });
            }
            catch (error) {
                console.error('Error creating product:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating product.',
                });
            }
        };
        // updating a product
        this.updateProduct = async (req, res) => {
            const productId = req.params.id;
            const productData = req.body;
            try {
                const updatedProduct = await services_1.ProductService.updateProduct(productId, productData);
                if (!updatedProduct) {
                    return res.status(404).json({
                        status: 'NOT_FOUND',
                        message: `product not found with id: ${productId}`,
                    });
                }
                res.status(200).json({
                    status: 'OK',
                    product: updatedProduct,
                });
            }
            catch (error) {
                console.error('Error updating product:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error updating product.',
                });
            }
        };
        // delete a product
        this.deleteProduct = async (req, res) => {
            const productId = req.params.id;
            try {
                const deletedProduct = await services_1.ProductService.deleteProduct(productId);
                if (!deletedProduct) {
                    return res.status(404).json({
                        status: 'NOT_FOUND',
                        message: `product not found with id: ${productId}`,
                    });
                }
                res.status(200).json({
                    status: 'OK',
                    message: `product with id ${productId} has been deleted.`,
                });
            }
            catch (error) {
                console.error('Error deleting product:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error deleting product.',
                });
            }
        };
    }
}
exports.default = new ProductController();
//# sourceMappingURL=product.js.map