/**
 * ChaekMate Main TypeScript
 * 모든 인터랙션과 기능을 관리합니다
 */
// ==================== 초기화 ====================
console.log('🚀 ChaekMate TypeScript 로드 완료!');
// ==================== 스무스 스크롤 ====================
/**
 * 앵커 링크 클릭 시 부드러운 스크롤 적용
 */
const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('href');
            if (target) {
                const element = document.querySelector(target);
                element === null || element === void 0 ? void 0 : element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    console.log('✅ 스무스 스크롤 초기화 완료');
};
// ==================== CTA 버튼 핸들러 ====================
/**
 * 모든 CTA 버튼에 클릭 이벤트 추가
 */
const initCTAHandlers = () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const href = e.currentTarget.getAttribute('href');
            // # 또는 #cta 링크는 알림 표시
            if (href === '#' || href === '#cta') {
                e.preventDefault();
                showNotification('베타 테스트는 곧 시작됩니다! 🎉');
            }
        });
    });
    console.log('✅ CTA 버튼 핸들러 초기화 완료');
};
// ==================== 알림 표시 ====================
/**
 * 사용자에게 알림 메시지 표시
 * @param message - 표시할 메시지
 */
const showNotification = (message) => {
    alert(message);
    // TODO: 나중에 토스트 알림으로 업그레이드
};
// ==================== 스크롤 애니메이션 ====================
/**
 * 요소가 화면에 나타날 때 애니메이션 적용
 */
const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    const animatedElements = document.querySelectorAll('.feature-card, .step, .stat-item, .pricing-card');
    animatedElements.forEach(el => observer.observe(el));
    console.log('✅ 스크롤 애니메이션 초기화 완료');
};
// ==================== 헤더 스크롤 효과 ====================
/**
 * 스크롤 시 헤더에 그림자 효과 추가
 */
const initHeaderShadow = () => {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header === null || header === void 0 ? void 0 : header.classList.add('scrolled');
        }
        else {
            header === null || header === void 0 ? void 0 : header.classList.remove('scrolled');
        }
    });
    console.log('✅ 헤더 스크롤 효과 초기화 완료');
};
// ==================== 통계 카운터 애니메이션 ====================
/**
 * 통계 숫자가 올라가는 애니메이션
 */
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-item h4');
    stats.forEach(stat => {
        const text = stat.textContent || '';
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        if (isNaN(number))
            return;
        let count = 0;
        const increment = number / 50; // 50 프레임에 걸쳐 증가
        const timer = setInterval(() => {
            count += increment;
            if (count >= number) {
                count = number;
                clearInterval(timer);
            }
            let display = Math.floor(count).toLocaleString();
            // K 단위로 변환
            if (number >= 1000) {
                display = Math.floor(count / 1000) + 'K';
            }
            if (hasPlus)
                display += '+';
            if (hasPercent)
                display += '%';
            stat.textContent = display;
        }, 20);
    });
    console.log('✅ 통계 카운터 애니메이션 실행');
};
// ==================== 통계 섹션 옵저버 ====================
/**
 * 통계 섹션이 보일 때 애니메이션 시작
 */
const initStatsObserver = () => {
    const statsSection = document.querySelector('.stats');
    if (!statsSection)
        return;
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.disconnect(); // 한 번만 실행
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
    console.log('✅ 통계 섹션 옵저버 초기화 완료');
};
// ==================== 데이터 정의 (향후 API 연동용) ====================
/**
 * 기능 목록 데이터
 */
export const features = [
    {
        icon: '🤖',
        title: 'AI 독서 상담',
        description: '당신의 고민과 상황에 딱 맞는 책을 AI가 추천해드립니다.'
    },
    {
        icon: '💭',
        title: '문장 SNS',
        description: '감동적인 문장을 저장하고 공유하세요.'
    },
    {
        icon: '⚖️',
        title: '스마트 비교',
        description: '고민되는 두 권의 책, AI가 핵심 차이점을 분석해드립니다.'
    }
];
/**
 * 요금제 데이터
 */
export const pricingPlans = [
    {
        name: 'Free',
        price: '₩0',
        features: [
            'AI 추천 월 5회',
            '문장 저장 50개',
            '책 비교 월 3회',
            '기본 독서 노트'
        ]
    },
    {
        name: 'Premium',
        price: '₩9,900',
        features: [
            'AI 추천 무제한',
            '문장 저장 무제한',
            '책 비교 무제한',
            'AI 독서 토론',
            '광고 제거',
            '제휴 쿠폰 월 1만원'
        ],
        featured: true
    },
    {
        name: 'Pro',
        price: '₩19,900',
        features: [
            'Premium 모든 기능',
            'AI 독서 코칭',
            '우선 비교 분석',
            '독서 모임 호스팅',
            '신간 조기 접근'
        ]
    }
];
// ==================== 메인 초기화 ====================
/**
 * 페이지 로드 시 모든 기능 초기화
 */
const init = () => {
    console.log('🎬 ChaekMate 초기화 시작...');
    initSmoothScroll();
    initCTAHandlers();
    initScrollAnimations();
    initHeaderShadow();
    initStatsObserver();
    console.log('✨ ChaekMate 초기화 완료!');
};
// DOMContentLoaded 이벤트에서 초기화
document.addEventListener('DOMContentLoaded', init);
