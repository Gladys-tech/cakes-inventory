"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class ShopController {
    constructor() {
        // getting all shops
        this.getShops = async (req, res) => {
            const shops = await services_1.ShopService.getAllShops(req, res);
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
        this.getShopById = async (req, res) => {
            const shopId = req.params.id;
            try {
                const shop = await services_1.ShopService.getShopById(shopId);
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
            }
            catch (error) {
                console.error('Error retrieving shop by ID:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving shop by ID.',
                });
            }
        };
        // creating a shop
        this.createShop = async (req, res) => {
            const shopData = req.body;
            try {
                const newShop = await services_1.ShopService.createShop(shopData);
                res.status(201).json({
                    status: 'CREATED',
                    shop: newShop,
                });
            }
            catch (error) {
                console.error('Error creating shop:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating shop.',
                });
            }
        };
        // updating a shop
        this.updateShop = async (req, res) => {
            const shopId = req.params.id;
            const shopData = req.body;
            try {
                const updatedShop = await services_1.ShopService.updateShop(shopId, shopData);
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
            }
            catch (error) {
                console.error('Error updating shop:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error updating shop.',
                });
            }
        };
        // deleting a shop
        this.deleteShop = async (req, res) => {
            const shopId = req.params.id;
            try {
                const deletedShop = await services_1.ShopService.deleteShop(shopId);
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
            }
            catch (error) {
                console.error('Error deleting shop:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error deleting shop.',
                });
            }
        };
    }
}
exports.default = new ShopController();
//# sourceMappingURL=shop.js.map