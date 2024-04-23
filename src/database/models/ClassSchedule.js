import Sequelize, {Model} from "sequelize";

export default class ClassSchedule extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                date: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                schedule: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                semester: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                subject: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                teacher: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                room: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            }, {
                sequelize,
                tableName: "class_schedule",
            });
        return this;
    }
}