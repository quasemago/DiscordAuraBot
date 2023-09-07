import {Sequelize} from 'sequelize';

global.db_context = new Sequelize(
    bot_config.DATABASE_DB,
    bot_config.DATABASE_USER,
    bot_config.DATABASE_PASSWORD,
    {
        host: bot_config.DATABASE_HOST,
        dialect: 'mysql',
    }
);