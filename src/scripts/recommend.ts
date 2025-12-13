/**
 * ChaekMate Recommend TypeScript
 * 도서 추천 페이지 기능 관리
 */

console.log('📖 ChaekMate Recommend 로드 완료!');

// ==================== 검색 기능 ====================
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
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    console.log('✅ 검색 기능 초기화 완료');
}

// ==================== 테마 카드 클릭 ====================
function initThemeCards(): void {
    const themeBtns = document.querySelectorAll('.theme-btn');

    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e: Event) => {
            e.stopPropagation();

            const themeCard = btn.closest('.theme-card');
            const themeName = themeCard?.querySelector('h3')?.textContent;

            console.log('테마 클릭:', themeName);

            // TODO: 테마별 도서 목록 페이지로 이동
            alert(`"${themeName}" 테마의 도서 목록 페이지 준비 중입니다!`);
        });
    });

    console.log('✅ 테마 카드 초기화 완료');
}

// ==================== 큐레이터 추천 도서 클릭 ====================
function initCuratorBooks(): void {
    const curatorBooks = document.querySelectorAll('.curator-book');

    curatorBooks.forEach(book => {
        book.addEventListener('click', () => {
            const bookTitle = book.querySelector('h4')?.textContent;
            console.log('큐레이터 추천 도서 클릭:', bookTitle);

            // TODO: 도서 상세 페이지로 이동
            window.location.href = '/book-detail.html?id=1';
        });

        // 호버 효과
        book.addEventListener('mouseenter', () => {
            book.style.cursor = 'pointer';
        });
    });

    console.log('✅ 큐레이터 추천 초기화 완료');
}

// ==================== 연령별 탭 ====================
function initAgeTabs(): void {
    const ageTabs = document.querySelectorAll('.age-tab');
    const ageBookGroups = document.querySelectorAll('.age-books .books-grid');

    ageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const age = tab.getAttribute('data-age');

            // 탭 활성화
            ageTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 책 목록 표시
            ageBookGroups.forEach(group => {
                const groupAge = group.getAttribute('data-age');
                if (groupAge === age) {
                    (group as HTMLElement).style.display = 'grid';
                } else {
                    (group as HTMLElement).style.display = 'none';
                }
            });

            console.log('연령 탭 변경:', age);
        });
    });

    console.log('✅ 연령별 탭 초기화 완료');
}

// ==================== 책 카드 클릭 ====================
function initBookCards(): void {
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
function initTrendingBooks(): void {
    const trendingItems = document.querySelectorAll('.trending-item');

    trendingItems.forEach(item => {
        item.addEventListener('click', () => {
            const bookTitle = item.querySelector('h4')?.textContent;
            console.log('실시간 인기 도서 클릭:', bookTitle);

            // TODO: 도서 상세 페이지로 이동
            window.location.href = '/book-detail.html?id=1';
        });
    });

    console.log('✅ 실시간 인기 도서 초기화 완료');
}

// ==================== 스크롤 애니메이션 ====================
function initScrollAnimations(): void {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(
        '.theme-card, .curator-card, .book-card, .trending-item'
    );

    animatedElements.forEach(el => observer.observe(el));

    console.log('✅ 스크롤 애니메이션 초기화 완료');
}

// ==================== AI 추천 배너 클릭 ====================
function initAIBanner(): void {
    const bannerBtn = document.querySelector('.banner-btn');

    bannerBtn?.addEventListener('click', (e: Event) => {
        e.preventDefault();
        console.log('AI 추천 배너 클릭');
        window.location.href = '/ai-recommend.html';
    });

    console.log('✅ AI 배너 초기화 완료');
}

// ==================== 메인 초기화 ====================
function initRecommend(): void {
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
} else {
    initRecommend();
}

export { initRecommend };