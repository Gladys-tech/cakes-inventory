import { Request, Response } from 'express';
import { TotalViewsService } from '../services';

class TotalViewsController {
    public getTotalViews = async (req: Request, res: Response) => {
        const TotalViewsId = req.params.id;
        try {
            const totalViews = await TotalViewsService.getTotalViews(TotalViewsId);
            res.status(200).json({
                status: 'OK',
                totalViews,
            });
        } catch (error) {
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving total views.',
            });
        }
    };

    public incrementViews = async (req: Request, res: Response) => {
        const TotalViewsId = req.params.id;
        try {
            const updatedViews = await TotalViewsService.incrementViews(TotalViewsId);
            res.status(200).json({
                status: 'OK',
                totalViews: updatedViews,
            });
        } catch (error) {
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error incrementing views.',
            });
        }
    };
}

export default new TotalViewsController();
