import {config} from 'dotenv';

config();

global.bot_config = {
    // Discord BOT.
    BOT_ID: '',
    BOT_TOKEN: '',
    BOT_OWNER: '',
    BOT_PRESENCE_TYPE: '',
    BOT_PRESENCE_MSG: '',

    // Bot Database.
    DATABASE_HOST: '',
    DATABASE_PORT: '',
    DATABASE_USER: '',
    DATABASE_PASSWORD: '',
    DATABASE_DB: ''
}

// Parse .env file
Object.keys(bot_config).forEach(key => {
    bot_config[key] = process.env[key];
});

// Check for required fields.
let required_fields = [
    'BOT_ID',
    'BOT_TOKEN',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_DB'
];

required_fields.forEach(field => {
    if (!bot_config[field]) {
        throw new Error(`Missing required field ${field} in .env file`);
    }
});