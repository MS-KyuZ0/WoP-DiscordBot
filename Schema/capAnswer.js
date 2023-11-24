const { model, Schema } = require("mongoose")

let capAnswerSchema = new Schema({
    GuildId: String,
    UserID: String,
    Captcha: String
})

module.exports = model("captchaAnswer", capAnswerSchema)