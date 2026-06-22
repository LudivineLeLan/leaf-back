import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
	const token = req.cookies?.token; //optional cookie

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

// for authorized access without logged user
export function optionalAuthenticate(req, res, next) {
	const token = req.cookies?.token;

	if (!token) return next(); // no token, continue without user

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.userId };
	} catch {
		// invalid token, continue without user
	}
	next();
}
