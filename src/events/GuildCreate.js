import {Events} from 'discord.js';
import {guildServer} from '../data/models/GuildServer.js';

client.on(Events.GuildCreate, async (guild) => {
    console.log(`Joined in guild ${guild.name}!`);

    // Sync guild server table with database.
    guildServer.sync({force: false})
        .then(async () => {
            // Create a new guild server entry if it doesn't exist.
            const [, created] = await guildServer.findOrCreate({where: {guild_id: guild.id}});
            if (created) {
                console.log(`Created new guild server entry for ${guild.name}.`);
            }
        }).catch((err) => {
            throw new Error(err);
        });
});