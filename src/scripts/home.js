console.log('HOME JS START');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const fetchBooks = async (endpoint) => {
  try {
    const response = await fetch(API_BASE_URL + endpoint);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// 기존 HTML 구조 그대로 사용
const renderBooks = (books, containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.log('Container not found:', containerSelector);
    return;
  }

  const html = books.map((book, index) => `
    <div class="book-item">
      <div class="book-rank">${index + 1}</div>
      <div class="book-cover">
        <img src="${book.cover_image}" alt="${book.title}">
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <p class="book-price">
          <span class="price">${book.price.toLocaleString()}원</span>
        </p>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
  console.log('Rendered', books.length, 'books');
};

const loadAllBooks = async () => {
  console.log('Loading books...');

  const popular = await fetchBooks('/books/popular?limit=10');
  console.log('Popular books:', popular.length);

  // 베스트셀러 섹션만 업데이트
  renderBooks(popular, '.bestseller-section .book-list');
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM READY');
  loadAllBooks();
});

console.log('HOME JS END');