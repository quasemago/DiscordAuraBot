import {
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import {createCanvas} from "@napi-rs/canvas";
import {DateTime} from "luxon";
import {testDbConnection, formatNumberWithLeadingZero} from "../../../helpers/utils.js";
import ClassPeriod from "../../../database/models/ClassPeriod.js";
import ClassSchedule from "../../../database/models/ClassSchedule.js";
import {Op} from "sequelize";

const cmdData = new SlashCommandBuilder()
    .setName('horario')
    .setDescription('Visualiza a grade de horários para a semana atual de um determinado semestre.')
    .setDMPermission(true);

const getDayOfWeek = (dateString) => {
    return DateTime.fromISO(dateString, {locale: 'pt-BR'}).toFormat('ccc')
        .toUpperCase()
        .replace(/\.$/, '');
}

const createScheduleImage = (scheduleData, schedulePeriod) => {
    const width = 640;
    const height = 420;
    const headerHeight = 30;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.font = 'bold 16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Header.
    context.fillStyle = '#333';
    context.fillRect(0, 0, width, headerHeight);
    context.fillStyle = '#fff';
    context.fillText('Horário das Aulas: ' + schedulePeriod, width / 2, headerHeight / 2);

    // Days of week header.
    const daysOfWeek = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
    const cellWidth = width / daysOfWeek.length;
    const cellHeight = height / 5; // 4 horários + cabeçalho duplo

    context.fillStyle = 'black';
    daysOfWeek.forEach((day, i) => {
        context.fillText(day, cellWidth * i + cellWidth / 2, cellHeight / 1.5);
    });

    // Start drawing the schedule.
    // Set default values.
    for (let i = 1; i < 5; i++) { // 4 horários
        for (let j = 0; j < daysOfWeek.length; j++) {
            context.fillText('X', cellWidth * j + cellWidth / 2, cellHeight * i + cellHeight / 2);
        }
    }

    // Draw the schedule.
    scheduleData.forEach(item => {
        const dayOfWeek = getDayOfWeek(item.date);
        const dayIndex = daysOfWeek.indexOf(dayOfWeek);
        if (dayIndex !== -1) {
            const scheduleNumbers = item.schedule.split('').map(Number);
            scheduleNumbers.forEach(number => {
                const x = cellWidth * dayIndex;
                const y = cellHeight * number + cellHeight / 2;
                context.fillStyle = 'white';
                context.fillRect(x, y - cellHeight / 2, cellWidth, cellHeight);
                context.fillStyle = 'black';
                context.fillText(item.code, x + cellWidth / 2, y);
            });
        }
    });

    return canvas.toBuffer('image/png');
}

export default {
    data: cmdData,
    owner: false,
    cooldown: 10,
    category: 'unemat',
    async execute(interaction) {
        const now = DateTime.now().setZone('America/Cuiaba');
        await testDbConnection(db_context)
            .then(async () => {
                await ClassPeriod.findAll()
                    .then(async (periods) => {
                        if (periods.length === 0) {
                            await interaction.reply({
                                content: 'Nenhum período letivo cadastrado.',
                                ephemeral: true
                            });
                        } else {
                            const periodSelectMenu = new StringSelectMenuBuilder()
                                .setCustomId(`${interaction.id}_period`)
                                .setPlaceholder('Selecione um período letivo!')
                                .addOptions(
                                    periods.map((period) => {
                                        return new StringSelectMenuOptionBuilder()
                                            .setLabel(`${period.code}`)
                                            .setValue(`${period.id}`);
                                    })
                                );

                            const periodActionMenu = new ActionRowBuilder()
                                .addComponents(periodSelectMenu);

                            const reply = await interaction.reply({
                                content: 'Selecione um período letivo para visualizar a grade de horários.',
                                components: [periodActionMenu],
                                ephemeral: true
                            });

                            const periodColector = reply.createMessageComponentCollector({
                                componentType: ComponentType.StringSelect,
                                time: 45_000,
                                filter: (i) => i.user.id === interaction.user.id && i.customId.startsWith(`${interaction.id}_period`),
                            });

                            periodColector.on('collect', async (i) => {
                                const selectedPeriod = parseInt(i.values[0]);
                                const periodStartOfWeek = now.startOf('week').toJSDate();
                                const periodEndOfWeek = now.endOf('week', {useLocaleWeeks: false}).toJSDate();
                                const resultLessonsList = await ClassSchedule.findAll({
                                    where: {
                                        period_id: selectedPeriod,
                                        date: {
                                            [Op.gte]: periodStartOfWeek,
                                            [Op.lt]: periodEndOfWeek
                                        }
                                    }
                                });

                                if (resultLessonsList.length === 0) {
                                    await i.update({
                                        content: 'Nenhum horário de aula cadastrado para o período selecionado.',
                                        components: []
                                    });
                                    return;
                                }

                                const semesterMenuSelect = new StringSelectMenuBuilder()
                                    .setCustomId(`${i.id}_semester`)
                                    .setPlaceholder('Selecione um semestre do período letivo!')
                                    .addOptions(
                                        Array.from({length: 8}, (_, i) => {
                                            const semesterNumber = i + 1;
                                            return new StringSelectMenuOptionBuilder()
                                                .setLabel(`Semestre ${semesterNumber}`)
                                                .setValue(`${semesterNumber}`);
                                        })
                                    );

                                const semesterActionMenu = new ActionRowBuilder()
                                    .addComponents(semesterMenuSelect);

                                const newReply = await i.update({
                                    content: 'Selecione um semestre para visualizar a grade de horários da semana atual.',
                                    components: [semesterActionMenu],
                                    ephemeral: true
                                });

                                const semesterCollector = newReply.createMessageComponentCollector({
                                    componentType: ComponentType.StringSelect,
                                    time: 45_000,
                                    filter: (interaction) => interaction.user.id === i.user.id && interaction.customId.startsWith(`${i.id}_semester`),
                                });

                                semesterCollector.on('collect', async (i_semester) => {
                                    const selectedSemester = parseInt(i_semester.values[0]);
                                    const semesterLessons = resultLessonsList.filter((lesson) => lesson.semester === selectedSemester);
                                    if (semesterLessons.length === 0) {
                                        await i_semester.update({
                                            content: 'Nenhum horário de aula cadastrado para o semestre selecionado para a semana atual.',
                                        });
                                        return;
                                    }

                                    const schedulePeriod = `${formatNumberWithLeadingZero(periodStartOfWeek.getDate())}/${formatNumberWithLeadingZero(periodStartOfWeek.getMonth() + 1)} - ${formatNumberWithLeadingZero(periodEndOfWeek.getDate())}/${formatNumberWithLeadingZero(periodEndOfWeek.getMonth() + 1)}`;
                                    const canvasBuffer = createScheduleImage(semesterLessons, schedulePeriod);
                                    let lessonLegend = '';
                                    let lessonTeachers = '';

                                    semesterLessons.forEach((lesson) => {
                                        lessonLegend += `**${lesson.code}** - ${lesson.subject}\n`;
                                        lessonTeachers += `**${lesson.code}** - ${lesson.teacher}\n`;
                                    });

                                    await i_semester.update({
                                        content: 'Aqui estão os horários da semana para o semestre e período selecionado:',
                                        embeds: [
                                            new EmbedBuilder()
                                                .setDescription("Caso queira visualizar a grade de horário detalhadamente, acesse: **https://bit.ly/HorarioSI2024-1**.")
                                                .setColor(0x0099ff)
                                                .addFields(
                                                    {
                                                        name: 'Legenda',
                                                        value: lessonLegend,
                                                        inline: true
                                                    }, {
                                                        name: 'Professores',
                                                        value: lessonTeachers,
                                                        inline: true
                                                    }
                                                )
                                                .setTimestamp()
                                                .setFooter({
                                                    text: `Requisitado por ${interaction.user.username}`,
                                                    iconURL: interaction.user.avatarURL()
                                                })
                                        ],
                                        files: [{
                                            attachment: canvasBuffer,
                                            name: 'horarios.png'
                                        }],
                                        components: []
                                    });
                                })

                                semesterCollector.on('end', async () => {
                                    await newReply.edit({
                                        content: ' ',
                                        components: []
                                    });
                                });
                            })
                            periodColector.on('end', async () => {
                                await reply.edit({
                                    content: ' ',
                                    components: []
                                });
                            });
                        }
                    })
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
