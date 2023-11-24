const { model, Schema } = require("mongoose")

let ticketSchema = new Schema({
    GuildId: String,
    UserId: String,
    ChannelId: String,
    TicketId: String,
    Type: String
})

module.exports = model("ticketSystem", ticketSchema)