const { createTranscript } = require("discord-html-transcripts")
const { ticketLogs, COLORS } = require("../../config.json")
const { Events, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const ticketSystem = require("../../Schema/ticketSystem")

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        const { guild, member, customId, channel } = interaction
        const { ManageChannels, SendMessages } = PermissionFlagsBits

        if (!interaction.isButton()) return;
        if (customId !== "close-ticket") return;
        if (!guild.members.me.permissions.has(ManageChannels)) return interaction.reply({ content: "I don't have permission for this.", ephemeral: true })

        const isEmbed = new EmbedBuilder().setColor(COLORS.PRIMARY)
        const isChannel = await ticketSystem.findOne({ UserId: interaction.user.id, GuildId: guild.id })
        // const fetchMember = await guild.members.cache.get(data.UserId);

        if (!isChannel) return;

        switch (customId) {
            case 'close-ticket':
                const transcripts = await createTranscript(channel, {
                    limit: -1,
                    returnType: false,
                    fileName: `${member.user.username}-ticket${isChannel.Type}-${isChannel.TicketId}.html`
                })

                const transcriptsEmbed = new EmbedBuilder()
                    .setTitle(`Transcript Ticket Number: ${isChannel.TicketId}`)
                    .setDescription(`Name: <@${isChannel.UserId}>\nType: ${isChannel.Type}`)
                    .setTimestamp()

                const transcriptsProcess = new EmbedBuilder()
                    .setColor(COLORS.PRIMARY)
                    .setTitle(`Saving transcripts...`)
                    .setDescription("Ticket will be closed in 10 seconds. enable DM's for the ticket transcript.")
                    .setTimestamp()

                const res = await client.channels.cache.get(ticketLogs).send({ embeds: [transcriptsEmbed], files: [transcripts] })

                interaction.reply({ embeds: [transcriptsProcess] })

                setTimeout(() => {
                    member.send({ embeds: [transcriptsEmbed.setDescription(`Access your ticket transcript: ${res.url}`)] }).catch(err => console.log(err))
                    channel.delete()
                    ticketSystem.deleteMany({ UserId: member.id })
                }, 10 * 1000)
                break;
        }
    }
}