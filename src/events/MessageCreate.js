import {Events} from 'discord.js';

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.mentions.users.has(client.user.id)) {
        await message.reply("Olá, tudo bem? Sou um bot multifuncional para consultas de informações públicas da UNEMAT. " +
            "Digite ``/ajuda`` para ver a lista de comandos disponíveis ou ``/sobre`` para mais informações sobre mim!")
            .then((msg) => {
                bot_logger.debug(`Replied to ${message.author.username}#${message.author.discriminator} with message ID ${msg.id}.`)
            }).catch((err) => {
                bot_logger.error(err);
            });
    }
});