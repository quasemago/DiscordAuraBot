import {
    ActionRowBuilder,
    ComponentType,
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
                await FAQ.findAll()
                    .then(async (faqs) => {
                        let resultFaqList = [];

                        for (const faqItem of faqs) {
                            resultFaqList.push({
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
                                            .setValue(`**${index + 1}. ${faqItem.title}**\n${faqItem.description}`);
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
                                time: 60000,
                                filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
                            });

                            collector.on('collect', async (i) => {
                                await i.update({
                                    embeds: [{
                                        title: i.values[1],
                                        description: i.values[0]
                                    }],
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