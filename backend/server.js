require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");
const database = require("./src/database");

const app = express();

database.authenticate()
  .then(() => {
    console.log("Banco conectado");
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco:", error);
  });

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor rodando na porta ${process.env.PORT}`
  );
});