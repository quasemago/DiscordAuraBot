import {Events} from 'discord.js';
import {sendPrivateMessageToOwner, testDbConnection} from "../helpers/utils.js";
import {guildServer} from '../data/models/GuildServer.js';

client.on(Events.GuildDelete, async (guild) => {
    bot_logger.debug(`Left guild ${guild.name}!`);

    try {
        // Check database connection.
        await testDbConnection(db_context)
            .then(async () => {
                // Delete guild server entry from database.
                await guildServer.destroy({where: {guild_id: guild.id}}).then(() => {
                    bot_logger.debug(`Deleted guild ${guild.name} from database.`);
                });
            });
    } catch (err) {
        await sendPrivateMessageToOwner(`Error on deleting guild ${guild.name} from database!`)
        bot_logger.error(err);
    }
});