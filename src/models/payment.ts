import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Customer } from './customer';
import { Order } from './order';

export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Rejected = 'rejected',
    NotPaid = 'notpaid',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    dateOfPayment: string;

    @Column({ type: 'float' })
    amountPaid: number;

    @Column({ type: 'float', nullable: true })
    totalCommission: number;

    @Column({ type: 'float', nullable: true })
    actualMoney: number;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.Pending,
    })
    status: PaymentStatus;

    @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => Customer, (customer) => customer.payments)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;
}
