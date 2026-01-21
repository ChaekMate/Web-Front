console.log('📚 ChaekMate Bestseller 로드 완료!');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    price: number;
    cover_image: string;
    rating: number;
    category: string;
}

interface BestsellerResponse {
    success: boolean;
    data: Book[];
    total: number;
}

let currentPage = 1;
const ITEMS_PER_PAGE = 20;

// API 호출: 베스트셀러 조회
async function loadBestsellers(): Promise<void> {
    console.log(`베스트셀러 로드: 페이지 ${currentPage}`);
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/popular?limit=${ITEMS_PER_PAGE}`);
        const data: BestsellerResponse = await response.json();
        
        hideLoading();
        
        if (data.success && data.data.length > 0) {
            renderBooks(data.data);
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('베스트셀러 로드 에러:', error);
        hideLoading();
        showEmptyState();
    }
}

// 도서 렌더링
function renderBooks(books: Book[]): void {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;
    
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
function getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

// 로딩 표시
function showLoading(): void {
    const booksGrid = document.getElementById('booksGrid');
    if (booksGrid) {
        booksGrid.innerHTML = '<p style="text-align: center; padding: 100px 0; font-size: 18px; color: #666;">로딩 중...</p>';
    }
}

// 로딩 숨기기
function hideLoading(): void {
    // renderBooks에서 처리됨
}

// 빈 상태 표시
function showEmptyState(): void {
    const booksGrid = document.getElementById('booksGrid');
    if (booksGrid) {
        booksGrid.innerHTML = '<p style="text-align: center; padding: 100px 0; font-size: 18px; color: #666;">베스트셀러가 없습니다.</p>';
    }
}

// 검색 기능
function initSearch(): void {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    const handleSearch = (): void => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };

    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    });

    console.log('✅ 검색 기능 초기화 완료');
}

// 필터 기능 (현재는 동작 안 함 - 백엔드 API 필요)
function initFilters(): void {
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
function initBookClick(): void {
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
function initBestseller(): void {
    console.log('🎬 ChaekMate Bestseller 초기화 시작...');
    
    initSearch();
    initFilters();
    loadBestsellers();
    
    console.log('✨ ChaekMate Bestseller 초기화 완료!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBestseller);
} else {
    initBestseller();
}