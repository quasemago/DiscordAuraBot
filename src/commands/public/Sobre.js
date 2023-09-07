import {SlashCommandBuilder,EmbedBuilder} from 'discord.js';
import {convertMsToHM} from "../../helpers/utils.js";

const cmdData = new SlashCommandBuilder()
    .setName('sobre')
    .setDescription('Informações sobre o Bot!');

export default {
    data: cmdData,
    owner: false,
    async execute(interaction) {
        const sobreEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`🤖 ${client.user.displayName}: Sobre`)
            .setDescription("Bot para servidor de discord...")
            .addFields(
                // TODO: Create a const with the values.
                {name: 'Criado por', value: 'Bruno "quasemago" Ronning [(Github)](https://github.com/quasemago)', inline: false},
                {name: 'Versão', value: '0.2.0', inline: true},
                {name: 'Uptime', value: `${convertMsToHM(client.uptime)} horas`, inline: true},
            ).setTimestamp()
            .setFooter({text: `🤖 BOT ID: ${client.user.id}`, iconURL: null})

        await interaction.reply({embeds: [sobreEmbed], ephemeral: true});
    }
};