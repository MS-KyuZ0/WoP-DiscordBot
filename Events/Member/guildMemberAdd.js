const { Events, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { CaptchaGenerator } = require("captcha-canvas")
const capScema = require("../../Schema/capScema")
const { COLORS } = require('../../config.json')
const fs = require("fs");
const capAnswer = require("../../Schema/capAnswer");
let guild;

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        const isData = await capScema.findOne({ Guild: member.guild.id })

        const isAnswer = [
            "RIAF4",
            "AYT2R",
            "yq8Il",
            "euAS7",
            "Id3uM",
            "tU7hx",
            "I2TPq",
            "71uN7",
            "4pPES",
            "QHRgI"
        ]

        const answerNya = isAnswer[Math.floor(Math.random() * isAnswer.length)]

        if (!isData) return;

        const isCaptcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: `${answerNya}`, size: 60, color: "green" })
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: "green" })

        const buffer = isCaptcha.generateSync()
        const attachment = new AttachmentBuilder(buffer, { name: "captcha.png" })
        const isEmbed = new EmbedBuilder()
            .setColor(COLORS.PRIMARY)
            .setImage("attachment://captcha.png")
            .setTitle(`Solve the captcha to verify in ${member.guild.name}`)
            .setFooter({ text: "Use the button below to submit your captcha answer!" })

        const isButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("capButton")
                    .setLabel("Submit")
                    .setStyle(ButtonStyle.Primary)
            )

        const isModal = new ModalBuilder()
            .setTitle("Submit Captcha Answer")
            .setCustomId("capModal")

        const answer = new TextInputBuilder()
            .setCustomId("capAnswer")
            .setRequired(true)
            .setLabel("Your captcha anser:")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Submit your think the captcha is! If you get it wrong you can try again.")

        const firtsActionRow = new ActionRowBuilder().addComponents(answer)
        isModal.addComponents(firtsActionRow)

        const isMsg = await member.send({ embeds: [isEmbed], files: [attachment], components: [isButton] }).catch(err => {
            return;
        })

        const collector = isMsg.createMessageComponentCollector()

        collector.on('collect', async i => {
            if (i.customId === 'capButton') {
                i.showModal(isModal)
            }
        })

        // guild = member.guild

        // const isJsonData = `{
        //     "isGuildId": "${member.guild.id}",
        //     "isUserId": "${member.user.id}",
        //     "isAnswer": "${answerNya}"
        // }`

        // const jsonObj = await JSON.parse(isJsonData)
        // const jsonContent = JSON.stringify(jsonObj)

        // fs.writeFile("data.json", jsonContent, 'utf-8', function (err) {
        //     if (err) return console.log(err)
        // })

        const isUser = await capAnswer.findOne({ UserID: member.user.id })

        if (isUser) return;

        await capAnswer.create({
            GuildId: member.guild.id,
            UserID: member.user.id,
            Captcha: answerNya
        })
    },
};