import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Product } from './product'; // Import the Product entity

@Entity()
export class Supplier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    contactPerson: string;

    @Column()
    contactEmail: string;

    @Column({ type: 'int', default: 0 }) // Inventory quantity received from the supplier
    suppliedQuantity: number;

    @Column({ type: 'int', default: 0 , nullable: true}) // Returned quantity to the supplier
    returnedQuantity: number;

    // Define many-to-one relationship with Product
    @ManyToOne(() => Product, (product) => product.supplier, {
        onDelete: 'CASCADE', // Cascade delete when a product is deleted
    })
    @JoinColumn()
    product: Product;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
