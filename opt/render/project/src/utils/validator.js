"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const maven_core_utils_1 = require("maven-core-utils");
const reduceErrorMessages = (errs) => {
    return errs.reduce((acc, next) => {
        if (next.constraints) {
            for (const [_, msg] of Object.entries(next.constraints)) {
                acc.push(msg);
            }
        }
        if (next.children) {
            acc.push(...reduceErrorMessages(next.children));
        }
        return acc;
    }, []);
};
async function validator(typedClass, plain, config = {}) {
    const toValidate = (0, class_transformer_1.plainToInstance)(typedClass, plain);
    // @ts-ignore
    const errors = await (0, class_validator_1.validate)(toValidate, Object.assign({ whitelist: true, forbidNonWhitelisted: true }, config));
    const errorMessages = reduceErrorMessages(errors);
    if (errors === null || errors === void 0 ? void 0 : errors.length) {
        throw new maven_core_utils_1.MavenError(maven_core_utils_1.MavenError.Types.INVALID_DATA, errorMessages.join(', '));
    }
    return toValidate;
}
exports.validator = validator;
//# sourceMappingURL=validator.js.map