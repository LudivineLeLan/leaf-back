async function testGoogleBooks() {
  try {
    console.log('Test de différentes recherches...\n');
    
    // Test 1: Recherche manga One Piece
    const query1 = 'intitle:one+piece+inauthor:oda';
    console.log(`Recherche: ${query1}`);
    const res1 = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query1}&maxResults=5`
    );
    const data1 = await res1.json();
    
    console.log(`Total: ${data1.totalItems}`);
    if (data1.items) {
      data1.items.slice(0, 3).forEach((book, i) => {
        const info = book.volumeInfo;
        console.log(`\n ${i + 1}. ${info.title}`);
        console.log(`   Auteur(s): ${info.authors?.join(', ') || 'N/A'}`);
        console.log(`   Date: ${info.publishedDate || 'N/A'}`);
        console.log(`   ID: ${book.id}`);
        console.log(`   Thumbnail: ${info.imageLinks?.thumbnail || 'N/A'}`);
      });
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Recherche manga populaire
    const query2 = 'intitle:naruto';
    console.log(`Recherche: ${query2}`);
    const res2 = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query2}&maxResults=3`
    );
    const data2 = await res2.json();
    
    console.log(`Total: ${data2.totalItems}`);
    if (data2.items) {
      data2.items.forEach((book, i) => {
        const info = book.volumeInfo;
        console.log(`\n ${i + 1}. ${info.title}`);
        console.log(`   Auteur(s): ${info.authors?.join(', ') || 'N/A'}`);
      });
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

testGoogleBooks();