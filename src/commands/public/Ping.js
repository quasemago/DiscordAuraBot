import {SlashCommandBuilder} from 'discord.js';

const cmdData = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!')
    .setDMPermission(true);

export default {
    data: cmdData,
    owner: false,
    cooldown: 15,
    category: 'geral',
    async execute(interaction) {
        await interaction.reply({content: `:ping_pong: ${client.ws.ping}ms`, ephemeral: false});
    }
};