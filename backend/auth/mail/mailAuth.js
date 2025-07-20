const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email, // your Gmail
        pass: process.env.pass  // app password (not your Gmail password)
    }
});

// const transporter = nodemailer.createTransport({
//     host: 'otprelay.nic.in',
//     port: 465,
//     secure: false, // SSL port
//     auth: {
//         user: 'controller-sbte-bih@nic.in',
//         pass: 'Sbte@1234'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

module.exports = transporter;
