console.log('📖 ChaekMate Recommend 로드 완료!');
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
// ==================== 테마 카드 클릭 ====================
function initThemeCards() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const themeCard = btn.closest('.theme-card');
            const themeKey = (themeCard === null || themeCard === void 0 ? void 0 : themeCard.getAttribute('data-theme')) || 'work';
            console.log('테마 클릭:', themeKey);
            // 테마별 추천 페이지로 이동
            window.location.href = `/theme-recommend.html?theme=${themeKey}`;
        });
    });
    console.log('✅ 테마 카드 초기화 완료');
}
// ==================== 큐레이터 추천 도서 클릭 ====================
function initCuratorBooks() {
    const curatorBooks = document.querySelectorAll('.curator-book');
    curatorBooks.forEach(book => {
        book.addEventListener('click', () => {
            var _a;
            const bookTitle = (_a = book.querySelector('h4')) === null || _a === void 0 ? void 0 : _a.textContent;
            const bookId = book.getAttribute('data-book-id') || '1';
            console.log('큐레이터 추천 도서 클릭:', bookTitle);
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
    });
    console.log('✅ 큐레이터 추천 초기화 완료');
}
// ==================== 연령별 탭 ====================
function initAgeTabs() {
    const ageTabs = document.querySelectorAll('.age-tab');
    const ageBookGroups = document.querySelectorAll('.age-books .books-grid');
    ageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const age = tab.getAttribute('data-age');
            // 탭 활성화
            ageTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // ✅ 수정: 책 목록 표시 (타입 안전)
            ageBookGroups.forEach(group => {
                const groupElement = group;
                const groupAge = groupElement.getAttribute('data-age');
                groupElement.style.display = (groupAge === age) ? 'grid' : 'none';
            });
            console.log('연령 탭 변경:', age);
        });
    });
    console.log('✅ 연령별 탭 초기화 완료');
}
// ==================== 책 카드 클릭 ====================
function initBookCards() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id') || '1';
            console.log('도서 클릭:', bookId);
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
    });
    console.log('✅ 책 카드 클릭 초기화 완료');
}
// ==================== 실시간 인기 도서 클릭 ====================
function initTrendingBooks() {
    const trendingItems = document.querySelectorAll('.trending-item');
    trendingItems.forEach(item => {
        item.addEventListener('click', () => {
            var _a;
            const bookTitle = (_a = item.querySelector('h4')) === null || _a === void 0 ? void 0 : _a.textContent;
            const bookId = item.getAttribute('data-book-id') || '1';
            console.log('실시간 인기 도서 클릭:', bookTitle);
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
    });
    console.log('✅ 실시간 인기 도서 초기화 완료');
}
// ==================== 스크롤 애니메이션 ====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    const animatedElements = document.querySelectorAll('.theme-card, .curator-card, .book-card, .trending-item');
    animatedElements.forEach(el => observer.observe(el));
    console.log('✅ 스크롤 애니메이션 초기화 완료');
}
// ==================== AI 추천 배너 클릭 ====================
function initAIBanner() {
    const bannerBtn = document.querySelector('.banner-btn');
    bannerBtn === null || bannerBtn === void 0 ? void 0 : bannerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('AI 추천 배너 클릭');
        window.location.href = '/ai-recommend.html';
    });
    console.log('✅ AI 배너 초기화 완료');
}
// ==================== 메인 초기화 ====================
function initRecommend() {
    console.log('🎬 ChaekMate Recommend 초기화 시작...');
    initSearch();
    initThemeCards();
    initCuratorBooks();
    initAgeTabs();
    initBookCards();
    initTrendingBooks();
    initScrollAnimations();
    initAIBanner();
    console.log('✨ ChaekMate Recommend 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRecommend);
}
else {
    initRecommend();
}
