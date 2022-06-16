const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_APIKEY
    }
})

module.exports = transporter