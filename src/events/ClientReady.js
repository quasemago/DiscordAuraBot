import { Events } from 'discord.js';

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});