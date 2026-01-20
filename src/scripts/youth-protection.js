/**
 * ChaekMate Youth Protection TypeScript
 * 청소년보호정책 페이지 기능 관리
 */
console.log('🛡️ ChaekMate Youth Protection 로드 완료!');
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
// ==================== 스무스 스크롤 ====================
function initSmoothScroll() {
    const navItems = document.querySelectorAll('.youth-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (!href || !href.startsWith('#'))
                return;
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
function initScrollSpy() {
    const sections = document.querySelectorAll('.youth-section');
    const navItems = document.querySelectorAll('.youth-nav-item');
    if (sections.length === 0 || navItems.length === 0)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                // 모든 네비게이션 비활성화
                navItems.forEach(item => item.classList.remove('active'));
                // 현재 섹션에 해당하는 네비게이션 활성화
                const activeNav = document.querySelector(`.youth-nav-item[href="#${id}"]`);
                if (activeNav) {
                    activeNav.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
    console.log('✅ 스크롤 스파이 초기화 완료');
}
// ==================== URL 해시 처리 ====================
function handleURLHash() {
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
                const navItems = document.querySelectorAll('.youth-nav-item');
                navItems.forEach(item => item.classList.remove('active'));
                const activeNav = document.querySelector(`.youth-nav-item[href="${hash}"]`);
                if (activeNav) {
                    activeNav.classList.add('active');
                }
                console.log('URL 해시 이동:', targetId);
            }
        }, 100);
    }
    console.log('✅ URL 해시 처리 완료');
}
// ==================== 외부 링크 처리 ====================
function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        // 외부 링크는 새 탭에서 열기
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            console.log('외부 링크 클릭:', href);
        });
    });
    console.log('✅ 외부 링크 처리 초기화 완료');
}
// ==================== 프린트 기능 ====================
function initPrint() {
    // Ctrl/Cmd + P 단축키 감지
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            console.log('프린트 요청');
            // 브라우저 기본 프린트 동작 허용
        }
    });
    console.log('✅ 프린트 기능 초기화 완료');
}
// ==================== 신고 버튼 ====================
function initReportButton() {
    const reportLinks = document.querySelectorAll('a[href*="report"]');
    reportLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('유해 정보 신고 클릭');
            // 신고 페이지로 이동
        });
    });
    console.log('✅ 신고 버튼 초기화 완료');
}
// ==================== 메인 초기화 ====================
function initYouthProtection() {
    console.log('🎬 ChaekMate Youth Protection 초기화 시작...');
    initSearch();
    initSmoothScroll();
    initScrollSpy();
    handleURLHash();
    initExternalLinks();
    initPrint();
    initReportButton();
    console.log('✨ ChaekMate Youth Protection 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYouthProtection);
}
else {
    initYouthProtection();
}
export { initYouthProtection };
