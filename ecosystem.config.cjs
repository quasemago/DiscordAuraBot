module.exports = {
    apps: [
        {
            name: "auradiscordbot",
            instances: "1",
            exec_mode: "fork",
            script: "npm -- run \"start:bot\""
        },
    ],
};