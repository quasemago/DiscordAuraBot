import Sequelize, {Model} from "sequelize";

export default class Information extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                thumbnail: {
                    type: Sequelize.STRING,
                    allowNull: false,
                }
            }, {
                sequelize,
                modelName: "information",
            }
        );
    }
}
