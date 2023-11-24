require("dotenv").config();
const { Client, Collection, Events } = require("discord.js");
const mongoose = require("mongoose");
const eventHandlers = require("./Handlers/eventHandlers");
const cmdHandlers = require("./Handlers/commandHanders");
const client = new Client({
  intents: 131071,
});

// ! CONNECT DATABASE
mongoose
  .connect(process.env.MONGOODB)
  .then(() => console.log("[DATABASE] Successfully connect to database!"));

// ! CLIENT COLLECTION
client.commands = new Collection();

// ! CLIENT HANDLERS
eventHandlers(client);
cmdHandlers(client);

// ! EXPORTING CLIENT
module.exports = client;

// ! CLIENT LOGIN
client.login(process.env.DISCORD_TOKEN);
