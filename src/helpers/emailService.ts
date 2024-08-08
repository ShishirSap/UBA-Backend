import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const frontendUrl = process.env.FRONTEND_URL;


const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});
interface SendInviteEmailParams {
    recipientEmail: string;
    inviteToken: string;
}

export const sendInviteEmail = async ({ recipientEmail, inviteToken }: SendInviteEmailParams) => {
    const registrationLink = `${frontendUrl}/verify-email?token=${inviteToken}`;

    const mailOptions = {
        from: smtpUser,
        to: recipientEmail,
        subject: 'You are invited to register!',
        html: `
            <h3>Welcome!</h3>
            <p>You have been invited to join our platform. Please click the link below to complete your registration:</p>
            <a href="${registrationLink}">Complete Registration</a>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Invitation email sent:', info.response);
    } catch (error) {
        console.error('Error sending invitation email:', error);
        throw new Error('Failed to send invitation email');
    }
};