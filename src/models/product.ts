import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { Shop } from './shop';
import { Order } from './order';
import { ProductImage } from './productImage';

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

    @Column({ nullable: true })
    primaryImageUrl: string;

    @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
    images: ProductImage[];

    @ManyToMany(() => Shop, (shop) => shop.products)
    @JoinTable()
    shops: Shop[];

    @ManyToMany(() => Order, (order) => order.products)
    @JoinTable()
    orders: Order[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
