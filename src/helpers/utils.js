import path from 'path'
import { fileURLToPath } from 'url'

export const isBotOwner = function (userid) {
    return userid === bot_config.BOT_OWNER;
}

export const userHasPermission = function (interaction, cmdData) {
    return new Promise((resolve) => {
        // Check if is the bot owner.
        if (isBotOwner(interaction.user.id)) {
            resolve(true);
            return;
        }

        // Check if the command is a DM command.
        if (cmdData.dm_permission) {
            resolve(true);
            return;
        }

        // It is expected that this check is being done in a guild.
        if (!interaction.guild || !interaction.member) {
            resolve(false);
            return;
        }

        resolve(interaction.member.permissions.has(cmdData.default_member_permissions, true));
    });
}

export const getDirName = function (moduleUrl) {
    const filename = fileURLToPath(moduleUrl)
    return path.dirname(filename)
}