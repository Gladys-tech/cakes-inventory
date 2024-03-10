"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const repositories_2 = require("../repositories");
class DeliveryService {
    constructor() {
        /**
         * create delivery
         */
        this.createDelivery = async (data) => {
            const { orderId, userId, productId, status } = data;
            // Fetch the related entities
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
            });
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });
            const product = await this.productRepository.findOne({
                where: { id: productId },
            });
            if (!order || !user || !product) {
                throw new Error('Order, user, or product not found');
            }
            const newDelivery = this.deliveryRepository.create({
                order,
                user,
                product,
                status,
                // ... other properties from data
            });
            return this.deliveryRepository.save(newDelivery);
        };
        /**
         * Retrieve delivery by id
         */
        this.getDeliveryById = async (deliveryId) => {
            return this.deliveryRepository.findOne({
                where: { id: deliveryId },
            });
        };
        /**
         * updatedelivery
         */
        this.updateDelivery = async (deliveryId, updatedData) => {
            const existingDelivery = await this.deliveryRepository.findOne({
                where: { id: deliveryId },
            });
            if (!existingDelivery) {
                return null; // delivery not found
            }
            const updatedDelivery = this.deliveryRepository.merge(existingDelivery, updatedData);
            return this.deliveryRepository.save(updatedDelivery);
        };
        // async updateDelivery(deliveryId: string, newStatus: DeliveryStatus): Promise<Delivery> {
        //     const delivery = await this.deliveryRepository.findOneOrFail({
        //         where: { id: deliveryId },
        //         relations: ['order', 'user', 'product'],
        //     });
        //     if (!delivery.order) {
        //         throw new Error('Order not found for the given delivery');
        //     }
        //     // Update Delivery status
        //     delivery.status = newStatus as DeliveryStatus;
        //     // Map DeliveryStatus to OrderStatus (string)
        //     let status: string = '';
        //     switch (delivery.status) {
        //         case DeliveryStatus.CONFIRMED:
        //             status = 'order confirmed';
        //             break;
        //         case DeliveryStatus.TRANSIT:
        //             status = 'order in transit';
        //             break;
        //         case DeliveryStatus.DELAYED:
        //             status = 'order delayed';
        //             break;
        //         case DeliveryStatus.DELIVERED:
        //             status = 'order delivered';
        //             break;
        //         case DeliveryStatus.CANCELLED:
        //             status = 'order cancelled';
        //             break;
        //         default:
        //             // Handle 'order made' separately
        //             status = delivery.status === 'order made' ? 'order made' : 'default order status';
        //             break;
        //     }
        //     // Update Order status
        //     delivery.order.status = status;
        //     // Save changes to both entities
        //     await Promise.all([
        //         this.deliveryRepository.save(delivery),
        //         this.orderRepository.save(delivery.order),
        //     ]);
        //     return delivery;
        // }
        /**
         * deletedelivery
         */
        this.deleteDelivery = async (deliveryId) => {
            const deliveryToDelete = await this.deliveryRepository.findOne({
                where: { id: deliveryId },
            });
            if (!deliveryToDelete) {
                return null; // delivery not found
            }
            await this.deliveryRepository.remove(deliveryToDelete);
            return deliveryToDelete;
        };
        this.deliveryRepository = repositories_2.DeliveryRepository;
        this.orderRepository = repositories_1.OrderRepository;
        this.productRepository = repositories_1.ProductRepository;
        this.userRepository = repositories_1.UserRepository;
    }
}
exports.default = new DeliveryService();
//# sourceMappingURL=delivery.js.map