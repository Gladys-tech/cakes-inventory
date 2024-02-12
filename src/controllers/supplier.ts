import { Request, Response } from 'express';
import { SupplierService } from '../services';

class SupplierController {


    // getting all suppliers
    public getSuppliers = async (req: Request, res: Response) => {
        const suppliers = await SupplierService.getAllSuppliers(req, res);
        if (!suppliers) {
            return res.status(404).send({
                status: 'NOT_FOUND',
                message: `suppliers not found.`,
            });
        }
        res.status(200).json({
            status: 'OK',
            suppliers,
        });
    };

    // getting supplier by id
    public getSupplierById = async (req: Request, res: Response) => {
        const supplierId = req.params.id;

        try {
            const supplier = await SupplierService.getSupplierById(supplierId);

            if (!supplier) {
                return res.status(404).send({
                    status: 'NOT_FOUND',
                    message: `Supplier not found with id: ${supplierId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                supplier,
            });
        } catch (error) {
            console.error('Error retrieving supplier by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving supplier by ID.',
            });
        }
    };

    // creating a supplier
    public createSupplier = async (req: Request, res: Response) => {
        const supplierData = req.body;
        const productId = supplierData.productId; 

        try {
            const newSupplier = await SupplierService.createSupplier(supplierData, productId);
            res.status(201).json({
                status: 'CREATED',
                supplier: newSupplier,
            });
        } catch (error) {
            console.error('Error creating supplier:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating supplier.',
            });
        }
    };

    // updating a supplier
    public updateSupplier = async (req: Request, res: Response) => {
        const supplierId = req.params.id;
        const supplierData = req.body;
        const productId = supplierData.productId; 

        try {
            const updatedSupplier = await SupplierService.updateSupplier(supplierId, supplierData, productId);

            if (!updatedSupplier) {
                res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Supplier not found with id: ${supplierId}`,
                });
                return;
            }

            res.status(200).json({
                status: 'OK',
                supplier: updatedSupplier,
            });
        } catch (error) {
            console.error('Error updating supplier:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating supplier.',
            });
        }
    };

    // deleting a supplier
    public deleteSupplier = async (req: Request, res: Response) => {
        const supplierId = req.params.id;

        try {
            const deletedSupplier = await SupplierService.deleteSupplier(supplierId);

            if (!deletedSupplier) {
                res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Supplier not found with id: ${supplierId}`,
                });
                return;
            }

            res.status(200).json({
                status: 'OK',
                message: `Supplier with id ${supplierId} has been deleted.`,
            });
        } catch (error) {
            console.error('Error deleting supplier:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting supplier.',
            });
        }
    };
    
}

export default new SupplierController();
