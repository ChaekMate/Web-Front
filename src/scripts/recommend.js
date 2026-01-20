console.log('📖 ChaekMate Recommend 로드 완료!');
// ==================== API 설정 ====================
const API_BASE_URL = 'http://localhost:8000/api/v1';
// ==================== 큐레이터 더미 데이터 ====================
const CURATOR_DATA = [
    {
        name: "김서연",
        specialty: "문학 전문",
        avatar: "김",
        comment: "올 겨울, 마음을 따뜻하게 녹여줄 소설입니다. 한강 작가의 섬세한 문체가 돋보이는 작품으로..."
    },
    {
        name: "이준호",
        specialty: "자기계발 전문",
        avatar: "이",
        comment: "2025년을 더 생산적으로 보내고 싶다면 꼭 읽어야 할 책입니다. 실용적인 팁들이 가득..."
    },
    {
        name: "박민지",
        specialty: "인문 전문",
        avatar: "박",
        comment: "AI 시대를 살아가는 우리에게 필요한 인문학적 통찰을 제공합니다. 깊이 있는 사유를..."
    }
];
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
// ==================== 큐레이터 추천 로드 ====================
async function loadCuratorPicks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books/curator-picks?limit=3`);
        if (!response.ok) {
            throw new Error('Failed to fetch curator picks');
        }
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            renderCuratorPicks(result.data);
        }
        console.log('✅ 큐레이터 추천 로드 완료:', result.data.length);
    }
    catch (error) {
        console.error('❌ 큐레이터 추천 로드 실패:', error);
    }
}
// ==================== 큐레이터 추천 렌더링 ====================
function renderCuratorPicks(books) {
    const curatorPicks = document.querySelector('.curator-picks');
    if (!curatorPicks)
        return;
    curatorPicks.innerHTML = books.map((book, index) => {
        const curator = CURATOR_DATA[index] || CURATOR_DATA[0];
        return `
            <div class="curator-card">
                <div class="curator-info">
                    <div class="curator-avatar">${curator.avatar}</div>
                    <div class="curator-name">
                        <strong>${curator.name}</strong> 큐레이터
                        <span>${curator.specialty}</span>
                    </div>
                </div>
                <div class="curator-comment">
                    "${curator.comment}"
                </div>
                <div class="curator-book" data-book-id="${book.id}">
                    <div class="book-cover-small">
                        <img src="${book.cover_image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'140\'%3E%3Crect fill=\'%23ddd\' width=\'100\' height=\'140\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-size=\'14\'%3E책 표지%3C/text%3E%3C/svg%3E'}" alt="${book.title}">
                    </div>
                    <div class="book-info-small">
                        <h4>${book.title}</h4>
                        <p>${book.author} · ${book.publisher}</p>
                        <p class="price">${book.price.toLocaleString()}원</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    // 클릭 이벤트 재등록
    initCuratorBooks();
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
// ==================== 연령별 추천 로드 ====================
async function loadAgeBooks(age) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/by-age?age=${age}&limit=4`);
        if (!response.ok) {
            throw new Error('Failed to fetch age books');
        }
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            renderAgeBooks(result.data, age);
        }
        console.log(`✅ ${age} 연령별 추천 로드 완료:`, result.data.length);
    }
    catch (error) {
        console.error(`❌ ${age} 연령별 추천 로드 실패:`, error);
    }
}
// ==================== 연령별 추천 렌더링 ====================
function renderAgeBooks(books, age) {
    const ageBooks = document.getElementById('ageBooks');
    if (!ageBooks)
        return;
    // 해당 연령대 그리드 찾기
    const targetGrid = ageBooks.querySelector(`[data-age="${age}"]`);
    if (!targetGrid)
        return;
    targetGrid.innerHTML = books.map(book => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover_image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'280\'%3E%3Crect fill=\'%23ddd\' width=\'200\' height=\'280\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-size=\'14\'%3E책 표지%3C/text%3E%3C/svg%3E'}" alt="${book.title}">
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-price"><span class="price">${book.price.toLocaleString()}원</span></p>
            </div>
        </div>
    `).join('');
    // 클릭 이벤트 재등록
    initBookCards();
}
// ==================== 연령별 탭 ====================
function initAgeTabs() {
    const ageTabs = document.querySelectorAll('.age-tab');
    const ageBookGroups = document.querySelectorAll('.age-books .books-grid');
    ageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const age = tab.getAttribute('data-age');
            if (!age)
                return;
            // 탭 활성화
            ageTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // 책 목록 표시
            ageBookGroups.forEach(group => {
                const groupElement = group;
                const groupAge = groupElement.getAttribute('data-age');
                groupElement.style.display = (groupAge === age) ? 'grid' : 'none';
            });
            // API 호출 - 데이터가 없는 경우만
            const targetGrid = document.querySelector(`[data-age="${age}"]`);
            if (targetGrid && targetGrid.children.length === 0) {
                loadAgeBooks(age);
            }
            console.log('연령 탭 변경:', age);
        });
    });
    console.log('✅ 연령별 탭 초기화 완료');
}
// ==================== 실시간 인기 도서 로드 ====================
async function loadTrendingBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books/popular?limit=5`);
        if (!response.ok) {
            throw new Error('Failed to fetch trending books');
        }
        const result = await response.json();
        if (result.success && result.data.length > 0) {
            renderTrendingBooks(result.data);
        }
        console.log('✅ 실시간 인기 도서 로드 완료:', result.data.length);
    }
    catch (error) {
        console.error('❌ 실시간 인기 도서 로드 실패:', error);
    }
}
// ==================== 실시간 인기 도서 렌더링 ====================
function renderTrendingBooks(books) {
    const trendingBooks = document.querySelector('.trending-books');
    if (!trendingBooks)
        return;
    trendingBooks.innerHTML = books.map(book => {
        let badgeHTML = '';
        const change = book.ranking_change;
        if (change === null) {
            badgeHTML = '<div class="trending-badge new">NEW</div>';
        }
        else if (change > 0) {
            badgeHTML = `<div class="trending-badge up">↑ ${change}</div>`;
        }
        else if (change < 0) {
            badgeHTML = `<div class="trending-badge down">↓ ${Math.abs(change)}</div>`;
        }
        else {
            badgeHTML = '<div class="trending-badge">-</div>';
        }
        return `
            <div class="trending-item" data-book-id="${book.id}">
                <div class="trending-rank">${book.ranking}</div>
                <div class="trending-cover">
                    <img src="${book.cover_image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'112\'%3E%3Crect fill=\'%23ddd\' width=\'80\' height=\'112\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-size=\'12\'%3E책 표지%3C/text%3E%3C/svg%3E'}" alt="${book.title}">
                </div>
                <div class="trending-info">
                    <h4>${book.title}</h4>
                    <p>${book.author} · ${book.publisher}</p>
                    ${badgeHTML}
                </div>
                <div class="trending-price">${book.price.toLocaleString()}원</div>
            </div>
        `;
    }).join('');
    // 클릭 이벤트 재등록
    initTrendingBooks();
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
    initAgeTabs();
    initScrollAnimations();
    initAIBanner();
    // API 데이터 로드
    loadCuratorPicks();
    loadAgeBooks('20s'); // 기본 20대 데이터 로드
    loadTrendingBooks();
    console.log('✨ ChaekMate Recommend 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRecommend);
}
else {
    initRecommend();
}
