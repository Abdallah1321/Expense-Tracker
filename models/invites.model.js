const mongoose = require("mongoose");

const invitations = new mongoose.Schema({
    inviteeID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    walletID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Wallet'},
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } },
    status: { type: String, required: true, default: 'pending' },
    permission: { type: String, required: true }
});

const Invitation = mongoose.model("Invitation", invitations);
module.exports = Invitation;
