import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
} from 'typeorm';

@Entity()
export class Visitor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ipAddress: string;

    @Column()
    userAgent: string;

    @Column()
    visitTime: Date;

    @BeforeInsert()
    private beforeInsert(): void {
        this.visitTime = new Date();
    }
}
