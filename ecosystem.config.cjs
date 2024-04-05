module.exports = {
    apps: [
        {
            name: "zragemaidbot",
            instances: "1",
            exec_mode: "fork",
            script: "npm -- run \"start:bot\""
        },
    ],
};