import {PermissionFlagsBits, SlashCommandBuilder} from 'discord.js';
import GuildServer from "../../database/models/GuildServer.js";

const cmdData = new SlashCommandBuilder()
    .setName('greeting')
    .setDescription('[Admin] Configura a mensagem de boa-vinda do server!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(option =>
        option.setName('status')
            .setDescription('Ativar/Desativar a mensagem de boas-vindas')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('mensagem')
            .setDescription('Mensagem de boas-vindas')
            .setRequired(false))
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Canal de boas-vindas')
            .setRequired(false))
    .setDMPermission(false);

export default {
    data: cmdData,
    owner: false,
    cooldown: 15,
    category: 'admin',
    async execute(interaction) {
        const status = interaction.options.getBoolean('status');
        const mensagem = interaction.options.getString('mensagem');
        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;

        await GuildServer.findOne({where: {guild_id: guildId}})
            .then(async (server) => {
                if (!server) {
                    await interaction.reply({
                        content: 'Não foi possível encontrar esse servidor no banco de dados!',
                        ephemeral: true
                    });
                } else {
                    if (!status) {
                        await GuildServer.update({
                            greeting_channel_id: null,
                            greeting_message: null
                        }, {
                            where: {
                                guild_id: guildId
                            }
                        }).then(async () => {
                            await interaction.reply({
                                content: 'Mensagem de boas-vindas desativada com sucesso!',
                                ephemeral: true
                            });
                        });
                    } else {
                        if (status && (!mensagem || !channel)) {
                            await interaction.reply({
                                content: 'Você precisa informar a mensagem e canal quando está tentando ativar a mensagem de boas-vindas!',
                                ephemeral: true
                            });
                            return;
                        }

                        if (mensagem.length > 2000) {
                            await interaction.reply({
                                content: 'A mensagem de boas-vindas não pode ter mais de 2000 caracteres!',
                                ephemeral: true
                            });
                            return;
                        }

                        await GuildServer.update({
                            greeting_channel_id: channel.id,
                            greeting_message: mensagem
                        }, {
                            where: {
                                guild_id: guildId
                            }
                        }).then(async () => {
                            await interaction.reply({
                                content: 'Mensagem de boas-vindas ativada com sucesso!',
                                ephemeral: true
                            });
                        });
                    }
                }
            }).catch(async (err) => {
                bot_logger.error(err);
                await interaction.reply({
                    content: error_messages.DATABASE_CONNECTION,
                    ephemeral: true
                });
            });
    }
};