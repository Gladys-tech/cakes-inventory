import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from './user'; // importing the user entity
import { Shop } from './shop';

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    street: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    telphone: number;

    @OneToOne(() => User, (user) => user.address, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToMany(() => Shop, (shop) => shop.address)
    @JoinTable()
    shops: Shop[];
}
