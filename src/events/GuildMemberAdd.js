import {Events} from 'discord.js';
import GuildServer from "../database/models/GuildServer.js";

client.on(Events.GuildMemberAdd, async (member) => {
    if (member.user.bot) {
        return;
    }

    const guildId = member.guild.id;
    await GuildServer.findOne({where: {guild_id: guildId}})
        .then(async (server) => {
            if (server) {
                const channel = member.guild.channels.cache.get(server.greeting_channel_id);
                if (channel) {
                    channel.send(server.greeting_message.replace('{user}', `<@${member.user.id}>`));
                }
            }
        });
});