const { Schema, model } = require("mongoose");

const guildAnnouce = new Schema({
  guildId: String,
  guildName: String,
  annouceRoom: String,
});

module.exports = model("guildAnnouce", guildAnnouce);
