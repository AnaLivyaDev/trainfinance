const Student = require("../models/Student");
const Payment = require("../models/Payment");

function generateHistory(student, payments) {
  const history = [];

  const start = new Date(student.createdAt);

  const today = new Date();

  let year = start.getFullYear();
  let month = start.getMonth() + 1;

  if (
    student.dueDay &&
    start.getDate() > student.dueDay
  ) {
    month++;

    if (month > 12) {
      month = 1;
      year++;
    }
  }

  while (
    year < today.getFullYear() ||
    (
      year === today.getFullYear() &&
      month <= today.getMonth() + 1
    )
  ) {
    const payment = payments.find(
      (p) =>
        p.referenceYear === year &&
        p.referenceMonth === month
    );

    history.push({
      year,
      month,
      paid: !!payment,
      payment: payment ?? null,
    });

    month++;

    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return history;
}

class StudentController {
  async create(req, res) {
    try {
      const {
        name,
        phone,
        studentType,
        monthlyFee,
        dueDay,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Nome é obrigatório",
        });
      }

      if (!studentType) {
        return res.status(400).json({
          message: "Tipo do aluno é obrigatório",
        });
      }

      if (studentType === "STANDARD") {
        if (dueDay < 1 || dueDay > 31) {
          return res.status(400).json({
            message: "Dia de vencimento deve ser entre 1 e 31",
          });
        }
      }

      const student = await Student.create({
        name,
        phone,
        studentType,
        monthlyFee:
          studentType === "SOCIAL"
            ? 0
            : monthlyFee,
        dueDay,
      });

      return res.status(201).json(student);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async findAll(req, res) {
    try {
      const currentDate = new Date();

      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const students = await Student.findAll({
        include: [
          {
            model: Payment,
            as: "payments",
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const formattedStudents = students.map((student) => {
        const payments = student.payments || [];

        const currentPayment = payments.find(
          (payment) =>
            payment.referenceMonth === currentMonth &&
            payment.referenceYear === currentYear
        );

        const paidCurrentMonth = !!currentPayment;

        // Mapa para encontrar rapidamente um pagamento pelo mês/ano
        const paymentsMap = new Map();

        payments.forEach((payment) => {
          paymentsMap.set(
            `${payment.referenceYear}-${payment.referenceMonth}`,
            payment
          );
        });

        const createdAt = new Date(student.createdAt);

        let year = createdAt.getFullYear();
        let month = createdAt.getMonth() + 1;

        const admissionDay = createdAt.getDate();

        // Caso tenha entrado após o vencimento, a primeira cobrança é no mês seguinte
        if (student.dueDay && admissionDay > student.dueDay) {
          month++;

          if (month > 12) {
            month = 1;
            year++;
          }
        }

        const history = [];

        while (
          year < currentYear ||
          (year === currentYear && month <= currentMonth)
        ) {
          const key = `${year}-${month}`;

          const payment = paymentsMap.get(key);

          history.push({
            year,
            month,
            paid: !!payment,
            paymentId: payment?.id ?? null,
            payment: payment ?? null,
          });

          month++;

          if (month > 12) {
            month = 1;
            year++;
          }
        }

        const overdueCount = history.filter(
          (item) =>
            !item.paid &&
            (item.year < currentYear ||
              (item.year === currentYear &&
                item.month < currentMonth))
        ).length;

        return {
          ...student.toJSON(),
          paidCurrentMonth,
          currentPaymentId: currentPayment?.id ?? null,
          hasOverduePayments: overdueCount > 0,
          overdueCount,
          history,
        };
      });

      return res.json(formattedStudents);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({
          message: "Aluno não encontrado",
        });
      }

      return res.json(student);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({
          message: "Aluno não encontrado",
        });
      }

      const {
        name,
        phone,
        studentType,
        monthlyFee,
        dueDay,
      } = req.body;

      if (studentType === "STANDARD") {
        if (
          dueDay !== undefined &&
          (dueDay < 1 || dueDay > 31)
        ) {
          return res.status(400).json({
            message: "Dia de vencimento deve ser entre 1 e 31",
          });
        }
      }

      await student.update({
        name,
        phone,
        studentType,
        monthlyFee:
          studentType === "SOCIAL"
            ? 0
            : monthlyFee,
        dueDay,
      });

      return res.json(student);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async deactivate(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({
          message: "Aluno não encontrado",
        });
      }

      await student.update({
        active: false,
      });

      return res.json({
        message: "Aluno desativado com sucesso",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async activate(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({
          message: "Aluno não encontrado",
        });
      }

      await student.update({
        active: true,
      });

      return res.json({
        message: "Aluno ativado com sucesso",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({
          message: "Aluno não encontrado",
        });
      }

      await student.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getCards(req, res) {
    try {
      const currentDate = new Date();

      const currentMonth =
        currentDate.getMonth() + 1;

      const currentYear =
        currentDate.getFullYear();

      const totalStudents =
        await Student.count();

      const monthlyRevenue =
        await Payment.sum("amount", {
          where: {
            referenceMonth: currentMonth,
            referenceYear: currentYear,
          },
        });

      const students = await Student.findAll({
        where: {
          studentType: "STANDARD",
        },
        include: [
          {
            model: Payment,
            as: "payments",
            required: false,
            where: {
              referenceMonth: currentMonth,
              referenceYear: currentYear,
            },
          },
        ],
      });

      const pendingPayments = students.filter(
        (student) =>
          student.payments.length === 0
      ).length;

      return res.json({
        totalStudents,
        monthlyRevenue:
          Number(monthlyRevenue || 0),
        pendingPayments,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new StudentController();