const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS,
        }
    });

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: options.email,
        subject: options.subject,
        html: options.html
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;