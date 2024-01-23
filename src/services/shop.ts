import { Request, Response } from 'express';
import { Shop } from '../models/shop';
import { Product } from '../models/product';
import { ShopRepository } from '../repositories';
import { Address } from '../models/address';

class ShopService {
    private readonly shopRepository: typeof ShopRepository;

    constructor() {
        this.shopRepository = ShopRepository;
    }

    /**
     * Retrieve all shops
     */
    public getAllShops = async (
        req: Request,
        res: Response
    ): Promise<Shop[]> => {
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

    public getShopById = async (shopId: string): Promise<Shop | null> => {
        try {
            const shop = await this.shopRepository.findOneOrFail({
                where: { id: shopId },
                relations: ['address', 'products'],
            });
            return shop;
        } catch (error) {
            console.error('Error retrieving shop by ID:', error.message);
            return null;
        }
    };

    /**
     * Create a new shop
     */
    public createShop = async (shopData: any): Promise<Shop> => {
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
            let address: Address;

            if (shopData.address.id) {
                address = await this.shopRepository.manager.findOne(
                    Address,
                    shopData.address.id
                );
            } else {
                address = this.shopRepository.manager.create(
                    Address,
                    shopData.address
                );
                await this.shopRepository.manager.save(Address, address);
            }

            // Set the address for the shop
            newShop.address = address;
        }

        // If 'products' are provided in shopData, find or create the product entities
        if (shopData.products && shopData.products.length > 0) {
            const productEntities: Product[] = [];

            for (const productData of shopData.products) {
                let product: Product;

                if (productData.id) {
                    product = await this.shopRepository.manager.findOne(
                        Product,
                        productData.id
                    );
                } else {
                    product = this.shopRepository.manager.create(
                        Product,
                        productData
                    );
                    await this.shopRepository.manager.save(Product, product);
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
    public updateShop = async (
        shopId: string,
        shopData: any
    ): Promise<Shop | null> => {
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
    public deleteShop = async (shopId: string): Promise<Shop | null> => {
        const shopToDelete = await this.shopRepository.findOne({
            where: { id: shopId },
        });

        if (!shopToDelete) {
            return null; // shop not found
        }

        await this.shopRepository.remove(shopToDelete);

        return shopToDelete;
    };
}

export default new ShopService();
