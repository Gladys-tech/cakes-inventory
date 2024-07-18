import { Request, Response } from 'express';
import { VisitorService } from '../services';

class VisitorController {
    public getVisitors = async (req: Request, res: Response) => {
        try {
            const visitors = await VisitorService.getAll();
            res.status(200).json({
                status: 'OK',
                visitors,
            });
        } catch (error) {
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving visitors.',
            });
        }
    };

    public addVisitor = async (req: Request, res: Response) => {
        const visitorData = req.body;
        try {
            const newVisitor = await VisitorService.addVisitor(visitorData);
            res.status(201).json({
                status: 'CREATED',
                visitor: newVisitor,
            });
        } catch (error) {
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error adding visitor.',
            });
        }
    };
}

export default new VisitorController();
