"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const shop_1 = require("../models/shop");
const productImage_1 = require("../models/productImage");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
class ProductService {
    constructor() {
        /**
         * Retrieve all products
         */
        this.getAllProducts = async (req, res) => {
            const products = await this.productRepository.find();
            return products;
        };
        /**
         * Retrieve a product by ID
         */
        this.getProductById = async (productId) => {
            const product = await this.productRepository.findOne({
                where: { id: productId },
                relations: ['images'], // Include the images relation
            });
            return product || null;
        };
        /**
         * Create a new product
         */
        this.createProduct = async (productData) => {
            const newProduct = this.productRepository.create({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                inventoryQuantity: productData.inventoryQuantity,
            });
            if (productData.shops && productData.shops.length > 0) {
                const shopIds = productData.shops.map((shopData) => shopData.shopId);
                try {
                    const shops = await this.productRepository.manager.findByIds(shop_1.Shop, shopIds);
                    newProduct.shops = shops;
                }
                catch (error) {
                    console.error('Error retrieving shops:', error);
                }
            }
            await this.productRepository.save(newProduct);
            if (productData.imageUrls && productData.imageUrls.length > 0) {
                await this.addProductImages(newProduct, productData.imageUrls.slice(0, 6));
            }
            return newProduct;
        };
        /**
         * Update a product by ID
         */
        this.updateProduct = async (productId, productData) => {
            const existingProduct = await this.productRepository.findOne({
                where: { id: productId },
            });
            if (!existingProduct) {
                return null; // product not found
            }
            const updatedProduct = this.productRepository.merge(existingProduct, productData);
            await this.productRepository.save(updatedProduct);
            return updatedProduct;
        };
        /**
         * Delete a product by ID
         */
        this.deleteProduct = async (productId) => {
            const productToDelete = await this.productRepository.findOne({
                where: { id: productId },
            });
            if (!productToDelete) {
                return null; // product not found
            }
            await this.productRepository.remove(productToDelete);
            return productToDelete;
        };
        this.productRepository = repositories_1.ProductRepository;
    }
    /**
     * Add product images
     */
    async addProductImages(product, imageUrls) {
        const uploadedImageUrls = await Promise.all(imageUrls.slice(0, 6).map(async (url, index) => {
            try {
                // Fetch the image
                const response = await axios_1.default.get(url, {
                    responseType: 'arraybuffer',
                });
                const buffer = Buffer.from(response.data);
                // Resize the image based on whether it's primary or thumbnail
                let resizedImageBuffer;
                if (product.primaryImageUrl) {
                    // Resize primary image to 500x500 pixels
                    resizedImageBuffer = await (0, sharp_1.default)(buffer)
                        .resize(500, 500)
                        .toBuffer();
                }
                else {
                    // Resize thumbnail image to 300x300 pixels
                    resizedImageBuffer = await (0, sharp_1.default)(buffer)
                        .resize(250, 250)
                        .toBuffer();
                }
                // Upload the resized images to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) {
                            console.error('Error uploading image to Cloudinary:', error);
                            reject(error);
                        }
                        else {
                            console.log('Upload Result:', result);
                            resolve(result);
                        }
                    });
                    uploadStream.end(resizedImageBuffer);
                });
                if (index === 0) {
                    // Set the first image as the primary image
                    product.primaryImageUrl = result.secure_url;
                }
                console.log('Upload Result:', result);
                return result.secure_url;
            }
            catch (error) {
                console.error('Error processing image with sharp and uploading to Cloudinary:', error);
                throw error;
            }
        }));
        const productImages = uploadedImageUrls.map((url) => {
            const image = new productImage_1.ProductImage();
            image.imageUrl = url;
            image.product = product;
            return image;
        });
        await this.productRepository.manager.save(productImage_1.ProductImage, productImages);
        await this.productRepository.save(product);
    }
}
exports.default = new ProductService();
//# sourceMappingURL=product.js.map