import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
} from 'typeorm';
// import { SoftDeletableEntity } from './abstracts/soft-deleteable';
import { Order } from './order';

// /**
//  * @schema customer
//  *
//  * title: customer
//  *
//  * description: Customer entity
//  *
//  * x-resourceId: `customer`
//  *
//  * properties:
//  *
//  *     - id:
//  *         type: `integer`
//  *         description: The unique identifier for the customer.
//  *     - firstName:
//  *         type: `string`
//  *         description: The first name of the customer.
//  *     - lastName:
//  *         type: `string`
//  *         description: The last name of the customer.
//  *     - email:
//  *         type: `string`
//  *         description: The email address of the customer.
//  *     - location:
//  *         type: `string`
//  *         description: The location of the customer.
//  *     - telphone:
//  *          type: `number`
//  *          description: The phone number for the customer
//  *     - isEmailVerified:
//  *         type: `boolean`
//  *         description: Whether the customer has verified their email address.
//  *     - cart:
//  *         type: `json`
//  *         description: JSON array of products in the customer's cart.
//  *
//  * @relation Orders
//  * @order { createdAt: 'DESC' }
//  */
@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    telphone: string;

    @Column({ nullable: true, default: false })
    isEmailVerified: boolean;

    
    @Column({ type: 'json', nullable: true })
    // cart: Array<{ productId: string; quantity: number }> | null;
    cart: any;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}
