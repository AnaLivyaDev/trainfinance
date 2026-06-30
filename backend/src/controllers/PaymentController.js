const Payment = require("../models/Payment");
const Student = require("../models/Student");

class PaymentController {
  async create(req, res) {
    try {
      const {
        studentId,
        referenceYear,
        referenceMonth,
        paymentDate,
        amount,
      } = req.body;

      const student = await Student.findByPk(studentId);

      if (!student) {
        return res.status(404).json({
          message: "Aluno não encontrado",
        });
      }

      if (student.studentType === "SOCIAL") {
        return res.status(400).json({
          message: "Aluno social não possui mensalidade",
        });
      }

      const existingPayment = await Payment.findOne({
        where: {
          studentId,
          referenceYear,
          referenceMonth,
        },
      });

      if (existingPayment) {
        return res.status(400).json({
          message: "Pagamento já registrado para este mês",
        });
      }

      const payment = await Payment.create({
        studentId,
        referenceYear,
        referenceMonth,
        paymentDate,
        amount,
        dueDay: student.dueDay,
      });

      return res.status(201).json(payment);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async findAll(req, res) {
    try {
      const payments = await Payment.findAll({
        include: [
          {
            model: Student,
            as: "student",
          },
        ],
        order: [["paymentDate", "DESC"]],
      });

      return res.json(payments);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async findByStudent(req, res) {
    try {
      const { id } = req.params;

      const payments = await Payment.findAll({
        where: {
          studentId: id,
        },
        order: [
          ["referenceYear", "DESC"],
          ["referenceMonth", "DESC"],
        ],
      });

      return res.json(payments);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async findByMonth(req, res) {
    try {
      const { month, year } = req.query;

      const payments = await Payment.findAll({
        where: {
          referenceMonth: Number(month),
          referenceYear: Number(year),
        },
        include: [
          {
            model: Student,
            as: "student",
          },
        ],
      });

      return res.json(payments);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const payment = await Payment.findByPk(id);

      if (!payment) {
        return res.status(404).json({
          message: "Pagamento não encontrado",
        });
      }

      await payment.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new PaymentController();