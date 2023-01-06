'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', "admin", {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "admin")
  }
};
