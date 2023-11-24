const { Events } = require("discord.js");
const capScema = require("../../Schema/capScema");
const capAnswerSchema = require("../../Schema/capAnswer")
const { isGuildId, isUserId, isAnswer } = require("../../data.json")

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `[COMMANDS HANDLER] No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isModalSubmit()) {

      const { customId } = interaction

      if (customId === 'capModal') {
        const isUser = await capAnswerSchema.findOne({ UserID: interaction.user.id })
        const isData = await capScema.findOne({ Guild: isUser.GuildId });
        const answer = interaction.fields.getTextInputValue('capAnswer')
        const isCap = isUser.Captcha;
        // const isCap = isData.Captcha;

        if (answer != `${isCap}`) return await interaction.reply({ content: 'There was wrong! Try again.', ephemeral: true });

        const roleId = isData.Role;
        const capGuild = await client.guilds.fetch(isUser.GuildId);
        const member = await capGuild.members.fetch(interaction.user.id);

        await member.roles.add(roleId);
        await interaction.reply({ content: `You have been verified within ${capGuild.name}`, ephemeral: true });
        await capAnswerSchema.deleteMany({ UserID: interaction.user.id });
      }
    }
  },
};
