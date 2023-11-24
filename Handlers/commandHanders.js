require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const cmdHandlers = async (client) => {
  const commands = [];
  const folderPath = fs.readdirSync("Commands");

  for (const folder of folderPath) {
    const filePath = fs
      .readdirSync(`Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of filePath) {
      const isCommands = require(`../Commands/${folder}/${file}`);
      if ("data" in isCommands && "execute" in isCommands) {
        client.commands.set(isCommands.data.name, isCommands);
        commands.push(isCommands.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationCommands("1130549739394437200"),
        {
          body: commands,
        }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
};

module.exports = cmdHandlers;
