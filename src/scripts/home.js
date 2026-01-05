var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

console.log('HOME TS START');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const fetchBooks = (endpoint) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch(API_BASE_URL + endpoint);
        const data = yield response.json();
        return data.data || [];
    }
    catch (error) {
        console.error('Error:', error);
        return [];
    }
});

const renderBooks = (books, containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.log('Container not found:', containerSelector);
        return;
    }
    const html = books.map((book, index) => `
    <div class="book-item" data-book-id="${book.id}" style="cursor: pointer;">
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
    
    // 책 클릭 이벤트 추가
    const bookItems = container.querySelectorAll('.book-item');
    bookItems.forEach(item => {
        item.addEventListener('click', () => {
            const bookId = item.getAttribute('data-book-id');
            if (bookId) {
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });
    
    console.log('Rendered', books.length, 'books in', containerSelector);
};

const loadAllBooks = () => __awaiter(this, void 0, void 0, function* () {
    console.log('Loading all books...');
    const popular = yield fetchBooks('/books/popular?limit=10');
    console.log('Popular:', popular.length);
    renderBooks(popular, '.bestseller-section .book-list');
});

// 검색 기능
const initHomeSearch = () => {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    const handleSearch = () => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };

    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    console.log('✅ 검색 기능 초기화 완료');
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM READY');
    loadAllBooks();
    initHomeSearch();
});

console.log('HOME TS END');