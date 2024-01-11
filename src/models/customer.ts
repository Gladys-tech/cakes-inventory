import {
    Column,
    Entity,
    Index,
    BeforeInsert,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { SoftDeletableEntity } from './abstracts/soft-deleteable';
import { DbAwareColumn } from '../utils/db-aware-column';
import { generateEntityId } from '../utils/generate-entity-id';

/**
 * @schema customer
 *
 * title: customer
 *
 * description: Customer entity
 *
 * x-resourceId: `customer`
 *
 * properties:
 *
 *     - firstName:
 *         type: `string`
 *         description: The first name of the customer.
 *     - lastName:
 *         type: `string`
 *         description: The last name of the customer.
 *     - email:
 *         type: `string`
 *         description: The email address of the customer.
 *     - product:
 *         type: `string`
 *         description: The product for the customer's choice.
 *     - location:
 *         type: `string`
 *         description: The location of the customer.
 *     - telphone:
 *          type: `number`
 *          description: The phone number for the customer
 *     - isEmailVerified:
 *         type: `boolean`
 *         description: Whether the customer has verified their email address.
 *  *
 */
@Entity()
export class Customer extends SoftDeletableEntity {
    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column({ nullable: true })
    product: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    telphone: string;

    @Column({ nullable: true, default: false })
    isEmailVerified: boolean;
}
