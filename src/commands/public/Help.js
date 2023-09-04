import { SlashCommandBuilder } from 'discord.js';
import { userHasPermission } from "../../helpers/utils.js";

const cmdData = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get the list of bot commands!');

export default {
    data: cmdData,
    owner: false,
    async execute(interaction) {
        const commandList = await JSON.parse(JSON.stringify(client.commandList));

        let resultArray = [];
        for (const cmd of commandList) {
            // Check if the user has permission to use the command.
            // Otherwise, don't show it in the list.
            let hasPermission = await userHasPermission(interaction, cmd.data);
            if (hasPermission) {
                resultArray.push('> ``/' + cmd.data.name + '`` - ' + cmd.data.description + '\n');
            }
        }

        await interaction.reply({ content: resultArray.join(''), ephemeral: true });
    }
};