const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(isClient) {
    console.log(`[SYSTEM] ${isClient.user.tag} has been online!`);
  },
};
