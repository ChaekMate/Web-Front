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

// 베스트셀러용 렌더링
const renderBestsellers = (books: Book[], containerSelector: string): void => {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.log('Container not found:', containerSelector);
    return;
  }

  const html = books.map((book, index) => `
    <div class="book-item" onclick="location.href='/book-detail.html?id=${book.id}'" style="cursor: pointer;">
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
  console.log('Rendered', books.length, 'bestsellers');
};

// 큐레이터 추천용 렌더링
const renderCuratorPicks = (books: Book[], containerSelector: string): void => {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.log('Container not found:', containerSelector);
    return;
  }

  const html = books.map(book => `
    <div class="recommend-card" data-book-id="${book.id}" onclick="location.href='/book-detail.html?id=${book.id}'" style="cursor: pointer;">
      <div class="book-cover">
        <img src="${book.cover_image}" alt="${book.title}">
      </div>
      <div class="recommend-info">
        <h3>${book.title}</h3>
        <p class="recommend-author">${book.author}</p>
        <p class="recommend-price">${book.price.toLocaleString()}원</p>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
  console.log('Rendered', books.length, 'curator picks');
};

const loadAllBooks = async (): Promise<void> => {
  console.log('Loading all books...');

  // 베스트셀러 5권, 큐레이터 추천 5권
  const popular = await fetchBooks('/books/popular?limit=5');
  const curatorPicks = await fetchBooks('/books/curator-picks?limit=5');

  console.log('Popular:', popular.length);
  console.log('Curator Picks:', curatorPicks.length);

  // 베스트셀러 섹션 업데이트
  renderBestsellers(popular, '.bestseller-section .book-list');

  // 큐레이터 추천 섹션 업데이트
  renderCuratorPicks(curatorPicks, '.curator-section .recommend-grid');
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM READY');
  loadAllBooks();
});

console.log('HOME TS END');