import { VisitorRepository } from '../repositories';
import { Visitor } from '../models/visitor';

class VisitorService {
    private readonly visitorRepository: typeof VisitorRepository;

    constructor() {
        this.visitorRepository = VisitorRepository;
    }

    /**
     * Retrieve all visitors
     */
    public getAll = async (): Promise<Visitor[]> => {
        return await this.visitorRepository.find();
    };

    /**
     * Add a new visitor
     */
    public addVisitor = async (
        visitorData: Partial<Visitor>
    ): Promise<Visitor> => {
        const newVisitor = this.visitorRepository.create(visitorData);
        return await this.visitorRepository.save(newVisitor);
    };
}

export default new VisitorService();
