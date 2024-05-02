import {Sequelize} from 'sequelize';

import GuildServer from "./models/GuildServer.js";
import ClassPeriod from "./models/ClassPeriod.js";
import ClassSchedule from "./models/ClassSchedule.js";
import Scholarships from "./models/Scholarships.js";
import Information from "./models/Information.js";
import FAQ from "./models/FAQ.js";

const models = [
    GuildServer,
    ClassPeriod,
    ClassSchedule,
    Scholarships,
    Information,
    FAQ,
];

global.db_context = new Sequelize(
    bot_config.DATABASE_DB,
    bot_config.DATABASE_USER,
    bot_config.DATABASE_PASSWORD,
    {
        dialect: bot_config.DATABASE_DIALECT,
        host: bot_config.DATABASE_HOST,
        port: parseInt(bot_config.DATABASE_PORT),
        timezone: '-04:00',
        dialectOptions: {
            charset: 'utf8',
        }
    }
);

// Start model db connection
models.forEach((model) => model.init(db_context));

// Check for db associations.
models.forEach((model) => model.associate && model.associate(db_context.models));