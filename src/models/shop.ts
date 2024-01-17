import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    ManyToMany,
} from 'typeorm';
import { Product } from './product';
import { Address } from './address';
import { User } from './user';

export enum ShopType {
    ONLINE = 'online',
    PHYSICAL = 'physical',
}

@Entity()
export class Shop {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    ownerName: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'enum', enum: ShopType })
    type: ShopType;

    @ManyToMany(() => User, (user) => user.shops)
    users: User[];

    @ManyToOne(() => Address, (address) => address.shops, { nullable: true })
    @JoinColumn({ name: 'addressId' })
    address: Address;

    @ManyToMany(() => Product, (product) => product.shops, { cascade: ['remove'] })
    products: Product[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
