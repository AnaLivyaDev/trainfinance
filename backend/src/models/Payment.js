const { Model, DataTypes } = require("sequelize");

class Payment extends Model {
  static init(sequelize) {
    super.init(
      {
        studentId: {
          type: DataTypes.INTEGER,
          field: "student_id",
        },

        amount: DataTypes.DECIMAL(10, 2),

        referenceYear: {
          type: DataTypes.INTEGER,
          field: "reference_year",
        },

        referenceMonth: {
          type: DataTypes.INTEGER,
          field: "reference_month",
        },

        dueDay: {
          type: DataTypes.INTEGER,
          field: "due_day",
        },

        paymentDate: {
          type: DataTypes.DATEONLY,
          field: "payment_date",
        },
      },
      {
        sequelize,
        tableName: "payments",
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: "student_id",
      as: "student",
    });
  }
}

module.exports = Payment;