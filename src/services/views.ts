import { TotalViewsRepository } from '../repositories';
import { TotalViews } from '../models/views';

class TotalViewsService {
    private readonly totalViewsRepository: typeof TotalViewsRepository;

    constructor() {
        this.totalViewsRepository = TotalViewsRepository;
    }

    public getTotalViews = async (
        TotalViewsId: string
    ): Promise<number> => {
        try {
            const views = await this.totalViewsRepository.findOne({
                where: { id: TotalViewsId },
            });
            return views ? views.count : 0;
        } catch (error) {
            console.error('Error retrieving total views:', error);
            throw new Error('Error retrieving total views.');
        }
    };

    public incrementViews = async (
        TotalViewsId: string
    ): Promise<number> => {
        try {
            let views = await this.totalViewsRepository.findOne({
                where: { id: TotalViewsId },
            });
            if (views) {
                views.count += 1;
                await this.totalViewsRepository.save(views);
                return views.count;
            } else {
                const newViews = this.totalViewsRepository.create({ count: 1 });
                await this.totalViewsRepository.save(newViews);
                return newViews.count;
            }
        } catch (error) {
            console.error('Error incrementing views:', error);
            throw new Error('Error incrementing views.');
        }
    };
}

export default new TotalViewsService();
