import { Book, User } from "../models/index.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const userController = {
	async getUsers(req, res) {
		try {
			const users = await User.findAll({
				include: [{ model: Book, as: "books", through: { attributes: [] } }],
			});
			res.json(users);
		} catch (error) {
			res
				.status(500)
				.json({ error: "Erreur lors de la récupération des users" });
		}
	},

	async getUserById(req, res) {
		try {
			const user = await User.findByPk(req.params.id, {
				include: [{ model: Book, as: "books", through: { attributes: [] } }],
			});
			if (!user) return res.status(404).json({ error: "User non trouvé" });
			res.json(user);
		} catch (error) {
			res.status(500).json({ error: "Erreur serveur" });
		}
	},

	async createUser(req, res) {
		try {
			const data = Joi.attempt(req.body, createUserSchema);
			const user = await User.create(data);
			res.status(201).json(user);
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ error: "Erreur lors de la création de l'utilisateur" });
		}
	},

	async loginUser(req, res) {
		const { username, password } = req.body;
		const user = await User.findOne({ where: { username: username } });
		if (!user || user.password !== password) {
			return res.status(401).json({ error: "Utilisateur non valide" });
		}
	},

	async deleteUser(req, res) {
		try {
			const { id } = req.params;
			const authUserId = req.user.id;

			if (parseInt(id) !== authUserId) {
				return res
					.status(403)
					.json({ error: "Vous ne pouvez pas supprimer ce compte" });
			}

			const deletedCount = await User.destroy({ where: { id } });

			if (deletedCount === 0) {
				return res.status(404).json({ error: "Utilisateur non trouvé" });
			}

			return res.status(200).json({ message: "Compte supprimé avec succès" });
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({
					error: "Une erreur est survenue lors de la suppression du compte",
				});
		}
	},
};
