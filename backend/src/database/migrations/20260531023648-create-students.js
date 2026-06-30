"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      student_type: {
        type: Sequelize.ENUM("STANDARD", "SOCIAL"),
        allowNull: false,
        defaultValue: "STANDARD",
      },

      monthly_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      due_day: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 10,
      },

      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("students");
  },
};