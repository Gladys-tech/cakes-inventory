import { Request, Response } from 'express';
import { TopSearchProductService } from '../services';

class TopSearchProductController {
    public getTopSearchProducts = async (req: Request, res: Response) => {
        try {
            const products = await TopSearchProductService.getAll();
            res.status(200).json({
                status: 'OK',
                products,
            });
        } catch (error) {
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving top search products.',
            });
        }
    };

    public addTopSearchProduct = async (req: Request, res: Response) => {
        const productData = req.body;
        try {
            const newProduct = await TopSearchProductService.addProduct(productData);
            res.status(201).json({
                status: 'CREATED',
                product: newProduct,
            });
        } catch (error) {
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error adding top search product.',
            });
        }
    };
}

export default new TopSearchProductController();
