import { ulid } from 'ulid';

/**
 * Generate a unique ID for an entity.
 * @param idProperty The name of the ID property.
 * @param prefix A prefix to prepend to the ID.
 * @returns A unique ID.
 */
export function generateEntityId(
    idProperty: string,
    prefix: string = ''
): string {
    if (idProperty) {
        return idProperty;
    }
    return `${prefix}_${ulid()}`;
}
