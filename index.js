import "dotenv/config";
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
// import { apiRouter } from "./routers/index.js";


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(xss());

// app.get('/health', (req, res) => {
//   res.status(200).send('OK');
// });

// app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Leaf is live on http://localhost:${PORT}`);
});