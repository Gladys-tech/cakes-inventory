import { TopSearchProductRepository } from '../repositories';
import { TopSearchProduct } from '../models/search';

class TopSearchProductService {
    private readonly topSearchProductRepository: typeof TopSearchProductRepository;

    constructor() {
        this.topSearchProductRepository = TopSearchProductRepository;
    }

    /**
     * Retrieve all top search products
     */
    public getAll = async (): Promise<TopSearchProduct[]> => {
        return await this.topSearchProductRepository.find();
    };

    /**
     * Add a new top search product
     */
    public addProduct = async (productData: Partial<TopSearchProduct>): Promise<TopSearchProduct> => {
        const newProduct = this.topSearchProductRepository.create(productData);
        return await this.topSearchProductRepository.save(newProduct);
    };
}

export default new TopSearchProductService();
