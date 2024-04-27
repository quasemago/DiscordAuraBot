import {
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import {testDbConnection} from "../../../helpers/utils.js";
import FAQ from "../../../database/models/FAQ.js";

const cmdData = new SlashCommandBuilder()
    .setName('faq')
    .setDescription('FAQ (Perguntas Frequentes).')
    .setDMPermission(true);

export default {
    data: cmdData,
    owner: false,
    cooldown: 10,
    async execute(interaction) {
        await testDbConnection(db_context)
            .then(async () => {
                await FAQ.findAll({
                    order: [
                        ['frequency', 'DESC']
                    ]
                })
                    .then(async (faqs) => {
                        let resultFaqList = [];

                        for (const faqItem of faqs) {
                            resultFaqList.push({
                                id: faqItem.id,
                                title: faqItem.question,
                                description: faqItem.answer
                            });
                        }

                        if (resultFaqList.length === 0) {
                            await interaction.reply({
                                content: 'Nenhuma pergunta frequente cadastrada.',
                                ephemeral: true
                            });
                        } else {
                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId(interaction.id)
                                .setPlaceholder('Selecione uma pergunta!')
                                .addOptions(
                                    resultFaqList.map((faqItem, index) => {
                                        return new StringSelectMenuOptionBuilder()
                                            .setLabel(`${index + 1}. ${faqItem.title}`)
                                            .setValue(`${faqItem.id};**${faqItem.title}**;${faqItem.description}`);
                                    })
                                );

                            const actionRowMenu = new ActionRowBuilder()
                                .addComponents(selectMenu);

                            const replyFaq = await interaction.reply({
                                components: [actionRowMenu],
                                ephemeral: true
                            });

                            const collector = replyFaq.createMessageComponentCollector({
                                componentType: ComponentType.StringSelect,
                                time: 45_000,
                                filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
                            });

                            collector.on('collect', async (i) => {
                                const faqData = i.values[0].split(';');
                                const faqId = faqData[0];
                                const faqTitle = faqData[1];
                                const faqDescription = faqData[2];

                                await i.update({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle("FAQ: " + faqTitle)
                                            .setDescription(faqDescription)
                                            .setColor(0x0099ff)
                                            .setTimestamp()
                                            .setFooter({
                                                text: `Requisitado por ${interaction.user.username}`,
                                                iconURL: interaction.user.avatarURL()
                                            })
                                    ],
                                });

                                await FAQ.increment('frequency', {
                                    by: 1,
                                    where: {id: faqId}
                                });
                            });
                            collector.on('end', async () => {
                                await replyFaq.edit({
                                    content: ' ',
                                    components: []
                                });
                            });
                        }
                    });
            })
            .catch(async (err) => {
                await interaction.reply({
                    content: error_messages.DATABASE_CONNECTION,
                    ephemeral: true
                });
                bot_logger.error(err);
            });
    }
};