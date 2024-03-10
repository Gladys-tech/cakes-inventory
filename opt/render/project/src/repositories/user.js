"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_1 = require("../models/user");
const data_source_1 = require("../data-source");
exports.UserRepository = data_source_1.dataSource.getRepository(user_1.User).extend({});
//# sourceMappingURL=user.js.map