"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendAccountActivationEmail = exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailConfig_1 = require("./emailConfig");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: emailConfig_1.SENDER_EMAIL,
        pass: process.env.EMAIL_NOTIFICATION_PASSWORD,
    },
});
const sendWelcomeEmail = async (email) => {
    const mailOptions = {
        to: email,
        from: emailConfig_1.SENDER_EMAIL,
        subject: 'Welcome to our platform',
        text: 'Thank you for joining our platform!',
        html: '<strong>Thank you for joining our platform!</strong>',
    };
    await new Promise((resolve) => setTimeout(resolve, emailConfig_1.USER_CREATED_EMAIL_NOTIFICATION_DURATION));
    await transporter.sendMail(mailOptions);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendAccountActivationEmail = async (email, activationToken) => {
    const mailOptions = {
        to: email,
        from: emailConfig_1.SENDER_EMAIL,
        subject: 'Activate Your Account',
        text: 'Please activate your account by clicking the following link:',
        html: `<strong>Click <a href="http://localhost:8000/activate/${activationToken}">here</a> to activate your account.</strong>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendAccountActivationEmail = sendAccountActivationEmail;
transporter.verify(function (error, success) {
    if (error) {
        console.log('SMTP authentication error:', error);
    }
    else {
        console.log('SMTP authentication successful:', success);
    }
});
const sendPasswordResetEmail = async (email, resetToken
// resetJwtToken
) => {
    const mailOptions = {
        to: email,
        from: emailConfig_1.SENDER_EMAIL,
        subject: 'Password Reset',
        text: 'You are receiving this email because a password reset request was initiated.',
        html: `
            <p>You are receiving this email because a password reset request was initiated.</p>
            <p>Click the following link to reset your password:</p>
            <p><a href="http://localhost:8000/reset-password/${resetToken}">Reset Password</a></p>
            <p>If you did not request a password reset, please ignore this email.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=emailUtils.js.map