const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionCollector, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const capScema = require("../../Schema/capScema")
const { COLORS, openticket } = require("../../config.json")
const ticketSystem = require("../../Schema/ticketSystem")
let isEmbed;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketsetup")
        .setDescription("Setup ticket system!"),
    /**
     * 
     * @param {InteractionCollector} interaction 
     */
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ content: "Sorry, you don't have permission for this command!", ephemeral: true })

        const { guild } = interaction

        isEmbed = new EmbedBuilder()
            .setColor(COLORS.PRIMARY)
            .setTitle(`${interaction.guild.name} Ticket System`)
            .setDescription("Kalian bisa menekan tombol dibawah untuk membuka tiket.")
            .addFields(
                {
                    name: "` 💵 Donation `",
                    value: "Tombol ini digunakan jiakalau kalian ingin men-support kami dengan cara membeli sesuatu yang ada didalam ingame.",
                    inline: true
                },
                {
                    name: "` 👤 Laporkan Warga `",
                    value: "Tombol ini digunakan untuk melaporkan warga yang bermasalah.",
                    inline: true
                },
                {
                    name: "` ❓ Lainnya `",
                    value: "Tombol ini digunakan untuk lainnya.",
                    inline: true
                },
            )
            .setTimestamp()

        const isButton = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("donation").setLabel("Donasi").setStyle(ButtonStyle.Primary).setEmoji("💵"),
            new ButtonBuilder().setCustomId("report").setLabel("Laporkan Warga").setStyle(ButtonStyle.Danger).setEmoji("👤"),
            new ButtonBuilder().setCustomId("other").setLabel("Lainnya").setStyle(ButtonStyle.Secondary).setEmoji("❓"),
        )
        interaction.guild.channels.cache.get(openticket).send({
            embeds: [isEmbed],
            components: [isButton]
        })
        await interaction.reply({ content: "Ticket message has been sent.", ephemeral: true })
    }
}