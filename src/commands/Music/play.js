const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play the music you want to play on this server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption((option) => option
            .setName('query').setDescription('Enter the link or title of the music you want to play.').setRequired(true)),

    async execute(interaction, client) {
        if (interaction.user.id === config.client.owner) {
            const queue = await client.distube.getQueue(interaction);
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`You must be in a voice channel to execute this command.`)
                        .setColor(config.embed.color)], ephemeral: true
                });
            }

            if (queue) {
                if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
                    return interaction.reply({
                        embeds: [new EmbedBuilder()
                            .setDescription(`You must be on the same voice channel as me.`)
                            .setColor(config.embed.color)], ephemeral: true
                    });
                }
            }

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`I'm looking for the music you want...`)
                    .setColor(config.embed.color)]
            }).then(async (msg) => {
                await client.distube.play(voiceChannel, interaction.options.getString('query'), {
                    textChannel: interaction.channel,
                    member: interaction.member
                }).then(async () => {
                    return msg.edit({
                        embeds: [new EmbedBuilder()
                            .setDescription(`Successfully searched for the music you were looking for.`)
                            .setColor(config.embed.color)]
                    }).then(async (msg) => {
                        setTimeout(async function () {
                            msg.delete()
                        }, 5000)
                    });
                });
            });
        } else {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`You cannot use this command because this command can only be used by the owner.`)
                    .setColor(config.embed.color)], ephemeral: true
            });
        }
    }
}