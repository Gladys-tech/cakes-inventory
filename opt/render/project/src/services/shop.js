"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const repositories_1 = require("../repositories");
const address_1 = require("../models/address");
class ShopService {
    constructor() {
        /**
         * Retrieve all shops
         */
        this.getAllShops = async (req, res) => {
            const shops = await this.shopRepository.find();
            return shops;
        };
        /**
         * Retrieve a shop by ID
         */
        // public getShopById = async (shopId: string): Promise<Shop | null> => {
        //     const shop = await this.shopRepository.findOne({
        //         where: { id: shopId },
        //         relations: ['address', 'products'], // Specify related entities to load
        //     });
        //     return shop || null;
        // };
        this.getShopById = async (shopId) => {
            try {
                const shop = await this.shopRepository.findOneOrFail({
                    where: { id: shopId },
                    relations: ['address', 'products'],
                });
                return shop;
            }
            catch (error) {
                console.error('Error retrieving shop by ID:', error.message);
                return null;
            }
        };
        /**
         * Create a new shop
         */
        this.createShop = async (shopData) => {
            // Create a new shop instance with basic data
            const newShop = this.shopRepository.create({
                name: shopData.name,
                description: shopData.description,
                email: shopData.email,
                ownerName: shopData.ownerName,
                type: shopData.type,
            });
            // If 'address' is provided in shopData, find or create the address entity
            if (shopData.address) {
                let address;
                if (shopData.address.id) {
                    address = await this.shopRepository.manager.findOne(address_1.Address, shopData.address.id);
                }
                else {
                    address = this.shopRepository.manager.create(address_1.Address, shopData.address);
                    await this.shopRepository.manager.save(address_1.Address, address);
                }
                // Set the address for the shop
                newShop.address = address;
            }
            // If 'products' are provided in shopData, find or create the product entities
            if (shopData.products && shopData.products.length > 0) {
                const productEntities = [];
                for (const productData of shopData.products) {
                    let product;
                    if (productData.id) {
                        product = await this.shopRepository.manager.findOne(product_1.Product, productData.id);
                    }
                    else {
                        product = this.shopRepository.manager.create(product_1.Product, productData);
                        await this.shopRepository.manager.save(product_1.Product, product);
                    }
                    // Add the product to the array
                    productEntities.push(product);
                }
                // Set the products for the shop
                newShop.products = productEntities;
            }
            // Save the new shop with its relationships
            await this.shopRepository.save(newShop);
            return newShop;
        };
        /**
         * Update a shop by ID
         */
        this.updateShop = async (shopId, shopData) => {
            const existingShop = await this.shopRepository.findOne({
                where: { id: shopId },
            });
            if (!existingShop) {
                return null; // shop not found
            }
            const updatedShop = this.shopRepository.merge(existingShop, shopData);
            await this.shopRepository.save(updatedShop);
            return updatedShop;
        };
        /**
         * Delete a shop by ID
         */
        this.deleteShop = async (shopId) => {
            const shopToDelete = await this.shopRepository.findOne({
                where: { id: shopId },
            });
            if (!shopToDelete) {
                return null; // shop not found
            }
            await this.shopRepository.remove(shopToDelete);
            return shopToDelete;
        };
        this.shopRepository = repositories_1.ShopRepository;
    }
}
exports.default = new ShopService();
//# sourceMappingURL=shop.js.map