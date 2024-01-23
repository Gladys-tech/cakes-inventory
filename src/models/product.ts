import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Shop } from './shop';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 }) // Use 'decimal' type for decimal values
    price: number;

    @Column({ type: 'int', default: 0 }) // New field for inventory quantity
    inventoryQuantity: number;

    @ManyToMany(() => Shop, (shop) => shop.products)
    @JoinTable()
    shops: Shop[];
    // @ManyToMany(() => Shop, (shop) => shop.products, { cascade: ['insert', 'update'] })
    // @JoinTable()
    // shops: Shop[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
