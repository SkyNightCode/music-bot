const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all commands that can be used.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction, client) {
        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle(`${client.user.displayName} Help Panel`)
                .setDescription(`${client.user} is a multifunctional bot created and developed by EpidemiDev.`)
                .addFields([
                    { name: 'INFORMATION', value: '```help, ping```', inline: false },
                    { name: 'MUSIC', value: '```loop, pause, play, queue, resume, shuffle, skip, stop, volume```', inline: false },
                ])
                .setColor(config.embed.color)
                .setFooter({ text: `Lisence © 2023 - 2024 EpidemiDev` })], ephemeral: true
        });
    }
}