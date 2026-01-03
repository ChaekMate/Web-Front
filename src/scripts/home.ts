console.log('HOME TS START');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  price: number;
  rating: number;
  theme?: string;
}

interface ApiResponse {
  success: boolean;
  data: Book[];
}

const fetchBooks = async (endpoint: string): Promise<Book[]> => {
  try {
    const response = await fetch(API_BASE_URL + endpoint);
    const data: ApiResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// 기존 HTML 구조 그대로 사용
const renderBooks = (books: Book[], containerSelector: string): void => {
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
  console.log('Rendered', books.length, 'books in', containerSelector);
};

const loadAllBooks = async (): Promise<void> => {
  console.log('Loading all books...');

  const popular = await fetchBooks('/books/popular?limit=10');

  console.log('Popular:', popular.length);

  // 베스트셀러 섹션만 업데이트
  renderBooks(popular, '.bestseller-section .book-list');
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM READY');
  loadAllBooks();
});

console.log('HOME TS END');