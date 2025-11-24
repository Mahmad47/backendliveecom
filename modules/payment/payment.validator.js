const { body } = require("express-validator");

const createPaymentValidator = [
  body("total")
    .isFloat({ gt: 0 })
    .withMessage("Total amount must be a number greater than 0"),
];

module.exports = {
  createPaymentValidator,
};
