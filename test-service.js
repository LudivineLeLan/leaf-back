import GoogleBooksService from "./src/services/GoogleBooksService.js";

async function testService() {
	try {
		console.log('Test 1: Recherche "One Piece"\n');

		const results = await GoogleBooksService.search("one piece oda", 5);

		console.log(` ${results.length} résultats trouvés:\n`);

		results.forEach((book, i) => {
			console.log(`${i + 1}. ${book.title}`);
			console.log(`   Auteurs: ${book.authors.join(", ")}`);
			console.log(`   Date: ${book.publishedDate}`);
			console.log(`   ID: ${book.googleBooksId}`);
			console.log("");
		});

		// Test 2: Get book by id
		if (results.length > 0) {
			console.log("---\n");
			console.log("Test 2: Récupération par ID\n");

			const bookId = results[0].googleBooksId;
			const book = await GoogleBooksService.getById(bookId);

			console.log(` ${book.title}`);
			console.log(`   Auteurs: ${book.authors.join(", ")}`);
			console.log(`   Pages: ${book.pageCount || "N/A"}`);
			console.log(`   Description: ${book.description?.substring(0, 100)}...`);
		}
	} catch (error) {
		console.error(" Erreur:", error.message);
	}
}

testService();
