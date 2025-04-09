'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Budgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      budget_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Unique constraint on user + category + date range
    await queryInterface.addConstraint('Budgets', {
      fields: ['user_id', 'category_id', 'start_date', 'end_date'],
      type: 'unique',
      name: 'unique_user_category_time_range'
    });

    // Foreign key constraints
    await queryInterface.addConstraint('Budgets', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('Budgets', {
      fields: ['category_id'],
      type: 'foreign key',
      references: {
        table: 'Categories',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    // ✅ Add CHECK constraint: start_date must be less than end_date
    await queryInterface.sequelize.query(`
      ALTER TABLE Budgets
      ADD CONSTRAINT check_start_date_before_end_date
      CHECK (start_date < end_date)
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Budgets');
  }
};
