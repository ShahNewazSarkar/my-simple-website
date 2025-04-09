'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Budget.init({
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    budget_amount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Budget',
  });
  return Budget;
};