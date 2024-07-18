import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TotalViews {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    count: number;
}
