import {
    Column,
    Entity,
    Index,
    BeforeInsert,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SoftDeletableEntity } from './abstracts/soft-deleteable';
import { generateEntityId } from '../utils/generate-entity-id';

/**
 * @schema contact
 *
 * title: Contact
 *
 * description: Contact entity
 *
 * x-resourceId: `contact`
 *
 * properties:
 *     - id:
 *         type: `string`
 *         description: The auto-generated id of the contact.
 *     - name:
 *         type: `string`
 *         description: The name of the contact.
 *     - email:
 *         type: `string`
 *         description: The email address of the contact.
 *     - phone:
 *         type: `string`
 *         description: The phone number of the contact.
 *     - address:
 *         type: `string`
 *         description: The address of the contact.
 *     - message:
 *         type: `string`
 *         description: The message from the contact.
 *     - createdAt:
 *         type: `string`
 *         format: date-time
 *         description: The date the contact was created.
 *     - updatedAt:
 *         type: `string`
 *         format: date-time
 *         description: The date the contact was last updated.
 */
@Entity()
export class Contact extends SoftDeletableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column('text')
    message: string;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'contact');
    }
}
