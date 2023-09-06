import {Events} from 'discord.js';
import {guildServer} from '../data/models/GuildServer.js';

client.on(Events.GuildDelete, async (guild) => {
    console.log(`Left guild ${guild.name}!`);

    // Delete guild server entry from database.
    await guildServer.destroy({where: {guild_id: guild.id}}).then(() => {
        console.log(`Deleted guild ${guild.name} from database.`);
    }).catch((err) => {
        throw new Error(err);
    });
});