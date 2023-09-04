const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');

global.DiscordJS = require('discord.js');

class discordClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.GuildMessageReactions
            ],
            partials: [
                Partials.Message,
                Partials.Channel
            ]
        });
    }

    login(token) {
        return super.login(token);
    }

    async start () {
        let status = await this.login(bot_config.BOT_TOKEN);
        if (status) {
            console.log('Logged in discord gateway!');
        } else {
            throw new Error('Failed to login');
        }
    }

    async loadEvents() {
        // TODO
    }

    async loadCommands() {
        // TODO
    }
}

module.exports = discordClient;