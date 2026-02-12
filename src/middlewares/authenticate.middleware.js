import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			error:
				"Accès refusé : vous devez être authentifié pour accéder à cette ressource",
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded;
		next();
	} catch (error) {
		console.error("JWT error:", error.message);
		return res.status(401).json({
			error: "Token invalide ou expiré",
		});
	}
}
