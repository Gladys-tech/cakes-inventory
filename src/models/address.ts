import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user'; // importing the user entity

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

    @ManyToOne(() => User, (user) => user.addresses, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;
}
