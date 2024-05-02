import Sequelize, {Model} from "sequelize";

export default class Information extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                publication_date: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                document: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                type: {
                    type: Sequelize.ENUM("NORMATIVACAO", "NORMATIVA", "RESOLUCAO"),
                    allowNull: false,
                },
            }, {
                sequelize,
                tableName: "information",
            });
        return this;
    }
}