import Sequelize, {Model} from "sequelize";

export default class FAQ extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                question: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                answer: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                frequency: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            }, {
                sequelize,
                tableName: "faq",
            });
        return this;
    }
}