"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEntityId = void 0;
const ulid_1 = require("ulid");
/**
 * Generate a unique ID for an entity.
 * @param idProperty The name of the ID property.
 * @param prefix A prefix to prepend to the ID.
 * @returns A unique ID.
 */
function generateEntityId(idProperty, prefix = '') {
    if (idProperty) {
        return idProperty;
    }
    return `${prefix}_${(0, ulid_1.ulid)()}`;
}
exports.generateEntityId = generateEntityId;
//# sourceMappingURL=generate-entity-id.js.map