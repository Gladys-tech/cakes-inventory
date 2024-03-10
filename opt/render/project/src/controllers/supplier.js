"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class SupplierController {
    constructor() {
        // getting all suppliers
        this.getSuppliers = async (req, res) => {
            const suppliers = await services_1.SupplierService.getAllSuppliers(req, res);
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
        this.getSupplierById = async (req, res) => {
            const supplierId = req.params.id;
            try {
                const supplier = await services_1.SupplierService.getSupplierById(supplierId);
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
            }
            catch (error) {
                console.error('Error retrieving supplier by ID:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving supplier by ID.',
                });
            }
        };
        // creating a supplier
        this.createSupplier = async (req, res) => {
            const supplierData = req.body;
            const productId = supplierData.productId;
            try {
                const newSupplier = await services_1.SupplierService.createSupplier(supplierData, productId);
                res.status(201).json({
                    status: 'CREATED',
                    supplier: newSupplier,
                });
            }
            catch (error) {
                console.error('Error creating supplier:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating supplier.',
                });
            }
        };
        // updating a supplier
        this.updateSupplier = async (req, res) => {
            const supplierId = req.params.id;
            const supplierData = req.body;
            const productId = supplierData.productId;
            try {
                const updatedSupplier = await services_1.SupplierService.updateSupplier(supplierId, supplierData, productId);
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
            }
            catch (error) {
                console.error('Error updating supplier:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error updating supplier.',
                });
            }
        };
        // deleting a supplier
        this.deleteSupplier = async (req, res) => {
            const supplierId = req.params.id;
            try {
                const deletedSupplier = await services_1.SupplierService.deleteSupplier(supplierId);
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
            }
            catch (error) {
                console.error('Error deleting supplier:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error deleting supplier.',
                });
            }
        };
    }
}
exports.default = new SupplierController();
//# sourceMappingURL=supplier.js.map