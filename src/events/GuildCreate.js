import { Events } from 'discord.js';

client.on(Events.GuildCreate, async (guild) => {
    console.log(`Joined in guild ${guild.name}!`);
});