import {
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import {DateTime} from "luxon";
import {testDbConnection} from "../../../helpers/utils.js";
import Information from "../../../database/models/Information.js";

const cmdData = new SlashCommandBuilder()
    .setName('normativas')
    .setDescription('Visualiza as normativas e resoluções disponíveis.')
    .setDMPermission(true);

export default {
    data: cmdData,
    owner: false,
    cooldown: 10,
    category: 'unemat',
    async execute(interaction) {
        const now = DateTime.now().setZone('America/Cuiaba');
        await testDbConnection(db_context)
            .then(async () => {
                    Information.findAll()
                        .then(async (infos) => {
                            if (infos.length === 0) {
                                await interaction.reply({
                                    content: 'Nenhuma normativa ou resolução encontrada.',
                                    ephemeral: true
                                });
                            } else {
                                const typeSelectMenu = new StringSelectMenuBuilder()
                                    .setCustomId(`${interaction.id}_type`)
                                    .setPlaceholder('Selecione o tipo de informação')
                                    .addOptions([
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel('Normativação Acadêmica')
                                                .setValue('NORMATIVACAO'),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel('Instruções Normativas')
                                                .setValue('NORMATIVA'),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel('Resoluções')
                                                .setValue('RESOLUCAO')
                                        ]
                                    );

                                const typeActionMenu = new ActionRowBuilder()
                                    .addComponents(typeSelectMenu);

                                const reply = await interaction.reply({
                                    content: 'Selecione o tipo de de informação para consultar.',
                                    components: [typeActionMenu],
                                    ephemeral: true
                                });

                                const typeCollector = reply.createMessageComponentCollector({
                                    componentType: ComponentType.StringSelect,
                                    time: 45_000,
                                    filter: (i) => i.user.id === interaction.user.id && i.customId.startsWith(`${interaction.id}_type`),
                                });

                                typeCollector.on('collect', async (i) => {
                                        const selectedType = i.values[0];
                                        const resultInfos = infos.filter((info) =>
                                            info.type === selectedType);

                                        if (resultInfos.length === 0) {
                                            await i.update({
                                                content: 'Nenhuma informação encontrada para o tipo selecionado.'
                                            });
                                            return;
                                        }

                                        const infoMenuSelect = new StringSelectMenuBuilder()
                                            .setCustomId(`${i.id}_info`)
                                            .setPlaceholder('Selecione um edital para visualizar detalhes')
                                            .addOptions(
                                                resultInfos.map((edital) => {
                                                    return new StringSelectMenuOptionBuilder()
                                                        .setLabel(edital.title.length > 100 ? edital.title.substring(0, 96) + '...' : edital.title)
                                                        .setValue(`${edital.id}`);
                                                })
                                            );

                                        const infoActionMenu = new ActionRowBuilder()
                                            .addComponents(infoMenuSelect);

                                        const newReply = await i.update({
                                            content: 'Selecione um edital para visualizar detalhes!',
                                            components: [infoActionMenu],
                                            ephemeral: true
                                        });

                                        const infoCollector = newReply.createMessageComponentCollector({
                                            componentType: ComponentType.StringSelect,
                                            time: 45_000,
                                            filter: (interaction) => interaction.user.id === i.user.id && interaction.customId.startsWith(`${i.id}_info`),
                                        });

                                        infoCollector.on('collect', async (i_info) => {
                                            const selectedInfo = parseInt(i_info.values[0]);
                                            const info = resultInfos.find((info) => info.id === selectedInfo);
                                            if (!info) {
                                                await i_info.update({
                                                    content: 'Edital selecionado não encontrado.',
                                                });
                                                return;
                                            }

                                            const publicationDate = DateTime.fromFormat(info.publication_date, 'yyyy-MM-dd')
                                                .setZone('America/Cuiaba')
                                                .toFormat('dd/MM/yyyy');

                                            let formatedTitle = 'Resolução';
                                            if (info.type === 'NORMATIVACAO') {
                                                formatedTitle = 'Normativação Acadêmica';
                                            } else if (info.type === 'NORMATIVA') {
                                                formatedTitle = 'Instrução Normativa';
                                            }

                                            await i_info.update({
                                                content: ' ',
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setTitle(`Edital: ${formatedTitle}`)
                                                        .setDescription("Para visualizar informações detalhadas sobre o edital, [clique aqui](" + info.url + ").")
                                                        .addFields(
                                                            {
                                                                name: 'Descrição do edital',
                                                                value: `${formatedTitle} ${info.title}`,
                                                                inline: false
                                                            }, {
                                                                name: 'Data de Publicação',
                                                                value: publicationDate,
                                                                inline: true
                                                            }, {
                                                                name: 'Documentação do edital',
                                                                value: `Para acessar, [clique aqui](${info.document})`,
                                                                inline: true
                                                            })
                                                        .setColor(0x0099ff)
                                                        .setTimestamp()
                                                        .setFooter({
                                                            text: `Requisitado por ${interaction.user.username}`,
                                                            iconURL: interaction.user.avatarURL()
                                                        })
                                                ],
                                                components: []
                                            })
                                        })
                                        infoCollector.on('end', async () => {
                                            await newReply.edit({
                                                content: ' ',
                                                components: []
                                            });
                                        });
                                    }
                                )
                                ;
                                typeCollector.on('end', async () => {
                                    await reply.edit({
                                        content: ' ',
                                        components: []
                                    });
                                });
                            }
                        })
                }
            )
            .catch(async (err) => {
                await interaction.reply({
                    content: error_messages.DATABASE_CONNECTION,
                    ephemeral: true
                });
                bot_logger.error(err);
            });
    }
}
;
