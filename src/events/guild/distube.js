const { SoundCloudPlugin } = require("@distube/soundcloud")
const { SpotifyPlugin } = require("@distube/spotify")
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { EmbedBuilder } = require("discord.js")
const { DisTube } = require("distube")
const config = require("../../config")

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        client.distube = new DisTube(client, {
            leaveOnEmpty: true,
            leaveOnFinish: true,
            leaveOnStop: true,
            emptyCooldown: 30,
            emitNewSongOnly: true,
            nsfw: true,
            plugins: [
                new SoundCloudPlugin(),
                new SpotifyPlugin(),
                new YtDlpPlugin()
            ]
        })

        client.distube
            .on('playSong', async (queue, song) => {
                queue.textChannel.send({
                    embeds: [new EmbedBuilder()
                        .setTitle(`${song.name}`)
                        .setURL(`${song.url}`)
                        .setDescription(`Currently playing music on <#${queue.voiceChannel.id}>`)
                        .setColor(config.embed.color)
                        .addFields([
                            { name: 'Uploader', value: `\`\`\`${song.uploader.name}\`\`\``, inline: true },
                            { name: 'Duration', value: `\`\`\`${song.formattedDuration}\`\`\``, inline: true },
                            { name: 'Download', value: `[Click here](${song.streamURL})`, inline: true },
                        ])
                        .setThumbnail(song.thumbnail)
                        .setFooter({ text: `Volume : ${queue.volume}% | Loop Mode : ${queue.repeatMode ? queue.repeatMode === 2 ? "Queue" : "Track" : "Disable"} | Requester : ${song.user.tag}` })]
                })
            })

            .on('addSong', async (queue, song) => {
                queue.textChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`Successfully added ${song.name} [ ${song.formattedDuration} ]`)
                        .setColor(config.embed.color)]
                }).then(async (msg) => {
                    setTimeout(async function () {
                        msg.delete()
                    }, 5000)
                })
            })

            .on('addList', async (queue, playlist) => {
                queue.textChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`Successfully added ${playlist.name} [ ${playlist.songs.length} Songs ]`)
                        .setColor(config.embed.color)]
                }).then(async (msg) => {
                    setTimeout(async function () {
                        msg.delete()
                    }, 5000)
                })
            })

            .on('error', async (textChannel, e) => {
                textChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`An error encountered : ${e}`)
                        .setColor(config.embed.color)]
                }).then(async (msg) => {
                    setTimeout(async function () {
                        msg.delete()
                    }, 5000)
                })
            })

            .on('finishSong', async (queue) => {
                queue.textChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`Finished playing ${queue.songs[0].name}`)
                        .setColor(config.embed.color)]
                }).then(async (msg) => {
                    setTimeout(async function () {
                        msg.delete()
                    }, 5000)
                })
            })

            .on("disconnect", async (queue) => {
                queue.textChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`Disconnected from voice channel!`)
                        .setColor(config.embed.color)]
                }).then(async (msg) => {
                    setTimeout(async function () {
                        msg.delete()
                    }, 5000)
                })
            })

            .on("empty", async (queue) => {
                queue.textChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`Channel is empty. Leaving the channel!`)
                        .setColor(config.embed.color)]
                }).then(async (msg) => {
                    setTimeout(async function () {
                        msg.delete()
                    }, 5000)
                })
            })

            .on("initQueue", async (queue) => {
                queue.autoplay = false
                queue.volume = 75
            })
    }
}