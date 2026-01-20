export { };
console.log('📚 ChaekMate New Books 로드 완료!');

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
    published_date?: string;
    page_count?: number;
}

interface NewBooksResponse {
    success: boolean;
    data: Book[];
    total: number;
}

let currentPage = 1;
const ITEMS_PER_PAGE = 20;

// API 호출: 신간 도서 조회
async function loadNewBooks(): Promise<void> {
    console.log(`신간 도서 로드: 페이지 ${currentPage}`);

    showLoading();

    try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const response = await fetch(`${API_BASE_URL}/books/new?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
        const data: NewBooksResponse = await response.json();

        hideLoading();

        if (data.success && data.data.length > 0) {
            renderBooks(data.data);
            renderPagination(data.total);
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('신간 도서 로드 에러:', error);
        hideLoading();
        showEmptyState();
    }
}

// 도서 렌더링
function renderBooks(books: Book[]): void {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;

    const html = books.map(book => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-badge new">NEW</div>
            <div class="book-cover">
                <img src="${book.cover_image}" 
                     alt="${book.title}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'280\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'200\\' height=\\'280\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-size=\\'16\\'%3E이미지 없음%3C/text%3E%3C/svg%3E'">
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

    console.log('✅ 신간 도서 렌더링 완료:', books.length);
}

// 별점 생성
function getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

// 페이지네이션 렌더링
function renderPagination(total: number): void {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    let html = `<button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''}>이전</button>`;

    // 페이지 번호 (최대 5개)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''}>다음</button>`;

    pagination.innerHTML = html;

    // 페이지네이션 이벤트 다시 등록
    initPagination();

    console.log('✅ 페이지네이션 렌더링 완료');
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
        booksGrid.innerHTML = '<p style="text-align: center; padding: 100px 0; font-size: 18px; color: #666;">신간 도서가 없습니다.</p>';
    }
}

// 검색 기능
function initSearch(): void {
    const searchBtn = document.getElementById('searchBtn');
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
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
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

// 페이지네이션
function initPagination(): void {
    const pageBtns = document.querySelectorAll('.page-btn');

    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('prev')) {
                if (currentPage > 1) {
                    currentPage--;
                    loadNewBooks();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else if (btn.classList.contains('next')) {
                currentPage++;
                loadNewBooks();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const pageNum = btn.getAttribute('data-page');
                if (pageNum) {
                    currentPage = parseInt(pageNum);
                    loadNewBooks();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });

    console.log('✅ 페이지네이션 초기화 완료');
}

// 메인 초기화
function initNewBooks(): void {
    console.log('🎬 ChaekMate New Books 초기화 시작...');

    initSearch();
    initFilters();
    loadNewBooks();

    console.log('✨ ChaekMate New Books 초기화 완료!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewBooks);
} else {
    initNewBooks();
}