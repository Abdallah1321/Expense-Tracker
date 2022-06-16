const crypto = require("crypto");
const token = crypto.randomBytes(32).toString('hex')
const transporter = require('../config/mail')

const sendInviteEmail = async(inviterName, inviteeName, inviteeEmail, walletName, host,path, token) => {
    const mailOptions = {
        from: 'no-reply@myitra.com',
        to: inviteeEmail,
        subject: `${inviterName} has invited you to join his wallet`,
        text: `Hello ${inviteeName} \n\n
               ${inviterName} has invited you to join the Wallet ${walletName} \n\n
               Accept Invite by clicking the link: \n 
               http://${host}/${path}/${token}        \n\n
               Thank you!                      
        `,
    }
    return transporter.sendMail(mailOptions)
}

module.exports = sendInviteEmail