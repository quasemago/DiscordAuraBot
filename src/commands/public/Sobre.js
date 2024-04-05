import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';

const cmdData = new SlashCommandBuilder()
    .setName('sobre')
    .setDescription('Informações sobre o Bot!')
    .setDMPermission(true);

export default {
    data: cmdData,
    owner: false,
    cooldown: 5,
    async execute(interaction) {
        // Format uptime field.
        const uptime = new Date(client.uptime).toISOString().substr(11, 8);

        // Create embed.
        const sobreEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`🤖 ${client.user.displayName}`)
            .setDescription(`Bot multifuncional focado em fornecer funcionalidades para consultas de informações públicas da UNEMAT.`)
            .addFields(
                // TODO: Create a const with the values.
                {name: 'Desenvolvido por', value: `${botauthor} [(Github)](${authorgithub})`, inline: true},
                {name: 'Versão', value: botversion, inline: true},
                {name: 'Uptime', value: uptime, inline: true},
            ).setTimestamp()
            .setFooter({text: `🤖 BOT ID: ${client.user.id}`, iconURL: null})

        // Send embed.
        await interaction.reply({
            embeds: [sobreEmbed],
            ephemeral: false
        });
    }
};