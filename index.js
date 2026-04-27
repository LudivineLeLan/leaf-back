import "dotenv/config";
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import { apiRouter } from "./src/routers/index.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);

app.use(cookieParser());

app.use(xss());

app.get("/", (req, res) => {
	res.status(200).json({
		status: "OK",
		message: "Leaf is live! 📚",
	});
});

// app.get('/health', (req, res) => {
//   res.status(200).send('OK');
// });

app.use(apiRouter);

app.listen(PORT, () => {
	console.log(`Leaf is live on http://localhost:${PORT}`);
});
