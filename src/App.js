const { Client, Events, GatewayIntentBits, Partials, Collection, REST, Routes } = require('discord.js');
const path = require('path');

global.DiscordJS = require('discord.js');

class discordClient extends Client {
    constructor() {
        super({
            // Load all discord intents.
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.GuildMessageReactions
            ],
            // Load all discord partials.
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
        this.commandList = new Collection();

        let status = await this.login(bot_config.BOT_TOKEN);
        if (status) {
            await this.loadEvents()
            await this.loadCommands();
        } else {
            throw new Error('Failed to login');
        }
    }

    async loadEvents() {
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }

    async loadCommands() {
        const foldersPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(foldersPath);
        const rest = new REST().setToken(bot_config.BOT_TOKEN);
        let commandListTemp = [];

        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory.
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath)
                .filter(file => file.endsWith('.js'));

            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment.
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.commandList.set(command.data.name, command);
                    commandListTemp.push(command.data.toJSON());
                    console.log(`Loaded command ${file}`)
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }

        try {
            console.log(`Started refreshing ${commandListTemp.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set.
            const data = await rest.put(
                Routes.applicationCommands(bot_config.BOT_ID),
                { body: commandListTemp },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }
}

module.exports = discordClient;