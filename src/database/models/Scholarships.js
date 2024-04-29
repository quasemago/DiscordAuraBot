import Sequelize, {Model} from "sequelize";

export default class Scholarships extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                code: {
                    type: Sequelize.STRING,
                    allowNull: false,
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
                    type: Sequelize.ENUM("BOLSA", "AUXILIO"),
                    allowNull: false,
                },
            }, {
                sequelize,
                tableName: "scholarships",
            });
        return this;
    }
}