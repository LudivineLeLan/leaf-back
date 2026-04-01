import Joi from "joi";

export const registerSchema = Joi.object({
	username: Joi.string().min(2).max(30).trim().required().messages({
		"string.empty": "Le nom d'utilisateur est obligatoire",
		"string.min": "Le nom d'utilisateur doit contenir au moins 2 caractères",
		"string.max": "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
	}),

	email: Joi.string().email().lowercase().trim().required().messages({
		"string.email": "Email invalide",
		"string.empty": "L'email est obligatoire",
	}),

	password: Joi.string()
		.pattern(
			/^(?=.*\p{L})(?=.*\p{N})[\p{L}\p{N}!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]{8,30}$/u,
		)
		.required()
		.messages({
			"string.pattern.base":
				"Le mot de passe doit contenir 8 à 30 caractères, avec au moins une lettre et un chiffre",
			"string.empty": "Le mot de passe est obligatoire",
		}),

	avatar: Joi.alternatives()
		.try(Joi.string().uri(), Joi.string().pattern(/\.(png|jpg|jpeg|webp)$/i))
		.allow("")
		.optional()
		.messages({
			"string.uri": "L'avatar doit être une URL valide",
			"string.pattern.base":
				"Le fichier avatar doit être au format png, jpg, jpeg ou webp",
		}),
}).strict();
