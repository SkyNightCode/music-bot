const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the queue list of music playing on this server.')
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

        const tracks = queue.songs.map((song, i) => `**${i + 1}.** ${song.name} by ${song.uploader.name}`);

        const songs = queue.songs.length;

        const Embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name}'s Music Queue`)
            .setColor(config.embed.color)
            .addFields([
                { name: 'Current Playing', value: `${queue.songs[0].name}`, inline: false },
                { name: 'Duration', value: `\`\`\`${queue.formattedDuration}\`\`\``, inline: true },
                { name: 'Total', value: `\`\`\`${songs} Songs\`\`\``, inline: true },
                { name: 'Volume', value: `\`\`\`${queue.volume}%\`\`\``, inline: true }
            ])
            .setThumbnail(`${queue.songs[0].thumbnail}`)

        if (!songs > 10) Embed.setDescription(`${tracks.slice(0, 10).join("\n")}\n${songs - 10} songs`)
        else if (!songs < 10) Embed.setDescription(`${tracks.slice(0, 10).join("\n")}`)

        interaction.reply({ embeds: [Embed], ephemeral: true })
    }
}