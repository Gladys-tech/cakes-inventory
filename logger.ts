import fs from 'fs';
import c from 'ansi-colors';

// Create a folder for logs if it doesn't exist
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// Make a Logger object available to whatever file refrences it.
export const Logger: any = (exports.Logger = {});

const infoStream = fs.createWriteStream('logs/info.txt');
const errorStream = fs.createWriteStream('logs/error.txt');
const debugStream = fs.createWriteStream('logs/debug.txt');
const warnStream = fs.createWriteStream('logs/warn.txt');

Logger.info = function (message: string) {
    const msg = `[INFO] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(c.green(msg));
    infoStream.write(`${msg}\n`);
};

Logger.error = function (message: string, error?: Error) {
    const msg = `[ERROR] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(c.red(msg), error);
    errorStream.write(`${msg}\n ${error}\n`);
};

Logger.debug = function (message: string) {
    const msg = `[DEBUG] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(c.gray(msg));
    debugStream.write(`${msg}\n`);
};

Logger.warn = function (message: string) {
    const msg = `[WARNING] ${new Date().toLocaleTimeString()} ${message}`;
    console.log(c.yellow(msg));
    warnStream.write(`${msg}\n`);
};
