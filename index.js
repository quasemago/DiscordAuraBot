// Export bot config.
import './src/data/BotConfig.js';

// Export discord client interface.
import { DiscordClient } from './src/App.js';
global.client = new DiscordClient();

// Start the bot.
try {
    client.start()
        .then(() => {
            console.log('Discord Bot started!');
        });
} catch (e) {
    console.error(e);
}