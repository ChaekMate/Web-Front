var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log('📚 ChaekMate Bestseller 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
let currentPage = 1;
const ITEMS_PER_PAGE = 20;
// API 호출: 베스트셀러 조회
function loadBestsellers() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`베스트셀러 로드: 페이지 ${currentPage}`);
        showLoading();
        try {
            const response = yield fetch(`${API_BASE_URL}/books/popular?limit=${ITEMS_PER_PAGE}`);
            const data = yield response.json();
            hideLoading();
            if (data.success && data.data.length > 0) {
                renderBooks(data.data);
            }
            else {
                showEmptyState();
            }
        }
        catch (error) {
            console.error('베스트셀러 로드 에러:', error);
            hideLoading();
            showEmptyState();
        }
    });
}
// 도서 렌더링
function renderBooks(books) {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid)
        return;
    const html = books.map((book, index) => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-badge rank-badge">${index + 1}</div>
            <div class="book-cover">
                <img src="${book.cover_image}" alt="${book.title}">
            </div>
            <div class="book-info">
                <p class="book-category">${book.category || '도서'}</p>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-publisher">${book.publisher}</p>
                <div class="book-rating">
                    <span class="stars">${getStarRating(book.rating)}</span>
                    <span class="rating-score">${book.rating.toFixed(1)}</span>
                </div>
                <p class="book-price">
                    <span class="price">${book.price.toLocaleString()}원</span>
                </p>
            </div>
        </div>
    `).join('');
    booksGrid.innerHTML = html;
    // 책 클릭 이벤트 다시 등록
    initBookClick();
    console.log('✅ 베스트셀러 렌더링 완료:', books.length);
}
// 별점 생성
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}
// 로딩 표시
function showLoading() {
    const booksGrid = document.getElementById('booksGrid');
    if (booksGrid) {
        booksGrid.innerHTML = '<p style="text-align: center; padding: 100px 0; font-size: 18px; color: #666;">로딩 중...</p>';
    }
}
// 로딩 숨기기
function hideLoading() {
    // renderBooks에서 처리됨
}
// 빈 상태 표시
function showEmptyState() {
    const booksGrid = document.getElementById('booksGrid');
    if (booksGrid) {
        booksGrid.innerHTML = '<p style="text-align: center; padding: 100px 0; font-size: 18px; color: #666;">베스트셀러가 없습니다.</p>';
    }
}
// 검색 기능
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput');
    const handleSearch = () => {
        const keyword = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', handleSearch);
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            handleSearch();
    });
    console.log('✅ 검색 기능 초기화 완료');
}
// 필터 기능 (현재는 동작 안 함 - 백엔드 API 필요)
function initFilters() {
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log('필터 기능은 준비 중입니다.');
        });
    });
    console.log('✅ 필터 기능 초기화 완료');
}
// 책 클릭 이벤트
function initBookClick() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id');
            if (bookId) {
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });
    console.log('✅ 책 클릭 이벤트 초기화 완료');
}
// 메인 초기화
function initBestseller() {
    console.log('🎬 ChaekMate Bestseller 초기화 시작...');
    initSearch();
    initFilters();
    loadBestsellers();
    console.log('✨ ChaekMate Bestseller 초기화 완료!');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBestseller);
}
else {
    initBestseller();
}