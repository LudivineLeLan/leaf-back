import argon2 from "argon2";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { loginSchema } from "../schemas/login.schema.js";
import { registerSchema } from "../schemas/register.schema.js";

export const authController = {
	async register(req, res) {
		try {
			const { username, email, password, avatar } = Joi.attempt(
				req.body,
				registerSchema,
			);

			const existingUser = await User.findOne({ where: { email } });
			if (existingUser) {
				return res.status(409).json({ error: "Utilisateur déjà existant" });
			}

			const hashedPassword = await argon2.hash(password);

			await User.create({
				username,
				email,
				password: hashedPassword,
				avatar: avatar || null,
			});

			return res.status(201).json({
				message: "Compte créé avec succès",
			});
		} catch (error) {
			if (error.isJoi) {
				return res.status(400).json({ error: error.details[0].message });
			}
			console.error("Error register:", error);
			return res.status(500).json({ error: "Erreur serveur" });
		}
	},

	async login(req, res) {
		try {
			// Validation
			const { email, password } = Joi.attempt(req.body, loginSchema);

			// Get user
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return res.status(401).json({ error: "Identifiants invalides" });
			}

			// Password check
			const isValid = await argon2.verify(user.password, password);
			if (!isValid) {
				return res.status(401).json({ error: "Identifiants invalides" });
			}

			// Token creation
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
				expiresIn: "7d",
			});

			res.cookie("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			return res.status(200).json({
				message: "Connecté",
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					avatar: user.avatar,
				},
			});
		} catch (error) {
			console.error("Error login:", error);
			if (error.isJoi) {
				return res.status(400).json({ error: error.details[0].message });
			}
			return res.status(500).json({ error: "Erreur serveur" });
		}
	},

	async getMe(req, res) {
		try {
			const user = await User.findByPk(req.user.id, {
				attributes: ["id", "username", "email", "avatar"],
			});

			if (!user) {
				return res.status(404).json({ error: "Utilisateur introuvable" });
			}

			return res.status(200).json(user);
		} catch (error) {
			console.error("Error getMe:", error);
			return res.status(500).json({ error: "Erreur serveur" });
		}
	},

	logout(req, res) {
		res.clearCookie("token");
		return res.json({ message: "Déconnecté" });
	},
};
