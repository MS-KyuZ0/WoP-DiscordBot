const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionCollector } = require("discord.js")
const capScema = require("../../Schema/capScema")
const { COLORS } = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("captcha")
        .setDescription("Captcha for Verification User!")
        .addSubcommand(subCmd => subCmd.setName("setup")
            .setDescription("Setup the captcha verification system!")
            .addRoleOption(rOpt => rOpt.setName("role")
                .setDescription("The role you want to be given on verification!")
                .setRequired(true))
            .addStringOption(strOpt => strOpt.setName("captcha")
                .setDescription("The captcha text you want in the image")
                .setRequired(true)
            ))
        .addSubcommand(subCmd => subCmd.setName("disable")
            .setDescription("Setup the captcha verification system!")
        )
        .addSubcommand(subCmd => subCmd.setName("msg")
            .setDescription("Setup the captcha verification system!")
        ),
    /**
     * 
     * @param {InteractionCollector} interaction 
     */
    async execute(interaction) {
        const { member, guild, options } = interaction

        if (!member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ content: "Sorry, you don't have permission for this command!", ephemeral: true })

        const isData = await capScema.findOne({
            Guild: guild.id,
        })

        const sub = options.getSubcommand();
        let isEmbed = new EmbedBuilder()

        switch (sub) {
            case 'setup':
                if (isData) return await interaction.reply({ content: "The captcha system already setup in here!", ephemeral: true })

                const isRole = options.getRole("role")
                const isCaptcha = options.getString("captcha")

                await capScema.create({
                    Guild: guild.id,
                    Role: isRole.id,
                    // Captcha: isCaptcha
                })

                isEmbed = new EmbedBuilder()
                    .setColor(COLORS.PRIMARY)
                    .setDescription(`✔ | The capthca system has been setup!`)

                await interaction.reply({ embeds: [isEmbed] })
                break;
            case 'disable':
                if (!isData) return await interaction.reply({ content: "There is no captcha verification system setup in here!", ephemeral: true })

                await capScema.deleteMany({ Guild: guild.id })

                isEmbed = new EmbedBuilder()
                    .setColor(COLORS.PRIMARY)
                    .setDescription(`✔ | The capthca system has been disable!`)

                await interaction.reply({ embeds: [isEmbed] })

                break;
            case 'msg':
                if (!isData) return await interaction.reply({ content: "There is no captcha verification system setup in here!", ephemeral: true })

                isEmbed = new EmbedBuilder()
                    .setColor(COLORS.PRIMARY)
                    .setTitle('✅ | VERIFIKASI MEMBER')
                    .setDescription("Tolong cek DM's kami untuk melakukan verifikasi member!")
                    .setTimestamp()

                await interaction.reply({ content: "Successfully, send verification!", ephemeral: true })
                interaction.channel.send({ embeds: [isEmbed] })
                break;
        }
    }
}