const { Events, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { openticket, ticketparent, everyone } = require("../../config.json");
const ticketSystem = require("../../Schema/ticketSystem");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        const { guild, member, cutomId, channel, customId } = interaction;
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory, Administrator } = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return;
        if (!["donation", "report", "other"].includes(customId)) return;
        if (!guild.members.me.permissions.has(Administrator)) return await interaction.reply({ content: "I don't have permission for this.", ephemeral: true })

        try {
            await guild.channels.create({
                name: `${customId}-ticket${ticketId}`,
                type: ChannelType.GuildText,
                parent: ticketparent,
                permissionOverwrites: [
                    {
                        id: everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory]
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory]
                    },
                ]
            }).then(async (channel) => {
                const isUserTicket = await ticketSystem.findOne({ UserId: member.id, GuildId: guild.id })
                if (isUserTicket) return interaction.reply({ content: "Sorry, you already has ticket.", ephemeral: true })

                const newTicketScema = await ticketSystem.create({
                    GuildId: guild.id,
                    UserId: member.id,
                    ChannelId: channel.id,
                    TicketId: ticketId,
                    Type: customId,
                })

                const isEmbed = new EmbedBuilder()
                    .setTitle(`${guild.name} - Ticket: ${customId.toUpperCase()}`)
                    .setDescription("Team kami akan segera merespon tiket anda. Mohon tunggu sebentar.")
                    .setFooter({ text: `${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()

                const isButton = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId("close-ticket").setLabel("Close Ticket").setStyle(ButtonStyle.Danger).setEmoji("✖")
                )

                await channel.send({ embeds: [isEmbed], components: [isButton] })
                await interaction.reply({ content: "Successfully created a ticket!", ephemeral: true })
            })
        } catch (err) {
            if (err) return console.log(err)
        }
    }
}