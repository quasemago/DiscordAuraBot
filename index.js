global.fs = require('fs');

// Export bot config.
require('./src/data/BotConfig.js');

// Export discord client interface.
discordClient = require('./src/App.js');
global.client = new discordClient();

// Start the bot.
try {
    client.start()
        .then(() => {
            console.log('Bot started!');
        });
} catch (e) {
    console.error(e);
}