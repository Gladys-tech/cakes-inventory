import {
    Column,
    Entity,
    Index,
    BeforeInsert,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SoftDeletableEntity } from './abstracts/soft-deleteable';
import { DbAwareColumn } from '../utils/db-aware-column';
import { generateEntityId } from '../utils/generate-entity-id';
import { Address } from './address';  //importing the address entity here

export enum UserRole {
    ADMIN = 'admin',
    GUEST = 'guest',
    USER = 'user',
}

/**
 * @schema user
 *
 * title: User
 *
 * description: User entity
 *
 * x-resourceId: `user`
 *
 * properties:
 *     - id:
 *         type: `string`
 *         description: The auto-generated id of the user.
 *     - firstName:
 *         type: `string`
 *         description: The first name of the user.
 *     - lastName:
 *         type: `string`
 *         description: The last name of the user.
 *     - email:
 *         type: `string`
 *         description: The email address of the user.
 *     - password:
 *         type: `string`
 *         description: The password hash of the user.
 *     - role:
 *         type: `string`
 *         description: The role of the user.
 *     - isEmailVerified:
 *         type: `boolean`
 *         description: Whether the user has verified their email address.
 *  *     - agreeToTerms:
 *         type: `boolean`
 *         description: Whether the user has agreed to terms and conditions.
 *     - isActive:
 *         type: `boolean`
 *         description: Whether the user is active.
 *     - apiToken:
 *          type: `string`
 *          description: The API token of the user for API authentication especially for developers.
 *     - userInvitation:
 *          type: `string`
 *          description: The user invitation id of the user invitation model.
 *     - createdAt:
 *         type: `string`
 *         format: date-time
 *         description: The date the user was created.
 *     - updatedAt:
 *         type: `string`
 *         format: date-time
 *         description: The date the user was last updated.
 *     - deletedAt:
 *        type: `string`
 *        format: date-time
 *        description: The date the user was deleted.
 *     - metadata:
 *        type: `object`
 *        description: Optional key-value map with additional details about the user.
 *        example: { "key": "value" }
 */
@Entity()
export class User extends SoftDeletableEntity {
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
    image: string;

    @Column({ nullable: true })
    password: string;

    @DbAwareColumn({
        type: 'enum',
        enum: UserRole,
        nullable: true,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({ nullable: true, default: false })
    isEmailVerified: boolean;

    @Column({ nullable: true })
    emailVerificationToken: string;

    @Column({ nullable: true })
    agreeToTerms!: boolean;

    @Column({ nullable: true })
    rememberMe: boolean;

    @Column({ nullable: true })
    apiToken: string;

    @Column({ nullable: true })
    resetToken: string;

    @Column({ nullable: true })
    resetTokenExpires: Date;

    @OneToMany(() => Address, (address) => address.user, { nullable: true })
    addresses: Address[];

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'user');
    }
}
