import { extractSeriesInfo } from "./src/services/series.service.js";

const tests = [
	"Naruto Tome 12",
	"One Piece Vol. 3",
	"Attack on Titan Volume 5",
	"Chainsaw Man 01",
	"Dune",
	"Harry Potter and the Chamber of Secrets",
];

for (const title of tests) {
	const result = extractSeriesInfo(title);
	console.log(title, "=>", result);
}
