const { Router } = require("express");

const StudentController = require("../controllers/StudentController");
const PaymentController = require("../controllers/PaymentController");

const routes = Router();

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
*/

routes.post("/students", StudentController.create);
routes.get("/students", StudentController.findAll);
routes.get("/students/:id", StudentController.findById);
routes.put("/students/:id", StudentController.update);
routes.patch("/students/:id/deactivate", StudentController.deactivate);
routes.delete("/students/:id", StudentController.delete);
routes.get("/cards", StudentController.getCards);

/*
|--------------------------------------------------------------------------
| Payments
|--------------------------------------------------------------------------
*/

routes.post("/payments", PaymentController.create);
routes.get("/payments", PaymentController.findByMonth);
routes.get("/students/:id/payments", PaymentController.findByStudent);
routes.delete("/payments/:id", PaymentController.delete);

module.exports = routes;