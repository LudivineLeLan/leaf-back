import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1]; // "Bearer <token>"

	if (!token) {
		return res.status(401).json({ error: "Accès refusé" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.userId };
		next();
	} catch (error) {
		return res.status(401).json({ error: "Token invalide ou expiré" });
	}
}

export function optionalAuthenticate(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) return next(); // no token, continue without user

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.userId };
	} catch {
		// invalid token, continue without user
	}
	next();
}
