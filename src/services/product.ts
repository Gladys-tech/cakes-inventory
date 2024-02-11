import { Request, Response } from 'express';
import { Product } from '../models/product';
import { ProductRepository } from '../repositories';
import { Shop } from '../models/shop';
import { ProductImage } from '../models/productImage';
import cloudinary from '../utils/cloudinary';
import sharp from 'sharp';
import { writeFile, unlink } from 'fs/promises';
import axios from 'axios';

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
            relations: ['images'], // Include the images relation
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
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
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
                                    console.error('Error uploading image to Cloudinary:', error);
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
     * Update a product by ID
     */
    public updateProduct = async (
        productId: string,
        productData: any
    ): Promise<Product | null> => {
        const existingProduct = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!existingProduct) {
            return null; // product not found
        }

        const updatedProduct = this.productRepository.merge(
            existingProduct,
            productData
        );
        await this.productRepository.save(updatedProduct);

        return updatedProduct;
    };

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
