global.fs = require('fs');

require('./src/data/BotConfig.js');

discordClient = require('./src/app.js');
global.client = new discordClient();

try {
    client.start();
} catch (e) {
    console.error(e);
}