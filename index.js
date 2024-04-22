import './src/config/BotConfig.js';
import './src/helpers/constants.js';
import './src/helpers/logger.js';
import {DiscordClient} from './src/App.js';

// Start the bot.
global.client = new DiscordClient();

try {
    client.start()
        .then(() => {
            console.log('Discord Bot started!');
        });
} catch (e) {
    console.error(e);
}