import { Request, Response } from 'express';
import { ShopService } from '../services';

class ShopController {
    // getting all shops
    public getShops = async (req: Request, res: Response) => {
        const shops = await ShopService.getAllShops(req, res);
        if (!shops) {
            return res.status(404).send({
                status: 'NOT_FOUND',
                message: `shops not found.`,
            });
        }
        res.status(200).json({
            status: 'OK',
            shops,
        });
    };

    // getting shop by id
    public getShopById = async (req: Request, res: Response) => {
        const shopId = req.params.id;

        try {
            const shop = await ShopService.getShopById(shopId);

            if (!shop) {
                return res.status(404).send({
                    status: 'NOT_FOUND',
                    message: `Shop not found with id: ${shopId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                shop,
            });
        } catch (error) {
            console.error('Error retrieving shop by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving shop by ID.',
            });
        }
    };

    // creating a shop
    public createShop = async (req: Request, res: Response) => {
        const shopData = req.body;
        const userId = req.user.id;

        try {
            const newShop = await ShopService.createShop(shopData, userId);
            res.status(201).json({
                status: 'CREATED',
                shop: newShop,
            });
        } catch (error) {
            console.error('Error creating shop:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating shop.',
            });
        }
    };

    // updating a shop

    public updateShop = async (req: Request, res: Response) => {
        const shopId = req.params.id;
        const shopData = req.body;

        try {
            const updatedShop = await ShopService.updateShop(shopId, shopData);

            if (!updatedShop) {
                res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Shop not found with id: ${shopId}`,
                });
                return;
            }

            res.status(200).json({
                status: 'OK',
                shop: updatedShop,
            });
        } catch (error) {
            console.error('Error updating shop:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating shop.',
            });
        }
    };

    // deleting a shop
    public deleteShop = async (req: Request, res: Response) => {
        const shopId = req.params.id;

        try {
            const deletedShop = await ShopService.deleteShop(shopId);

            if (!deletedShop) {
                res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Shop not found with id: ${shopId}`,
                });
                return;
            }

            res.status(200).json({
                status: 'OK',
                message: `Shop with id ${shopId} has been deleted.`,
            });
        } catch (error) {
            console.error('Error deleting shop:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting shop.',
            });
        }
    };
}

export default new ShopController();
