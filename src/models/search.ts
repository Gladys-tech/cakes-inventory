import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class TopSearchProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    searches: number;

    @BeforeInsert()
    private beforeInsert(): void {
        if (!this.searches) {
            this.searches = 0;
        }
    }
}
