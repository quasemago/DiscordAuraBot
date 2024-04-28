import {Events} from 'discord.js';
import {isBotOwner} from "../helpers/utils.js";

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    // Check if command exists.
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        bot_logger.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    if (command.owner && !isBotOwner(interaction.user.id)) {
        await interaction.reply({content: 'You are not the bot owner!', ephemeral: true});
        return;
    }

    // Check cmd cooldown to prevent spam.
    const now = Date.now();
    const timestamps = interaction.client.commandCooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({
                content: `Aguarde, você poderá utilizar novamente esse comando: <t:${expiredTimestamp}:R>.`,
                ephemeral: true
            });
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        // Execute command.
        await command.execute(interaction);
    } catch (err) {
        bot_logger.error(err);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command, report this to an administrator!',
                ephemeral: false
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command, report this to an administrator!',
                ephemeral: false
            });
        }
    }
});