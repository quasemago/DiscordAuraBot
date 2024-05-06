'use strict';

const Sequelize = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('guild_servers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      guild_id: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
      },
      greeting_channel_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      greeting_message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('guild_servers');
  }
};
