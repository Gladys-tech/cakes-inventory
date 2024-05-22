import { Request, Response } from 'express';
import { Product } from '../models/product';
import { ProductRepository } from '../repositories';
import { Shop } from '../models/shop';
import { ProductImage } from '../models/productImage';
import cloudinary from '../utils/cloudinary';
import sharp from 'sharp';
import { writeFile, unlink } from 'fs/promises';
import axios from 'axios';
import { Supplier } from '../models/supplier';

class ProductService {
    private readonly productRepository: typeof ProductRepository;

    constructor() {
        this.productRepository = ProductRepository;
    }

    /**
     * Retrieve all products
     */
    public getAllProducts = async (
        req: Request,
        res: Response
    ): Promise<Product[]> => {
        const products = await this.productRepository.find();
        return products;
    };

    /**
     * Retrieve a product by ID
     */
    public getProductById = async (
        productId: string
    ): Promise<Product | null> => {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['shops', 'images', 'supplier', 'orders'], // Include the 'shops' relation
        });
        return product || null;
    };

    /**
     * Add product images
     */
    private async addProductImages(
        product: Product,
        imageUrls: string[]
    ): Promise<void> {
        const uploadedImageUrls = await Promise.all(
            imageUrls.slice(0, 6).map(async (url, index) => {
                try {
                    // Fetch the image
                    const response = await axios.get(url, {
                        responseType: 'arraybuffer',
                    });
                    const buffer = Buffer.from(response.data);

                    // Resize the image based on whether it's primary or thumbnail
                    let resizedImageBuffer;
                    if (product.primaryImageUrl) {
                        // Resize primary image to 500x500 pixels
                        resizedImageBuffer = await sharp(buffer)
                            .resize(500, 500)
                            .toBuffer();
                    } else {
                        // Resize thumbnail image to 300x300 pixels
                        resizedImageBuffer = await sharp(buffer)
                            .resize(250, 250)
                            .toBuffer();
                    }
                    // Upload the resized images to Cloudinary
                    const result: any = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            { resource_type: 'image' },
                            (error, result) => {
                                if (error) {
                                    console.error(
                                        'Error uploading image to Cloudinary:',
                                        error
                                    );
                                    reject(error);
                                } else {
                                    console.log('Upload Result:', result);
                                    resolve(result);
                                }
                            }
                        );
                        uploadStream.end(resizedImageBuffer);
                    });

                    if (index === 0) {
                        // Set the first image as the primary image
                        product.primaryImageUrl = result.secure_url;
                    }
                    console.log('Upload Result:', result);

                    return result.secure_url;
                } catch (error) {
                    console.error(
                        'Error processing image with sharp and uploading to Cloudinary:',
                        error
                    );
                    throw error;
                }
            })
        );

        const productImages = uploadedImageUrls.map((url) => {
            const image = new ProductImage();
            image.imageUrl = url;
            image.product = product;
            return image;
        });

        await this.productRepository.manager.save(ProductImage, productImages);
        await this.productRepository.save(product);
    }

    /**
     * Create a new product
     */
    public createProduct = async (productData: any): Promise<Product> => {
        const newProduct = this.productRepository.create({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            inventoryQuantity: productData.inventoryQuantity,
            category: productData.category,
            shops: productData.shops, // Assign shops directly to the product
        });

        if (productData.shops && productData.shops.length > 0) {
            const shopIds = productData.shops.map(
                (shopData: any) => shopData.shopId
            );

            try {
                const shops = await this.productRepository.manager.findByIds(
                    Shop,
                    shopIds
                );
                newProduct.shops = shops;
            } catch (error) {
                console.error('Error retrieving shops:', error);
            }
        }

        await this.productRepository.save(newProduct);

        if (productData.imageUrls && productData.imageUrls.length > 0) {
            await this.addProductImages(
                newProduct,
                productData.imageUrls.slice(0, 6)
            );
        }

        return newProduct;
    };

    /**
     * Remove product image by index
     */
    public async removeProductImage(
        productId: string,
        imageIndex: number
    ): Promise<Product | null> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['images'],
        });

        if (!product || !product.images || !product.images[imageIndex]) {
            return null; // Product not found or image index out of bounds
        }

        const imageToRemove = product.images[imageIndex];

        try {
            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(imageToRemove.imageUrl);

            // Remove image from database
            await this.productRepository.manager.remove(
                ProductImage,
                imageToRemove
            );

            // Update product's images array
            product.images.splice(imageIndex, 1);

            // If primary image is removed, set new primary image
            if (imageToRemove.imageUrl === product.primaryImageUrl) {
                product.primaryImageUrl =
                    product.images.length > 0
                        ? product.images[0].imageUrl
                        : null;
            }

            await this.productRepository.save(product);
            return product;
        } catch (error) {
            console.error('Error removing image:', error);
            throw error;
        }
    }
    /**
     * Update a product by ID
     */
    public updateProduct = async (
        productId: string,
        productData: any
    ): Promise<Product | null> => {
        const existingProduct = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['images', 'supplier', 'shops', 'orders', 'delivery'], // Load existing images for updating
        });

        if (!existingProduct) {
            return null; // Product not found
        }

        console.log('Product ID before update:', existingProduct.id);

        // Update product data
        if (productData.name !== undefined) {
            existingProduct.name = productData.name;
        }
        if (productData.description !== undefined) {
            existingProduct.description = productData.description;
        }
        if (productData.price !== undefined) {
            existingProduct.price = productData.price;
        }
        if (productData.inventoryQuantity !== undefined) {
            existingProduct.inventoryQuantity = productData.inventoryQuantity;
        }
        if (productData.category !== undefined) {
            existingProduct.category = productData.category;
        }
        if (productData.shops !== undefined) {
            existingProduct.shops = productData.shops; // Assign shops directly to the product
        }

        // Add new images if provided
        if (productData.imageUrls && productData.imageUrls.length > 0) {
            try {
                // Add new images
                const newImageUrls = productData.imageUrls.slice(0, 6);
                await this.addNewProductImages(existingProduct, newImageUrls);
            } catch (error) {
                console.error('Error adding new images:', error);
                throw error;
            }
        }

        // Save the updated product
        try {
            await this.productRepository.save(existingProduct);
            console.log('Product ID after update:', existingProduct.id);
            // Construct a plain object with necessary properties to return in the response
            const updatedProduct = {
                id: existingProduct.id,
                name: existingProduct.name,
                description: existingProduct.description,
                price: existingProduct.price,
                inventoryQuantity: existingProduct.inventoryQuantity,
                productStatus: existingProduct.productStatus,
                primaryImageUrl: existingProduct.primaryImageUrl,
                category: existingProduct.category,
                createdAt: existingProduct.createdAt,
                updatedAt: existingProduct.updatedAt,
                images: existingProduct.images.map((image) => ({
                    id: image.id,
                    imageUrl: image.imageUrl,
                })),
                supplier: existingProduct.supplier,
                shops: existingProduct.shops,
                orders: existingProduct.orders,
                delivery: existingProduct.delivery,
            };
            return updatedProduct as Product;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };

    private async addNewProductImages(
        product: Product,
        imageUrls: string[]
    ): Promise<void> {
        const existingImages = product.images || []; // Retrieve existing images

        const uploadedImageUrls = await Promise.all(
            imageUrls.map(async (url, index) => {
                try {
                    // Upload new images to Cloudinary
                    const result: any = await cloudinary.uploader.upload(url, {
                        resource_type: 'image',
                    });

                    // Set the first image as the primary image if it's not already set
                    if (index === 0 && !product.primaryImageUrl) {
                        product.primaryImageUrl = result.secure_url;
                    }

                    return result.secure_url;
                } catch (error) {
                    console.error(
                        'Error uploading image to Cloudinary:',
                        error
                    );
                    throw error;
                }
            })
        );

        // Create new ProductImage instances for new images
        const newImages = uploadedImageUrls.map((url) => {
            const image = new ProductImage();
            image.imageUrl = url;
            image.product = product;
            return image;
        });

        // Combine existing and new images
        product.images = existingImages.concat(newImages);

        // Save the images
        await this.productRepository.manager.save(ProductImage, newImages);
    }

    /**
     * Delete a product by ID
     */
    public deleteProduct = async (
        productId: string
    ): Promise<Product | null> => {
        const productToDelete = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!productToDelete) {
            return null; // product not found
        }

        await this.productRepository.remove(productToDelete);

        return productToDelete;
    };
}

export default new ProductService();
