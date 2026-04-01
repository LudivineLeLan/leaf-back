import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({
			error:
				"Accès refusé : vous devez être authentifié pour accéder à cette ressource",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.userId };
		next();
	} catch (error) {
		console.error("JWT error:", error.message);
		return res.status(401).json({
			error: "Token invalide ou expiré",
		});
	}
}
