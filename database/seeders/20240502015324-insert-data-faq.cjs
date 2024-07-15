'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const filePath = path.join(__dirname, './sql/dump20240504_faq.sql');
        const sql = fs.readFileSync(filePath, {encoding: 'utf-8'});
        await queryInterface.sequelize.query(sql);
    },

    async down(queryInterface, Sequelize) {
        // TODO
    }
};
