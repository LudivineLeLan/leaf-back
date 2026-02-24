import Joi from "joi";

export const loginSchema = Joi.object({
	email: Joi.string().email().lowercase().trim().required().messages({
		"string.email": "Email invalide",
		"string.empty": "L'email est obligatoire",
	}),

	password: Joi.string().required().messages({
		"string.empty": "Le mot de passe est obligatoire",
	}),
}).strict();
