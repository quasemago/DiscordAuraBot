import Sequelize, {Model} from "sequelize";

export default class ClassPeriod extends Model {
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
                }
            }, {
                sequelize,
                tableName: "class_period",
            });
        return this;
    }

    static associate(models) {
        this.hasMany(models.ClassSchedule, {
            foreignKey: 'period_id'
        });
    }
}