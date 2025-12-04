/**
 * ChaekMate Terms TypeScript
 * 이용약관 페이지 기능 관리
 */

console.log('📄 ChaekMate Terms 로드 완료!');

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

// ==================== 스무스 스크롤 ====================
function initSmoothScroll(): void {
    const navItems = document.querySelectorAll('.terms-nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e: Event) => {
            e.preventDefault();

            const href = (item as HTMLAnchorElement).getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // 스크롤
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // 활성 상태 변경
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                console.log('스크롤 이동:', targetId);
            }
        });
    });

    console.log('✅ 스무스 스크롤 초기화 완료');
}

// ==================== 스크롤 스파이 ====================
function initScrollSpy(): void {
    const sections = document.querySelectorAll('.terms-section');
    const navItems = document.querySelectorAll('.terms-nav-item');

    if (sections.length === 0 || navItems.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;

                    // 모든 네비게이션 비활성화
                    navItems.forEach(item => item.classList.remove('active'));

                    // 현재 섹션에 해당하는 네비게이션 활성화
                    const activeNav = document.querySelector(`.terms-nav-item[href="#${id}"]`);
                    if (activeNav) {
                        activeNav.classList.add('active');
                    }
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        }
    );

    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });

    console.log('✅ 스크롤 스파이 초기화 완료');
}

// ==================== URL 해시 처리 ====================
function handleURLHash(): void {
    const hash = window.location.hash;

    if (hash && hash.length > 1) {
        setTimeout(() => {
            const targetId = hash.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // 네비게이션 활성화
                const navItems = document.querySelectorAll('.terms-nav-item');
                navItems.forEach(item => item.classList.remove('active'));

                const activeNav = document.querySelector(`.terms-nav-item[href="${hash}"]`);
                if (activeNav) {
                    activeNav.classList.add('active');
                }

                console.log('URL 해시 이동:', targetId);
            }
        }, 100);
    }

    console.log('✅ URL 해시 처리 완료');
}

// ==================== 프린트 기능 ====================
function initPrint(): void {
    // Ctrl/Cmd + P 단축키 감지
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            console.log('프린트 요청');
            // 브라우저 기본 프린트 동작 허용
        }
    });

    console.log('✅ 프린트 기능 초기화 완료');
}

// ==================== 텍스트 선택 복사 허용 ====================
function initCopyText(): void {
    // 텍스트 복사 허용 (기본 동작)
    const termsContent = document.querySelector('.terms-content');

    if (termsContent) {
        termsContent.addEventListener('copy', () => {
            console.log('약관 내용 복사됨');
        });
    }

    console.log('✅ 텍스트 복사 기능 초기화 완료');
}

// ==================== 메인 초기화 ====================
function initTerms(): void {
    console.log('🎬 ChaekMate Terms 초기화 시작...');

    initSearch();
    initSmoothScroll();
    initScrollSpy();
    handleURLHash();
    initPrint();
    initCopyText();

    console.log('✨ ChaekMate Terms 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerms);
} else {
    initTerms();
}

export { initTerms };