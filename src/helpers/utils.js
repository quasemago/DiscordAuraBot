import path from 'path'
import fs from 'fs';
import {fileURLToPath} from 'url'

export const isBotOwner = function (userid) {
    return userid === bot_config.BOT_OWNER;
}

export const userHasPermission = function (interaction, cmd) {
    return new Promise(async (resolve) => {
        let isOwner = isBotOwner(interaction.user.id);
        if (isOwner) {
            resolve(true);
            return;
        }

        // Check if is the bot owner, if applicable.
        if (cmd.owner && !isOwner) {
            resolve(false);
            return;
        }

        // Check if the command is a DM command.
        if (typeof cmd.data.dm_permission !== 'undefined' && cmd.data.dm_permission) {
            resolve(true);
            return;
        }

        // It is expected that this check is being done in a guild.
        if (typeof interaction.guild === 'undefined' || typeof interaction.member === 'undefined') {
            resolve(false);
            return;
        }

        // Check if the command has a required permission.
        if (typeof cmd.data.default_member_permissions === 'undefined') {
            resolve(true);
            return;
        }

        // Check if the user has the required permission.
        let result = await interaction.member.permissions.has(cmd.data.default_member_permissions, true);
        resolve(result);
    });
}

export const getDirName = function (moduleUrl) {
    const filename = fileURLToPath(moduleUrl)
    return path.dirname(filename)
}

export const testDbConnection = async function (db) {
    return new Promise(async (resolve, reject) => {
        await db.authenticate()
            .then(() => {
                resolve(true);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export const sendPrivateMessageToOwner = async function (message) {
    let owner = await client.users.fetch(bot_config.BOT_OWNER);
    if (owner !== null) {
        await owner.send(message)
            .catch(err => {
                bot_logger.error(err);
            });
    }
}

export const mathRound = async function (num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

export function *getAllFilesFromDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            yield* getAllFilesFromDir(path.join(dir, file.name));
        } else {
            yield path.join(dir, file.name);
        }
    }
}