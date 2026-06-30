const { Model, DataTypes } = require("sequelize");

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,

        phone: DataTypes.STRING,

        studentType: {
          type: DataTypes.ENUM("STANDARD", "SOCIAL"),
          field: "student_type",
        },

        monthlyFee: {
          type: DataTypes.DECIMAL(10, 2),
          field: "monthly_fee",
        },

        dueDay: {
          type: DataTypes.INTEGER,
          field: "due_day",
        },

        active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "students",
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Payment, {
      foreignKey: "student_id",
      as: "payments",
    });
  }
}

module.exports = Student;