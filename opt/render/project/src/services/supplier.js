"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const repositories_2 = require("../repositories");
class SupplierService {
    constructor() {
        /**
         * Retrieve all suppliers
         */
        this.getAllSuppliers = async (req, res) => {
            const suppliers = await this.supplierRepository.find();
            return suppliers;
        };
        /**
         * Retrieve a supplier by ID
         */
        this.getSupplierById = async (supplierId) => {
            try {
                const supplier = await this.supplierRepository.findOneOrFail({
                    where: { id: supplierId },
                    relations: ['product'],
                });
                return supplier;
            }
            catch (error) {
                console.error('Error retrieving supplier by ID:', error.message);
                return null;
            }
        };
        /**
         * Create a new supplier
         */
        this.createSupplier = async (supplierData, productId) => {
            try {
                const product = await this.productRepository.findOneOrFail({
                    where: { id: productId },
                });
                // Add suppliedQuantity to inventoryQuantity
                product.inventoryQuantity += supplierData.suppliedQuantity;
                // Save the updated product
                await this.productRepository.save(product);
                const newSupplier = this.supplierRepository.create({
                    name: supplierData.name,
                    contactPerson: supplierData.contactPerson,
                    contactEmail: supplierData.contactEmail,
                    suppliedQuantity: supplierData.suppliedQuantity,
                    returnedQuantity: 0, // Set returnedQuantity to 0 by default
                    product,
                });
                const savedSupplier = await this.supplierRepository.save(newSupplier);
                return savedSupplier;
            }
            catch (error) {
                console.error('Error creating supplier:', error.message);
                return null;
            }
        };
        /**
         * Update an existing supplier
         */
        this.updateSupplier = async (supplierId, supplierData, productId) => {
            try {
                const supplierToUpdate = await this.supplierRepository.findOneOrFail({
                    where: { id: supplierId },
                });
                supplierToUpdate.name = supplierData.name;
                supplierToUpdate.contactPerson = supplierData.contactPerson;
                supplierToUpdate.contactEmail = supplierData.contactEmail;
                supplierToUpdate.suppliedQuantity = supplierData.suppliedQuantity;
                supplierToUpdate.returnedQuantity = supplierData.returnedQuantity;
                // Update product's inventoryQuantity by adding the new suppliedQuantity
                const product = await this.productRepository.findOneOrFail({
                    where: { id: productId },
                });
                product.inventoryQuantity += supplierData.suppliedQuantity;
                // Save changes to both supplier and product
                await this.supplierRepository.save(supplierToUpdate);
                await this.productRepository.save(product);
                return supplierToUpdate;
            }
            catch (error) {
                console.error('Error updating supplier:', error.message);
                return null;
            }
        };
        /**
         * Delete a supplier by ID
         */
        this.deleteSupplier = async (supplierId) => {
            try {
                const supplierToDelete = await this.supplierRepository.findOne({
                    where: { id: supplierId },
                });
                if (!supplierToDelete) {
                    return null; // supplier not found
                }
                await this.supplierRepository.remove(supplierToDelete);
                return supplierToDelete;
            }
            catch (error) {
                console.error('Error deleting supplier:', error.message);
                return null;
            }
        };
        this.productRepository = repositories_2.ProductRepository;
        this.supplierRepository = repositories_1.SupplierRepository;
    }
}
exports.default = new SupplierService();
//# sourceMappingURL=supplier.js.map