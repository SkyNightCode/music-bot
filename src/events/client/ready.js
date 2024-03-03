const chalk = require("chalk");
const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(chalk.white(chalk.bold('SYSTEM')), chalk.red('+'), chalk.cyan(`Successfully logged to ${client.user.username}`))

        setInterval(async function () {
            const status = [`${client.users.cache.size} users in ${client.guilds.cache.size} servers`];
            const statuses = status[Math.floor(Math.random() * status.length)]
            client.user.setActivity(statuses, { type: ActivityType.Watching })
            client.user.setPresence({ status: PresenceUpdateStatus.Idle })
        }, 10000)
    }
}