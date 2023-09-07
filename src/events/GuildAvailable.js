import {Events} from 'discord.js';

client.on(Events.GuildAvailable, async (guild) => {
    console.log(`Logging in guild ${guild.name}!`);
})