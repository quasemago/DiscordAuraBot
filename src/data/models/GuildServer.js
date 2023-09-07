import {DataTypes} from "sequelize";

export const guildServer = db_context.define(
    "GuildServer",
    {
        // Model attributes.
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        guild_id: {
            type: DataTypes.BIGINT,
            unique: true,
            allowNull: false,
        },
    },
    {
        // Model options.
        tableName: "guild_servers",
    }
);