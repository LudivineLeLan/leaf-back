import Joi from "joi";

Joi.object({
	username: Joi.string()
		.min(2)
		.max(30)
		.pattern(/^[\p{L}\p{N}_-]+$/u)
		.trim()
		.required(),

	email: Joi.string().email().lowercase().trim().required(),

	password: Joi.string()
		.min(8)
		.max(30)
		.pattern(/(?=.*\p{L})(?=.*\p{N})/u)
		.required(),

	avatar: Joi.string()
		.uri()
		.pattern(/\.(png|jpg|jpeg|webp)$/i)
		.allow("")
		.optional(),
})
	.unknown(false)
	.strict();
