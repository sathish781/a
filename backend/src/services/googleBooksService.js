const axios = require('axios');

async function searchGoogleBooks(query) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;
    const response = await axios.get(url);

    if (!response.data.items) {
      return [];
    }

    return response.data.items.map((item) => {
      const info = item.volumeInfo || {};
      const imageLinks = info.imageLinks || {};
      const isbnIdentifiers = info.industryIdentifiers || [];
      const isbnObj = isbnIdentifiers.find((i) => i.type === 'ISBN_13' || i.type === 'ISBN_10');

      return {
        title: info.title || 'Untitled',
        author: info.authors ? info.authors.join(', ') : 'Unknown Author',
        publisher: info.publisher || '',
        description: info.description || '',
        categories: info.categories || [],
        category: info.categories ? info.categories[0] : 'General',
        imageUrl: imageLinks.thumbnail || imageLinks.smallThumbnail || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
        isbn: isbnObj ? isbnObj.identifier : '',
        publishedDate: info.publishedDate || '',
        previewLink: info.previewLink || info.infoLink || ''
      };
    });
  } catch (error) {
    console.error('Google Books API fetch error:', error.message);
    return [];
  }
}

async function lookupBookByIsbn(isbn) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`;
    const response = await axios.get(url);

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    const info = response.data.items[0].volumeInfo || {};
    const imageLinks = info.imageLinks || {};

    return {
      title: info.title || 'Untitled',
      author: info.authors ? info.authors.join(', ') : 'Unknown Author',
      publisher: info.publisher || '',
      description: info.description || '',
      categories: info.categories || [],
      category: info.categories ? info.categories[0] : 'General',
      imageUrl: imageLinks.thumbnail || imageLinks.smallThumbnail || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
      isbn: isbn,
      publishedDate: info.publishedDate || '',
      previewLink: info.previewLink || info.infoLink || ''
    };
  } catch (error) {
    console.error('Google Books API ISBN lookup error:', error.message);
    return null;
  }
}

module.exports = {
  searchGoogleBooks,
  lookupBookByIsbn
};
