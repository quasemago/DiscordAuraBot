import Sequelize, {Model} from "sequelize";

export default class GuildServer extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                guild_id: {
                    type: Sequelize.BIGINT,
                    unique: true,
                    allowNull: false,
                },
            }, {
                sequelize,
            });
        return this;
    }
}