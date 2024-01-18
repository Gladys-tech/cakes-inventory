import { Request, Response } from 'express';
import { Product } from '../models/product';
import { ProductRepository } from '../repositories';
import { Shop } from '../models/shop';


class ProductService {
    private readonly productRepository: typeof ProductRepository;

    constructor() {
        this.productRepository = ProductRepository;
    }

    /**
     * Retrieve all products
     */
    public getAllProducts = async (req: Request, res: Response): Promise<Product[]> => {
        const products = await this.productRepository.find();
        return products;
    };


    /**
     * Retrieve a product by ID
     */
    public getProductById = async (productId: string): Promise<Product | null> => {
        const product = await this.productRepository.findOne({
            where: { id: productId },

        });
        return product || null;
    };



    /**
     * Create a new product
     */
    public createProduct = async (productData: any): Promise<Product> => {
        const newProduct = this.productRepository.create({
            name: productData.name,
            description: productData.description,
            price: productData.price,
        });

        if (productData.shops && productData.shops.length > 0) {
            const shopIds = productData.shops.map((shopData: any) => shopData.shopId);

            try {
                const shops = await this.productRepository.manager.findByIds(Shop, shopIds);
                newProduct.shops = shops;
            } catch (error) {
                console.error('Error retrieving shops:', error);
            }
        }

        await this.productRepository.save(newProduct);

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

        const updatedProduct = this.productRepository.merge(existingProduct, productData);
        await this.productRepository.save(updatedProduct);

        return updatedProduct;
    };


    /**
     * Delete a product by ID
     */
    public deleteProduct = async (productId: string): Promise<Product | null> => {
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