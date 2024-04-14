// import { Request, Response } from 'express';
// import { Shop } from '../models/shop';
// import { Product } from '../models/product';
// import { ShopRepository, UserRepository } from '../repositories';
// import { Address } from '../models/address';

// class ShopService {
//     private readonly shopRepository: typeof ShopRepository;
//     private readonly userRepository: typeof UserRepository; // Add UserRepository

//     constructor() {
//         this.shopRepository = ShopRepository;
//         this.userRepository = UserRepository; // Initialize UserRepository
//     }

//     /**
//      * Retrieve all shops
//      */
//     public getAllShops = async (
//         req: Request,
//         res: Response
//     ): Promise<Shop[]> => {
//         const shops = await this.shopRepository.find();
//         return shops;
//     };

//     /**
//      * Retrieve a shop by ID
//      */

//     public getShopById = async (shopId: string): Promise<Shop | null> => {
//         try {
//             const shop = await this.shopRepository.findOneOrFail({
//                 where: { id: shopId },
//                 relations: ['address', 'products', 'user'],
//             });
//             return shop;
//         } catch (error) {
//             console.error('Error retrieving shop by ID:', error.message);
//             return null;
//         }
//     };

//     /**
//      * Create a new shop
//      */
//     public createShop = async (
//         shopData: any,
//         userId: string
//     ): Promise<Shop> => {
//         try {
//             // Fetch user details based on userId
//             const user = await this.userRepository.findOne({
//                 where: { id: userId },
//             });

//             if (!user) {
//                 throw new Error('User not found');
//             }

//             // Create a new shop instance with basic data
//             const newShop = this.shopRepository.create({
//                 name: shopData.name,
//                 description: shopData.description,
//                 email: shopData.email,
//                 ownerName: shopData.ownerName,
//                 type: shopData.type,
//                 users: [user],

//             });

//             // If 'address' is provided in shopData, find or create the address entity
//             if (shopData.address) {
//                 let address: Address;

//                 if (shopData.address.id) {
//                     address = await this.shopRepository.manager.findOne(
//                         Address,
//                         shopData.address.id
//                     );
//                 } else {
//                     address = this.shopRepository.manager.create(
//                         Address,
//                         shopData.address
//                     );
//                     await this.shopRepository.manager.save(Address, address);
//                 }

//                 // Set the address for the shop
//                 newShop.address = address;
//             }

//             // If 'products' are provided in shopData, find or create the product entities
//             if (shopData.products && shopData.products.length > 0) {
//                 const productEntities: Product[] = [];

//                 for (const productData of shopData.products) {
//                     let product: Product;

//                     if (productData.id) {
//                         product = await this.shopRepository.manager.findOne(
//                             Product,
//                             productData.id
//                         );
//                     } else {
//                         product = this.shopRepository.manager.create(
//                             Product,
//                             productData
//                         );
//                         await this.shopRepository.manager.save(
//                             Product,
//                             product
//                         );
//                     }

//                     // Add the product to the array
//                     productEntities.push(product);
//                 }

//                 // Set the products for the shop
//                 newShop.products = productEntities;
//             }

//             // Save the new shop with its relationships
//             await this.shopRepository.save(newShop);

//             return newShop;
//         } catch (error) {
//             console.error('Error creating shop:', error.message);
//             throw error;
//         }
//     };

//     /**
//      * Update a shop by ID
//      */
//     public updateShop = async (
//         shopId: string,
//         shopData: any
//     ): Promise<Shop | null> => {
//         const existingShop = await this.shopRepository.findOne({
//             where: { id: shopId },
//         });

//         if (!existingShop) {
//             return null; // shop not found
//         }

//         const updatedShop = this.shopRepository.merge(existingShop, shopData);
//         await this.shopRepository.save(updatedShop);

//         return updatedShop;
//     };

//     /**
//      * Delete a shop by ID
//      */
//     public deleteShop = async (shopId: string): Promise<Shop | null> => {
//         const shopToDelete = await this.shopRepository.findOne({
//             where: { id: shopId },
//         });

//         if (!shopToDelete) {
//             return null; // shop not found
//         }

//         await this.shopRepository.remove(shopToDelete);

//         return shopToDelete;
//     };
// }

// export default new ShopService();

import { Request, Response } from 'express';
import { Shop } from '../models/shop';
import { Product } from '../models/product';
import { ShopRepository, UserRepository } from '../repositories';
import { Address } from '../models/address';

class ShopService {
    private readonly shopRepository: typeof ShopRepository;
    private readonly userRepository: typeof UserRepository; // Add UserRepository

    constructor() {
        this.shopRepository = ShopRepository;
        this.userRepository = UserRepository; // Initialize UserRepository
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
    public createShop = async (
        shopData: any,
        userId: string
    ): Promise<Shop> => {
        try {
            // Fetch user details based on userId
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // combination of first and last names
            const ownerName = `${user.firstName} ${user.lastName}`;

            // Create a new shop instance with basic data
            const newShop = this.shopRepository.create({
                name: shopData.name,
                description: shopData.description,
                email: shopData.email,
                // email:user.email,
                // ownerName: ownerName,
                ownerName: shopData.ownerName,
                type: shopData.type,
                users: [user],
                userId: user.id,
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
                        await this.shopRepository.manager.save(
                            Product,
                            product
                        );
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
        } catch (error) {
            console.error('Error creating shop:', error.message);
            throw error;
        }
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
