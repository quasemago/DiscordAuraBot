import { Events } from 'discord.js';
import { isBotOwner } from "../helpers/utils.js";

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = interaction.client.commandList.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    if (command.owner && !isBotOwner(interaction.user.id)) {
        await interaction.reply({ content: 'You are not the bot owner!', ephemeral: true });
        return;
    }

    await command.execute(interaction)
        .catch(async error => {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
});