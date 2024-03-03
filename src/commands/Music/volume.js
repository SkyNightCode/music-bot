const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjusts the volume of the music currently playing.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addNumberOption((option) => option
            .setName('number').setDescription('Enter the number for the music volume setting.').setRequired(true).setMaxValue(200).setMinValue(1)),

    async execute(interaction, client) {
        const queue = await client.distube.getQueue(interaction);
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`You must be in a voice channel to execute this command.`)
                    .setColor(config.embed.color)], ephemeral: true
            });
        }

        if (!queue) {
            if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`You must be on the same voice channel as me.`)
                        .setColor(config.embed.color)], ephemeral: true
                });
            }
            
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`There is no music playing on this server.`)
                    .setColor(config.embed.color)], ephemeral: true
            });
        }

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`Successfully set current music volume at **${interaction.options.getNumber('number')}%**.`)
                .setColor(config.embed.color)], ephemeral: true
        }).then(async() => {
            await client.distube.setVolume(interaction, interaction.options.getNumber('number'));
        });
    }
}