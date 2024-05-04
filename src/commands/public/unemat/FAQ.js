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
    category: 'unemat',
    async execute(interaction) {
        await testDbConnection(db_context)
            .then(async () => {
                await FAQ.findAll({
                    order: [
                        ['frequency', 'DESC']
                    ]
                })
                    .then(async (faqs) => {
                        if (faqs.length === 0) {
                            await interaction.reply({
                                content: 'Nenhuma pergunta frequente cadastrada.',
                                ephemeral: true
                            });
                        } else {
                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId(interaction.id)
                                .setPlaceholder('Selecione uma pergunta!')
                                .addOptions(
                                    faqs.map((faqItem, index) => {
                                        return new StringSelectMenuOptionBuilder()
                                            .setLabel(`${index + 1}. ${faqItem.question}`)
                                            .setValue(`${faqItem.id}`);
                                    })
                                );

                            const actionRowMenu = new ActionRowBuilder()
                                .addComponents(selectMenu);

                            const reply = await interaction.reply({
                                components: [actionRowMenu],
                                ephemeral: true
                            });

                            const collector = reply.createMessageComponentCollector({
                                componentType: ComponentType.StringSelect,
                                time: 45_000,
                                filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
                            });

                            collector.on('collect', async (i) => {
                                const faqItem = faqs.find(faq => faq.id === parseInt(i.values[0]));
                                if (!faqItem) {
                                    await i.update({
                                        content: 'Pergunta selecionada não encontrada.',
                                        components: []
                                    });
                                    return;
                                }

                                console.log(faqItem);

                                await i.update({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle("FAQ: " + faqItem.question)
                                            .setDescription(`${faqItem.answer}\n\nCaso tenha alguma sugestão para incluir no FAQ, envie em **https://forms.gle/wDG243J5FPJtwdNR9**.`)
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
                                    where: {id: faqItem.id}
                                });
                            });
                            collector.on('end', async () => {
                                await reply.edit({
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