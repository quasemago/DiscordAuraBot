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
import Scholarships from "../../../database/models/Scholarships.js";

const cmdData = new SlashCommandBuilder()
    .setName('convenios')
    .setDescription('Visualiza os convênios (bolsas ou auxílios) disponíveis.')
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
                    Scholarships.findAll()
                        .then(async (scholarships) => {
                            if (scholarships.length === 0) {
                                await interaction.reply({
                                    content: 'Nenhum convênio encontrado.',
                                    ephemeral: true
                                });
                            } else {
                                const typeSelectMenu = new StringSelectMenuBuilder()
                                    .setCustomId(`${interaction.id}_type`)
                                    .setPlaceholder('Selecione o tipo de convênio!')
                                    .addOptions([
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel('Bolsas')
                                                .setValue('BOLSA'),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel('Auxílios')
                                                .setValue('AUXILIO')
                                        ]
                                    );

                                const typeActionMenu = new ActionRowBuilder()
                                    .addComponents(typeSelectMenu);

                                const reply = await interaction.reply({
                                    content: 'Selecione o tipo de convênio para consultar.',
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
                                        const resultScholarships = scholarships.filter((scholarship) =>
                                            scholarship.type === selectedType);

                                        if (resultScholarships.length === 0) {
                                            await i.update({
                                                content: 'Nenhum convênio encontrado para o tipo selecionado.'
                                            });
                                            return;
                                        }

                                        const scholarshipMenuSelect = new StringSelectMenuBuilder()
                                            .setCustomId(`${i.id}_edital`)
                                            .setPlaceholder('Selecione um edital de convênio para visualizar detalhes!')
                                            .addOptions(
                                                resultScholarships.map((edital) => {
                                                    return new StringSelectMenuOptionBuilder()
                                                        .setLabel(`${edital.code}`)
                                                        .setValue(`${edital.id}`);
                                                })
                                            );

                                        const scholarshipActionMenu = new ActionRowBuilder()
                                            .addComponents(scholarshipMenuSelect);

                                        const newReply = await i.update({
                                            content: 'Selecione um edital de convênio para visualizar detalhes.',
                                            components: [scholarshipActionMenu],
                                            ephemeral: true
                                        });

                                        const scholarshipCollector = newReply.createMessageComponentCollector({
                                            componentType: ComponentType.StringSelect,
                                            time: 45_000,
                                            filter: (interaction) => interaction.user.id === i.user.id && interaction.customId.startsWith(`${i.id}_edital`),
                                        });

                                        scholarshipCollector.on('collect', async (i_scholarship) => {
                                            const selectedScholarship = parseInt(i_scholarship.values[0]);
                                            const scholarship = resultScholarships.find((scholarship) => scholarship.id === selectedScholarship);
                                            if (!scholarship) {
                                                await i_scholarship.update({
                                                    content: 'Edital de convênio selecionado não encontrado.',
                                                });
                                                return;
                                            }

                                            const publicationDate = DateTime.fromFormat(scholarship.publication_date, 'yyyy-MM-dd')
                                                .setZone('America/Cuiaba')
                                                .toFormat('dd/MM/yyyy');

                                            await i_scholarship.update({
                                                content: ' ',
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setTitle(`Edital de Convênio: ${scholarship.type === 'BOLSA' ? 'Bolsa de Estudo' : 'Auxílio'}`)
                                                        .setDescription("Para visualizar informações detalhadas sobre o edital, [clique aqui](" + scholarship.url + ").")
                                                        .addFields(
                                                            {
                                                                name: 'Descrição do edital',
                                                                value: scholarship.title,
                                                                inline: false
                                                            }, {
                                                                name: 'Data de Publicação',
                                                                value: publicationDate,
                                                                inline: true
                                                            }, {
                                                                name: 'Documentação do edital',
                                                                value: `Para acessar, [clique aqui](${scholarship.document})`,
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
                                        scholarshipCollector.on('end', async () => {
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
