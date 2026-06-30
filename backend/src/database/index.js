const Sequelize = require("sequelize");

const config = require("../config/config");

const Student = require("../models/Student");
const Payment = require("../models/Payment");

const connection = new Sequelize(
  config.development
);

const models = [
  Student,
  Payment,
];

models.forEach(model =>
  model.init(connection)
);

models.forEach(model => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

module.exports = connection;