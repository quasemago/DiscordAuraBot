import {Events} from 'discord.js';

client.on(Events.GuildAvailable, async (guild) => {
    bot_logger.debug(`Logging in guild ${guild.name}!`);
})