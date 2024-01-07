import {
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DbAwareColumn, resolveDbType } from '../../utils/db-aware-column';

/**
 * Base abstract entity class that all entities should extend.
 */
export abstract class BaseEntity {
    @PrimaryColumn()
    id?: string;

    @Column({ nullable: true, default: false })
    isActive: boolean;

    @DbAwareColumn({ type: 'jsonb', nullable: true })
    metadata?: Record<string, unknown>;

    @CreateDateColumn({ type: resolveDbType('timestamp') })
    createdAt?: Date;

    @UpdateDateColumn({ type: resolveDbType('timestamp') })
    updatedAt?: Date;
}
