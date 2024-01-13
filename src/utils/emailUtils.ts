import nodemailer from 'nodemailer';
import {
    SENDER_EMAIL,
    USER_CREATED_EMAIL_NOTIFICATION_DURATION,
} from './emailConfig';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: process.env.EMAIL_NOTIFICATION_PASSWORD,
    },
});

export const sendWelcomeEmail = async (email: string): Promise<void> => {
    const mailOptions = {
        to: email,
        from: SENDER_EMAIL,
        subject: 'Welcome to our platform',
        text: 'Thank you for joining our platform!',
        html: '<strong>Thank you for joining our platform!</strong>',
    };

    await new Promise((resolve) =>
        setTimeout(resolve, USER_CREATED_EMAIL_NOTIFICATION_DURATION)
    );

    await transporter.sendMail(mailOptions);
};

export const sendAccountActivationEmail = async (
    email: string,
    activationToken: string,
): Promise<void> => {
    const mailOptions = {
        to: email,
        from: SENDER_EMAIL,
        subject: 'Activate Your Account',
        text: 'Please activate your account by clicking the following link:',
        html: `<strong>Click <a href="http://localhost:8000/activate/${activationToken}">here</a> to activate your account.</strong>`,

    };

    await transporter.sendMail(mailOptions);
};

transporter.verify(function(error, success) {
    if (error) {
      console.log('SMTP authentication error:', error);
    } else {
      console.log('SMTP authentication successful:', success);
    }
  });