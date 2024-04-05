import {Events} from 'discord.js';
import {sendPrivateMessageToOwner, testDbConnection} from "../helpers/utils.js";
import {guildServer} from '../data/models/GuildServer.js';

client.on(Events.GuildCreate, async (guild) => {
    bot_logger.debug(`Joined in guild ${guild.name}!`);

    try {
        // Check database connection.
        await testDbConnection(db_context)
            .then(async () => {
                // Sync guild server table with database.
                await guildServer.sync({force: false})
                    .then(async () => {
                        // Create a new guild server entry if it doesn't exist.
                        const [, created] = await guildServer.findOrCreate({where: {guild_id: guild.id}});
                        if (created) {
                            bot_logger.debug(`Created new guild server entry for ${guild.name}.`);
                        }
                    });
            });
    } catch (err) {
        await sendPrivateMessageToOwner(`Error on adding guild ${guild.name} to database!`)
        bot_logger.error(err);
    }
});