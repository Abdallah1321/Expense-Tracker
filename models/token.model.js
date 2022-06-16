const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } },
    controllerResponsible: {type: String, required: true}
});

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
