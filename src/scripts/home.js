console.log('🏠 ChaekMate Home 로드 완료!');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// ==================== 검색 기능 ====================
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
        if (e.key === 'Enter') handleSearch();
    });

    console.log('✅ 검색 기능 초기화 완료');
};

// ==================== 베스트셀러 로드 ====================
const loadBestsellers = async () => {
    console.log('베스트셀러 로딩...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/popular?limit=5`);
        const data = await response.json();
        
        if (data.success && data.data) {
            renderBestsellers(data.data);
        }
    } catch (error) {
        console.error('베스트셀러 로드 에러:', error);
    }
};

const renderBestsellers = (books) => {
    const bookList = document.querySelector('.bestseller-section .book-list');
    if (!bookList) return;
    
    const html = books.map((book, index) => `
        <div class="book-item" data-book-id="${book.id}">
            <div class="book-rank">${index + 1}</div>
            <div class="book-cover">
                <img src="${book.cover_image}" alt="${book.title}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'150\\' height=\\'200\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'150\\' height=\\'200\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\'%3E책 표지%3C/text%3E%3C/svg%3E'">
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
    
    bookList.innerHTML = html;
    
    // 클릭 이벤트
    document.querySelectorAll('.bestseller-section .book-item').forEach(item => {
        item.addEventListener('click', () => {
            const bookId = item.getAttribute('data-book-id');
            if (bookId) {
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });
    
    console.log('✅ 베스트셀러 렌더링 완료:', books.length);
};

// ==================== AI 추천 로드 (더미 데이터 유지) ====================
const initAIRecommend = () => {
    console.log('AI 추천 초기화...');
    
    // AI 추천 카드 클릭 이벤트
    document.querySelectorAll('.ai-recommend-section .recommend-card').forEach(card => {
        const button = card.querySelector('.recommend-btn');
        button?.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = card.getAttribute('data-book-id');
            if (bookId) {
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });
    
    console.log('✅ AI 추천 초기화 완료');
};

// ==================== 큐레이터 추천 로드 ====================
const loadCuratorPicks = async () => {
    console.log('큐레이터 추천 로딩...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/curator-picks?limit=4`);
        const data = await response.json();
        
        if (data.success && data.data) {
            renderCuratorPicks(data.data);
        }
    } catch (error) {
        console.error('큐레이터 추천 로드 에러:', error);
    }
};

const renderCuratorPicks = (books) => {
    const curatorGrid = document.querySelector('.curator-section .recommend-grid');
    if (!curatorGrid) return;
    
    const html = books.map(book => `
        <div class="recommend-card" data-book-id="${book.id}">
            <div class="recommend-badge">큐레이터 추천</div>
            <div class="book-cover">
                <img src="${book.cover_image}" alt="${book.title}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'180\\' height=\\'240\\'%3E%3Crect fill=\\'%23000\\' width=\\'180\\' height=\\'240\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23fff\\' font-size=\\'14\\'%3E큐레이터 추천%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="recommend-info">
                <h3>${book.title}</h3>
                <p class="recommend-reason">${book.author} 저</p>
                <button class="recommend-btn">자세히 보기</button>
            </div>
        </div>
    `).join('');
    
    curatorGrid.innerHTML = html;
    
    // 클릭 이벤트
    document.querySelectorAll('.curator-section .recommend-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id');
            if (bookId) {
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });
    
    console.log('✅ 큐레이터 추천 렌더링 완료:', books.length);
};

// ==================== 메인 초기화 ====================
const initHome = () => {
    console.log('🎬 ChaekMate Home 초기화 시작...');
    
    initHomeSearch();
    loadBestsellers();
    initAIRecommend();
    loadCuratorPicks();
    
    console.log('✨ ChaekMate Home 초기화 완료!');
};

// DOM 로드 시 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}