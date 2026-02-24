import Joi from "joi";

export const registerSchema = Joi.object({
	name: Joi.string().min(2).max(30).trim().required().messages({
		"string.empty": "Le nom est obligatoire",
		"string.min": "Le nom doit contenir au moins 2 caractères",
		"string.max": "Le nom ne peut pas dépasser 30 caractères",
	}),

	firstname: Joi.string().min(2).max(30).trim().required().messages({
		"string.empty": "Le prénom est obligatoire",
		"string.min": "Le prénom doit contenir au moins 2 caractères",
		"string.max": "Le prénom ne peut pas dépasser 30 caractères",
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

	birthdate: Joi.date()
		.iso()
		.less("now")
		.greater("1900-01-01")
		.optional()
		.messages({
			"date.base": "La date de naissance doit être valide",
			"date.less": "La date de naissance doit être dans le passé",
			"date.greater": "La date de naissance semble invalide",
		}),
}).strict();
