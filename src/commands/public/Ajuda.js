import {SlashCommandBuilder} from 'discord.js';
import {userHasPermission} from "../../helpers/utils.js";

const cmdData = new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Lista os comandos do Bot!')
    .setDMPermission(true);

export default {
    data: cmdData,
    owner: false,
    cooldown: 10,
    async execute(interaction) {
        const commandList = await JSON.parse(JSON.stringify(client.commandList));

        let resultArray = [];
        for (const cmd of commandList) {
            // Check if the user has permission to use the command.
            // Otherwise, don't show it in the list.
            await userHasPermission(interaction, cmd)
                .then((value) => {
                    if (value) {
                        resultArray.push('> ``/' + cmd.data.name + '`` - ' + cmd.data.description + '\n');
                    }
                });
        }

        if (resultArray.length === 0) {
            resultArray.push('> No commands available.');
        }

        await interaction.reply({content: resultArray.join(''), ephemeral: true});
    }
};