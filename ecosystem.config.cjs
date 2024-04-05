module.exports = {
    apps: [
        {
            name: "discordunematbot",
            instances: "1",
            exec_mode: "fork",
            script: "npm -- run \"start:bot\""
        },
    ],
};