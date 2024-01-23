import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Customer } from './customer';

/**
 * @schema order
 *
 * title: order
 *
 * description: Order entity
 *
 * x-resourceId: `order`
 *
 * properties:
 *
 *     - id:
 *         type: `integer`
 *         description: The unique identifier for the order.
 *     - serialNumber:
 *         type: `string`
 *         description: Auto-generated serial number for the product in the order.
 *     - orderValue:
 *         type: `number`
 *         description: Total price of the order.
 *     - quantity:
 *         type: `integer`
 *         description: Total number of products in the order.
 *     - client:
 *         type: `string`
 *         description: Name of the customer placing the order.
 *     - expectedDeliveryDate:
 *         type: `string`
 *         format: `date`
 *         description: Expected date of delivery for the order.
 *     - status:
 *         type: `string`
 *         enum: [order made, confirmed, transit, delivered, cancelled, delayed]
 *         description: Status of the order.
 *
 * @relation Customer
 */
@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ generated: 'uuid' })
    serialNumber: string;

    @Column({ type: 'float' })
    orderValue: number;

    @Column({ type: 'integer' })
    quantity: number;

    @Column()
    client: string;

    @Column({ type: 'date' })
    expectedDeliveryDate: string;

    @Column({
        type: 'enum',
        enum: ['order made', 'confirmed', 'transit', 'delivered', 'cancelled', 'delayed'],
        default: 'order made',
    })
    status: string;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;
}
