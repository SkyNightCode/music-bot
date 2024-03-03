const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the currently playing music.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

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
                .setDescription(`Successfully stopped music playback and exited the voice channel.`)
                .setColor(config.embed.color)], ephemeral: true
        }).then(async() => {
            await client.distube.stop(interaction);
        });
    }
}