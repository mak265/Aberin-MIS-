const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    // Debug logging - ALWAYS log the content for dev/debugging purposes
    console.log(`\n=== EMAIL OUTGOING ===`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log(`======================\n`);
    
    // Debug logging
    console.log(`[Email Debug] Attempting to send to: ${to}`);
    console.log(`[Email Debug] Configured User: ${process.env.MAIL_USER}`);
    
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.log(`[SIMULATION] Email to ${to}: ${subject} \n ${text}`);
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}. MessageId: ${info.messageId}`);
    } catch (err) {
        console.error('Email send failed:', err);
    }
};

module.exports = sendEmail;
