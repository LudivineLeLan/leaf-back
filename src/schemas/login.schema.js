import Joi from "joi";

export const loginSchema = Joi.object({
	email: Joi.string().email().lowercase().trim().required().messages({
		"string.email": "Email invalide",
		"string.empty": "L'email est obligatoire",
		"any.required": "L'email est obligatoire",
	}),

	password: Joi.string().required().messages({
		"string.empty": "Le mot de passe est obligatoire",
		"any.required": "Le mot de passe est obligatoire",
	}),
})
	.unknown(false) //only accepts allowed fields with right type
	.strict(); //to convert value
