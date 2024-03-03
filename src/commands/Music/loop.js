const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set repeat playback on this server music playback.')
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

        let mode = client.distube.setRepeatMode(interaction);
        mode = mode ? mode === 2 ? "Queue" : "Track" : "Disable";
        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`Successfully set repeat playback for ${mode}`)
                .setColor(config.embed.color)], ephemeral: true
        });
    }
}