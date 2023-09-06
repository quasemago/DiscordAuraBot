import {Events} from 'discord.js';
import {guildServer} from '../data/models/GuildServer.js';

client.on(Events.GuildAvailable, async (guild) => {
    console.log(`Logging in guild ${guild.name}!`);

    // Create a new guild server entry if it doesn't exist.
    const [, created] = await guildServer.findOrCreate({where: {guild_id: guild.id}});
    if (created) {
        console.log(`Created new guild server entry for ${guild.name}.`);
    }
})