var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log('🎨 ChaekMate Theme Recommend 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
// 테마 데이터
const themes = {
    work: {
        icon: '💼',
        title: '일과 성장',
        description: '업무 효율을 높이고 커리어 성장을 돕는 실용적인 책들을 모았습니다. 시간 관리, 생산성, 리더십, 업무 스킬 향상에 도움이 되는 베스트셀러들입니다.'
    },
    healing: {
        icon: '🌿',
        title: '힐링과 위로',
        description: '지친 마음을 위로하고 회복할 수 있는 책들입니다. 에세이, 시집, 심리학 서적 등 내면의 평화를 찾을 수 있는 도서들을 모았습니다.'
    },
    growth: {
        icon: '📈',
        title: '자기계발',
        description: '개인의 성장과 발전을 위한 필독서들입니다. 사고방식의 전환, 실용적인 스킬 습득, 인생의 지혜를 얻을 수 있는 책들을 엄선했습니다.'
    },
    goals: {
        icon: '🎯',
        title: '목표 달성',
        description: '습관 형성, 동기부여, 목표 설정에 관한 실용적인 가이드입니다. 새로운 시작을 준비하고 계획을 실행하는 데 도움이 되는 책들입니다.'
    }
};
let currentTheme = 'work';
// ==================== 검색 기능 ====================
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
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    console.log('✅ 검색 기능 초기화 완료');
}
// ==================== URL 파라미터로 테마 로드 ====================
function getThemeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme') || 'work';
    // 허용된 테마만 반환
    if (['work', 'healing', 'growth', 'goals'].includes(theme)) {
        return theme;
    }
    return 'work';
}
// ==================== 테마 정보 업데이트 ====================
function updateThemeInfo(theme) {
    const themeData = themes[theme] || themes.work;
    const themeIcon = document.getElementById('themeIcon');
    const themeTitle = document.getElementById('themeTitle');
    const themeDescription = document.getElementById('themeDescription');
    const breadcrumbTheme = document.getElementById('breadcrumbTheme');
    if (themeIcon)
        themeIcon.textContent = themeData.icon;
    if (themeTitle)
        themeTitle.textContent = themeData.title;
    if (themeDescription)
        themeDescription.textContent = themeData.description;
    if (breadcrumbTheme)
        breadcrumbTheme.textContent = themeData.title;
    // 네비게이션 활성화
    const navItems = document.querySelectorAll('.theme-nav-item');
    navItems.forEach(item => {
        const itemTheme = item.getAttribute('data-theme');
        if (itemTheme === theme) {
            item.classList.add('active');
        }
        else {
            item.classList.remove('active');
        }
    });
    console.log('✅ 테마 정보 업데이트:', theme);
}
// ==================== 테마별 도서 API 호출 ====================
function loadThemeBooks(theme) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('테마별 도서 로딩:', theme);
        try {
            const response = yield fetch(`${API_BASE_URL}/books/theme/${theme}?limit=20`);
            const data = yield response.json();
            if (data.success && data.data) {
                renderBooks(data.data);
                updateBookCount(data.data.length);
            }
            else {
                showEmptyState();
            }
        }
        catch (error) {
            console.error('테마별 도서 로드 에러:', error);
            showEmptyState();
        }
    });
}
// ==================== 도서 렌더링 ====================
function renderBooks(books) {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid)
        return;
    if (books.length === 0) {
        showEmptyState();
        return;
    }
    const html = books.map(book => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover_image}" alt="${book.title}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'280\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'200\\' height=\\'280\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\'%3E책 표지%3C/text%3E%3C/svg%3E'">
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
    booksGrid.innerHTML = html;
    initBookClick();
    console.log('✅ 도서 렌더링 완료:', books.length);
}
// ==================== 빈 상태 표시 ====================
function showEmptyState() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid)
        return;
    booksGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 100px 20px;">
            <p style="font-size: 18px; color: #666;">해당 테마의 도서가 없습니다.</p>
        </div>
    `;
    updateBookCount(0);
}
// ==================== 도서 수 업데이트 ====================
function updateBookCount(count) {
    const bookCountElement = document.getElementById('bookCount');
    if (bookCountElement) {
        bookCountElement.textContent = count.toString();
    }
}
// ==================== 책 클릭 이벤트 ====================
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
// ==================== 테마 네비게이션 ====================
function initThemeNav() {
    const navItems = document.querySelectorAll('.theme-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const theme = item.getAttribute('data-theme');
            if (theme && ['work', 'healing', 'growth', 'goals'].includes(theme)) {
                window.location.href = `?theme=${theme}`;
            }
        });
    });
    console.log('✅ 테마 네비게이션 초기화 완료');
}
// ==================== 정렬 기능 (미구현) ====================
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect === null || sortSelect === void 0 ? void 0 : sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        console.log('정렬:', sortValue);
        // TODO: 정렬 기능 구현 (추후)
    });
    console.log('✅ 정렬 기능 초기화 완료');
}
// ==================== 메인 초기화 ====================
function initThemeRecommend() {
    console.log('🎬 ChaekMate Theme Recommend 초기화 시작...');
    currentTheme = getThemeFromUrl();
    initSearch();
    updateThemeInfo(currentTheme);
    initThemeNav();
    initSort();
    loadThemeBooks(currentTheme);
    console.log('✨ ChaekMate Theme Recommend 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeRecommend);
}
else {
    initThemeRecommend();
}
export { initThemeRecommend };
