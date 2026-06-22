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
