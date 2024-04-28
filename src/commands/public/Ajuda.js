import {EmbedBuilder, SlashCommandBuilder} from 'discord.js';

const cmdData = new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Comando de ajuda, com informações sobre o bot.')
    .setDMPermission(true);

export default {
    data: cmdData,
    owner: false,
    cooldown: 10,
    category: 'geral',
    async execute(interaction) {
        const uptime = new Date(client.uptime).toISOString().substr(11, 8);
        const embed = new EmbedBuilder()
            .setTitle(`🤖 ${client.user.displayName}`)
            .setThumbnail(client.user.avatarURL())
            .setDescription("Olá <@"+interaction.user.id+">, tudo bem? Sou um bot multifuncional focado em fornecer funcionalidades para consultas de informações públicas da UNEMAT." +
                "\n\nDigite ``/comandos`` para visualizar toda a minha lista de comandos disponíveis.")
            .setColor(0x0099ff)
            .setTimestamp()
            .addFields(
                // TODO: Create a const with the values.
                {name: 'Desenvolvido por', value: `${botauthor} [(Github)](${authorgithub})`, inline: true},
                {name: 'Versão', value: botversion, inline: true},
                {name: 'Uptime', value: uptime, inline: true},
            )
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        })
    }
};