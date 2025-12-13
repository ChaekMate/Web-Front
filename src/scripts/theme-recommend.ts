console.log('🎨 ChaekMate Theme Recommend 로드 완료!');

// 테마 데이터
const themes = {
    work: {
        icon: '💼',
        title: '직장인을 위한 필독서',
        description: '업무 효율을 높이고 커리어 성장을 돕는 실용적인 책들을 모았습니다. 시간 관리, 생산성, 리더십, 업무 스킬 향상에 도움이 되는 베스트셀러들입니다.'
    },
    bedtime: {
        icon: '🌙',
        title: '잠들기 전 읽기 좋은 책',
        description: '하루를 마무리하며 편안하게 읽을 수 있는 감성 에세이와 소설들입니다. 마음을 따뜻하게 하고 평온한 밤을 선물하는 책들을 엄선했습니다.'
    },
    weekend: {
        icon: '☕',
        title: '주말 오후 여유롭게',
        description: '시간을 들여 깊이 있게 읽을 수 있는 인문 교양서와 철학서입니다. 커피 한 잔과 함께 사색하며 읽기 좋은 책들을 모았습니다.'
    },
    goals: {
        icon: '🎯',
        title: '새해 목표 달성을 위한',
        description: '습관 형성, 동기부여, 목표 설정에 관한 실용적인 가이드입니다. 새로운 시작을 준비하고 계획을 실행하는 데 도움이 되는 책들입니다.'
    },
    healing: {
        icon: '🌿',
        title: '마음의 힐링이 필요할 때',
        description: '지친 마음을 위로하고 회복할 수 있는 책들입니다. 에세이, 시집, 심리학 서적 등 내면의 평화를 찾을 수 있는 도서들을 모았습니다.'
    },
    growth: {
        icon: '📈',
        title: '자기계발 베스트셀러',
        description: '개인의 성장과 발전을 위한 필독서들입니다. 사고방식의 전환, 실용적인 스킬 습득, 인생의 지혜를 얻을 수 있는 책들을 엄선했습니다.'
    }
};

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

// ==================== URL 파라미터로 테마 로드 ====================
function loadTheme(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme') || 'work';

    // 테마 정보 업데이트
    const themeData = themes[theme as keyof typeof themes] || themes.work;

    const themeIcon = document.getElementById('themeIcon');
    const themeTitle = document.getElementById('themeTitle');
    const themeDescription = document.getElementById('themeDescription');
    const breadcrumbTheme = document.getElementById('breadcrumbTheme');

    if (themeIcon) themeIcon.textContent = themeData.icon;
    if (themeTitle) themeTitle.textContent = themeData.title;
    if (themeDescription) themeDescription.textContent = themeData.description;
    if (breadcrumbTheme) breadcrumbTheme.textContent = themeData.title;

    // 네비게이션 활성화
    const navItems = document.querySelectorAll('.theme-nav-item');
    navItems.forEach(item => {
        const itemTheme = item.getAttribute('data-theme');
        if (itemTheme === theme) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    console.log('테마 로드:', theme);

    // TODO: API 호출하여 해당 테마의 도서 목록 가져오기
}

// ==================== 테마 네비게이션 ====================
function initThemeNav(): void {
    const navItems = document.querySelectorAll('.theme-nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e: Event) => {
            e.preventDefault();

            const theme = item.getAttribute('data-theme');
            if (theme) {
                window.location.href = `?theme=${theme}`;
            }
        });
    });

    console.log('✅ 테마 네비게이션 초기화 완료');
}

// ==================== 정렬 기능 ====================
function initSort(): void {
    const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement;

    sortSelect?.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        console.log('정렬:', sortValue);

        // TODO: API 호출하여 정렬된 데이터 가져오기
    });

    console.log('✅ 정렬 기능 초기화 완료');
}

// ==================== 책 클릭 이벤트 ====================
function initBookClick(): void {
    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id') || '1';
            console.log('도서 클릭:', bookId);
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
    });

    console.log('✅ 책 클릭 이벤트 초기화 완료');
}

// ==================== 페이지네이션 ====================
function initPagination(): void {
    const pageBtns = document.querySelectorAll('.page-btn');

    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('prev') || btn.classList.contains('next')) {
                console.log('페이지 이동:', btn.textContent);
                return;
            }

            // 활성 페이지 변경
            pageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const pageNum = btn.textContent;
            console.log('페이지:', pageNum);

            // 상단으로 스크롤
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // TODO: API 호출하여 해당 페이지 데이터 가져오기
        });
    });

    console.log('✅ 페이지네이션 초기화 완료');
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

    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => observer.observe(card));

    console.log('✅ 스크롤 애니메이션 초기화 완료');
}

// ==================== 메인 초기화 ====================
function initThemeRecommend(): void {
    console.log('🎬 ChaekMate Theme Recommend 초기화 시작...');

    initSearch();
    loadTheme();
    initThemeNav();
    initSort();
    initBookClick();
    initPagination();
    initScrollAnimations();

    console.log('✨ ChaekMate Theme Recommend 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeRecommend);
} else {
    initThemeRecommend();
}

export { initThemeRecommend };