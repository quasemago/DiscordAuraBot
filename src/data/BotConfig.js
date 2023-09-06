import {config} from 'dotenv';

config();

global.bot_config = {
    BOT_ID: '',
    BOT_TOKEN: '',
    BOT_OWNER: '',
    DATABASE_HOST: '',
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
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_DB'
];

required_fields.forEach(field => {
    if (!bot_config[field]) {
        throw new Error(`Missing required field ${field} in .env file`);
    }
});