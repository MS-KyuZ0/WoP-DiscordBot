const fs = require("node:fs");
const eventHandlers = (client) => {
  const folderPath = fs.readdirSync("Events");

  for (const folder of folderPath) {
    const filePath = fs
      .readdirSync(`Events/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of filePath) {
      const event = require(`../Events/${folder}/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
      } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
      }
    }
  }
};

module.exports = eventHandlers;
