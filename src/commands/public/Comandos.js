import {EmbedBuilder, SlashCommandBuilder} from 'discord.js';

const cmdData = new SlashCommandBuilder()
    .setName('comandos')
    .setDescription('Lista os comandos do Bot!')
    .setDMPermission(true);

export default {
    data: cmdData,
    owner: false,
    cooldown: 10,
    category: 'geral',
    async execute(interaction) {
        const commandList = await JSON.parse(JSON.stringify(client.commands));
        if (!commandList || commandList.length === 0) {
            await interaction.reply({
                content: 'Desculpe, mas não encontrei nenhum comando disponível!',
                ephemeral: false
            });
            return;
        }

        // Group commands by category.
        const commandsData = {};
        commandList.forEach((cmd) => {
            const {category} = cmd;
            if (!commandsData[category]) {
                commandsData[category] = [];
            }
            commandsData[category].push(cmd);
        });

        const embed = new EmbedBuilder()
            .setTitle(`🤖 ${client.user.displayName} - Lista de comandos`)
            .setThumbnail(client.user.avatarURL())
            .setColor(0x0099ff)
            .setTimestamp()
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })

        // Add fields for each category.
        Object.keys(commandsData).forEach(category => {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            const value = commandsData[category].map(item => {
                return `- \`\`/${item.data.name}\`\` - ${item.data.description}`;
            }).join('\n');
            embed.addFields({
                name: categoryName,
                value: value,
                inline: false
            });
        });

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
};