import {Sequelize} from 'sequelize';

import GuildServer from "./models/GuildServer.js";
import ClassSchedule from "./models/ClassSchedule.js";
import Scholarships from "./models/Scholarships.js";
import FAQ from "./models/FAQ.js";

const models = [
    GuildServer,
    ClassSchedule,
    Scholarships,
    FAQ,
]

global.db_context = new Sequelize(
    bot_config.DATABASE_DB,
    bot_config.DATABASE_USER,
    bot_config.DATABASE_PASSWORD,
    {
        dialect: 'mysql',
        host: bot_config.DATABASE_HOST,
        port: parseInt(bot_config.DATABASE_PORT)
    }
);

// Start model db connection
models.forEach((model) => model.init(db_context));

// Check for db associations.
models.forEach((model) => model.associate && model.associate(db_context.models));