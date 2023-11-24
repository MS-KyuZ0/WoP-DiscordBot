const { Events } = require("discord.js");


module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        const { author, content } = message
        if (author.bot) return;

        const isUrl = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})"
        const isContent = content.match(isUrl)
        let wantDelete = false;

        if (isContent["input"].match("^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$")) return;

        message.delete()
    }
}