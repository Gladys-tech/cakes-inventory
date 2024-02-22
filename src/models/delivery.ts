import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './order';
import { User } from './user';
import { Product } from './product';

export enum DeliveryStatus {
    ORDER_MADE = 'order made',
    CONFIRMED = 'confirmed',
    TRANSIT = 'transit',
    DELAYED = 'delayed',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity()
export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: DeliveryStatus,
        default: DeliveryStatus.CONFIRMED,
    })
    status: DeliveryStatus;

    @ManyToOne(() => Order, (order) => order.delivery)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => User, (user) => user.delivery)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Product, (product) => product.delivery)
    @JoinColumn({ name: 'productId' })
    product: Product;
}
