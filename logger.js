"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs_1 = __importDefault(require("fs"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
// Create a folder for logs if it doesn't exist
if (!fs_1.default.existsSync('logs')) {
    fs_1.default.mkdirSync('logs');
}
// Make a Logger object available to whatever file refrences it.
exports.Logger = (exports.Logger = {});
const infoStream = fs_1.default.createWriteStream('logs/info.txt');
const errorStream = fs_1.default.createWriteStream('logs/error.txt');
const debugStream = fs_1.default.createWriteStream('logs/debug.txt');
const warnStream = fs_1.default.createWriteStream('logs/warn.txt');
exports.Logger.info = function (message) {
    const msg = `[INFO] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(ansi_colors_1.default.green(msg));
    infoStream.write(`${msg}\n`);
};
exports.Logger.error = function (message, error) {
    const msg = `[ERROR] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(ansi_colors_1.default.red(msg), error);
    errorStream.write(`${msg}\n ${error}\n`);
};
exports.Logger.debug = function (message) {
    const msg = `[DEBUG] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(ansi_colors_1.default.gray(msg));
    debugStream.write(`${msg}\n`);
};
exports.Logger.warn = function (message) {
    const msg = `[WARNING] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(ansi_colors_1.default.yellow(msg));
    warnStream.write(`${msg}\n`);
};
// E_rnU*KLQx3Yjuh
//# sourceMappingURL=logger.js.map