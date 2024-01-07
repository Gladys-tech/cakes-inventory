import { DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base';

/**
 * Soft Delete abstract entity class that all entities should extend.
 */
export abstract class SoftDeletableEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt?: Date;
}
