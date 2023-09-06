import {SlashCommandBuilder} from 'discord.js';

const cmdData = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!');

export default {
    data: cmdData,
    owner: false,
    async execute(interaction) {
        await interaction.reply({content: 'Pong!', ephemeral: true});
    }
};