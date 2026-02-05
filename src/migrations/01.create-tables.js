import { sequelize } from "../models/index.js";

console.log("Creation des tables");
await sequelize.sync({ alter: true });
console.log("Tables créées avec succès");

await sequelize.close();

console.log("Connexion à la base de données fermée");