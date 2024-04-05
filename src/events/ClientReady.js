import {Events} from 'discord.js';

client.once(Events.ClientReady, async () => {
    bot_logger.info(`Logged in as ${client.user.tag}!`);

    // Validate bot presence.
    if (bot_config.BOT_PRESENCE_MSG.length > 0) {
        // Convert string and check if exists.
        // otherwise default to 0 (PLAYING).
        const presenceType = bot_config.BOT_PRESENCE_TYPE.length > 0 ? parseInt(bot_config.BOT_PRESENCE_TYPE) : 0;

        // Set bot presence.
        client.user.setPresence({
            activities: [{
                type: presenceType,
                name: bot_config.BOT_PRESENCE_MSG
            }],
            status: 'online'
        });
    }
});