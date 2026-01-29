import "dotenv/config";
import { Sequelize } from "sequelize";

if (!process.env.DB_URL) {
  throw new Error("La variable d'environnement DB_URL n'est pas définie !");
}

export const sequelize = new Sequelize(process.env.DB_URL, {
  logging: false,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true,
  },
  dialectOptions: process.env.DB_URL.startsWith("postgresql://") || process.env.DB_URL.startsWith("postgres://")
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    }
    : {},
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la DB réussie");

    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Erreur DB :", error);
  }
})();