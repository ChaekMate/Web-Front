var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log('📚 ChaekMate New Books 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
// 현재 필터 상태
let currentFilters = {
    period: null, // ✨ null로 시작 (전체 도서)
    category: 'all',
    sort: 'recent',
    page: 1
};
const ITEMS_PER_PAGE = 9;
// API 호출: 신간 도서 조회
function loadNewBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log(`신간 도서 로드: 페이지 ${currentFilters.page}`);
        showLoading();
        try {
            const params = new URLSearchParams({
                sort: currentFilters.sort,
                page: currentFilters.page.toString(),
                limit: ITEMS_PER_PAGE.toString()
            });
            // ✨ period가 있을 때만 추가
            if (currentFilters.period) {
                params.append('period', currentFilters.period);
            }
            // category가 'all'이 아닐 때만 추가
            if (currentFilters.category !== 'all') {
                params.append('category', currentFilters.category);
            }
            console.log('현재 필터:', currentFilters);
            console.log('API 호출:', `${API_BASE_URL}/books/new-books?${params}`);
            const response = yield fetch(`${API_BASE_URL}/books/new-books?${params}`);
            const data = yield response.json();
            console.log('API 응답:', data);
            console.log('받은 도서 개수:', (_a = data.data) === null || _a === void 0 ? void 0 : _a.length);
            hideLoading();
            if (data.success && data.data.length > 0) {
                renderBooks(data.data);
                if (data.pagination) {
                    renderPagination(data.pagination.total, data.pagination.total_pages);
                }
            }
            else {
                showEmptyState();
            }
        }
        catch (error) {
            console.error('신간 도서 로드 에러:', error);
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
    const html = books.map(book => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-badge new">NEW</div>
            <div class="book-cover">
                <img src="${book.cover_image}" 
                     alt="${book.title}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'280\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'200\\' height=\\'280\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-size=\\'16\\'%3E이미지 없음%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="book-info">
                <p class="book-category">${getThemeLabel(book.theme || book.category || '도서')}</p>
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
// 테마 한글 라벨
function getThemeLabel(theme) {
    const labels = {
        'work': '업무/성장',
        'healing': '힐링/위로',
        'growth': '자기계발',
        'goals': '목표달성',
        'novel': '소설',
        'essay': '에세이',
        'self-improvement': '자기계발',
        'economics': '경제경영',
        'humanities': '인문',
        'science': '과학',
        'children': '아동',
        'comic': '만화'
    };
    return labels[theme] || theme;
}
// 별점 생성
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}
// 페이지네이션 렌더링
function renderPagination(total, totalPages) {
    const pagination = document.querySelector('.pagination');
    if (!pagination)
        return;
    if (totalPages === 0) {
        pagination.innerHTML = '';
        return;
    }
    let html = `<button class="page-btn prev" ${currentFilters.page === 1 ? 'disabled' : ''}>이전</button>`;
    // 페이지 번호 (현재 페이지 기준 ±2)
    const startPage = Math.max(1, currentFilters.page - 2);
    const endPage = Math.min(totalPages, currentFilters.page + 2);
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentFilters.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn next" ${currentFilters.page === totalPages ? 'disabled' : ''}>다음</button>`;
    pagination.innerHTML = html;
    // 페이지네이션 이벤트 다시 등록
    initPagination(totalPages);
    console.log('✅ 페이지네이션 렌더링 완료');
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
        booksGrid.innerHTML = '<p style="text-align: center; padding: 100px 0; font-size: 18px; color: #666;">해당 조건의 도서가 없습니다.</p>';
    }
}
// 검색 기능
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
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
// ✨ 필터 기능 - 토글 방식
function initFilters() {
    // 기간 필터 - 토글 방식
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const period = btn.getAttribute('data-period');
            // ✨ 이미 active인 버튼을 다시 클릭하면 해제 (전체로 복귀)
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                currentFilters.period = null;
                currentFilters.page = 1;
                loadNewBooks();
                console.log('📅 기간 필터 해제 - 전체 도서 표시');
            }
            else {
                // 다른 버튼 클릭 시
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (period) {
                    currentFilters.period = period;
                    currentFilters.page = 1;
                    loadNewBooks();
                    console.log(`📅 기간 필터 적용: ${period}`);
                }
            }
        });
    });
    // 카테고리 선택
    const categorySelect = document.getElementById('categorySelect');
    categorySelect === null || categorySelect === void 0 ? void 0 : categorySelect.addEventListener('change', () => {
        currentFilters.category = categorySelect.value;
        currentFilters.page = 1;
        loadNewBooks();
        console.log(`🔍 카테고리 필터: ${categorySelect.value}`);
    });
    // 정렬 선택
    const sortSelect = document.getElementById('sortSelect');
    sortSelect === null || sortSelect === void 0 ? void 0 : sortSelect.addEventListener('change', () => {
        currentFilters.sort = sortSelect.value;
        currentFilters.page = 1;
        loadNewBooks();
        console.log(`🔄 정렬 변경: ${sortSelect.value}`);
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
// 페이지네이션
function initPagination(totalPages) {
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.hasAttribute('disabled'))
                return;
            if (btn.classList.contains('prev')) {
                if (currentFilters.page > 1) {
                    currentFilters.page--;
                    loadNewBooks();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            else if (btn.classList.contains('next')) {
                if (currentFilters.page < totalPages) {
                    currentFilters.page++;
                    loadNewBooks();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            else {
                const pageNum = btn.getAttribute('data-page');
                if (pageNum) {
                    currentFilters.page = parseInt(pageNum);
                    loadNewBooks();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
    console.log('✅ 페이지네이션 초기화 완료');
}
// 메인 초기화
function initNewBooks() {
    console.log('🎬 ChaekMate New Books 초기화 시작...');
    initSearch();
    initFilters();
    loadNewBooks(); // ✨ 초기 로드 시 period=null (전체 도서)
    console.log('✨ ChaekMate New Books 초기화 완료!');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewBooks);
}
else {
    initNewBooks();
}
export {};
