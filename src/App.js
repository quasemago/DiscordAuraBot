import {Client, GatewayIntentBits, Partials, Collection, REST, Routes} from 'discord.js';
import path from 'path';
import os from "os";
import * as utils from "./helpers/utils.js";
import "./database/Database.js"

const __dirname = utils.getDirName(import.meta.url);

export class DiscordClient extends Client {
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

    async start() {
        this.commandList = new Collection();
        this.commandCooldowns = new Collection();

        // Check for DB connection before starting.
        await utils.testDbConnection(db_context).then(async () => {
            bot_logger.info('Database connection established.');

            // Load events and commands before logging.
            await this.loadEvents()
            await this.loadCommands();

            // Try logging into the discord gateway.
            await this.login(bot_config.BOT_TOKEN).then(() => {
                bot_logger.info(`Connection to discord gateway established!`);
            }).catch(err => {
                bot_logger.fatal(err);
            });
        }).catch(err => {
            bot_logger.fatal(err);
        });
    }

    async loadEvents() {
        const startPrefix = os.platform() === 'win32' ? 'file://' : '';

        const eventsFolder = path.join(__dirname, 'events')
        const eventsFiles = await utils.getAllFilesFromDir(eventsFolder);

        for (const filePath of eventsFiles) {
            await import(startPrefix + filePath);
        }
    }

    async loadCommands() {
        let commandListGlobalTemp = [];

        const startPrefix = os.platform() === 'win32' ? 'file://' : '';

        const commandsFolder = path.join(__dirname, 'commands')
        const commandsFiles = await utils.getAllFilesFromDir(commandsFolder);

        for (const filePath of commandsFiles) {
            const {default: command} = await import(startPrefix + filePath);

            if ('data' in command && 'execute' in command) {
                commandListGlobalTemp.push(command.data.toJSON());

                this.commandList.set(command.data.name, command);
                this.commandCooldowns.set(command.data.name, new Collection());
                bot_logger.debug(`Loaded command ${command.data.name}`)
            } else {
                bot_logger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }

        try {
            bot_logger.info(`Started refreshing (${commandListGlobalTemp.length}) application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set.
            const restData = new REST()
                .setToken(bot_config.BOT_TOKEN);
            const commandsData = await restData.put(
                Routes.applicationCommands(bot_config.BOT_ID),
                {body: commandListGlobalTemp},
            );

            bot_logger.info(`Successfully reloaded (${commandsData.length}) application (/) commands.`);
        } catch (error) {
            bot_logger.error(error);
        }
    }
}