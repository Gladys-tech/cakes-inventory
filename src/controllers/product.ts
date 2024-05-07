import { Request, Response, request, response } from 'express';
import { ProductService } from '../services';

class ProductController {
    //getting all products
    public getProducts = async (req: Request, res: Response) => {
        const products = await ProductService.getAllProducts(req, res);

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
    public getProductById = async (req: Request, res: Response) => {
        const productId = req.params.id;

        try {
            const product = await ProductService.getProductById(productId);

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
        } catch (error) {
            console.error('Error retrieving product by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving product by ID.',
            });
        }
    };

    // creating a product
    public createProduct = async (req: Request, res: Response) => {
        const productData = req.body;

        try {
            const newProduct = await ProductService.createProduct(productData);

            res.status(201).json({
                status: 'CREATED',
                product: newProduct,
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating product.',
            });
        }
    };

    


    public removeProductImage = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.productId;
            const imageIndex = parseInt(req.params.imageIndex);

            const updatedProduct = await ProductService.removeProductImage(productId, imageIndex);

            if (!updatedProduct) {
                res.status(404).json({ message: 'Product not found or image index out of bounds' });
                return;
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error('Error removing product image:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    // updating a product
    public updateProduct = async (req: Request, res: Response) => {
        const productId = req.params.id;
        const productData = req.body;

        try {
            const updatedProduct = await ProductService.updateProduct(
                productId,
                productData
            );

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
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating product.',
            });
        }
    };

    // delete a product
    public deleteProduct = async (req: Request, res: Response) => {
        const productId = req.params.id;

        try {
            const deletedProduct = await ProductService.deleteProduct(
                productId
            );

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
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting product.',
            });
        }
    };
}

export default new ProductController();
