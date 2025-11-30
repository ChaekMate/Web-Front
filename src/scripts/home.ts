/**
 * ChaekMate Home TypeScript
 * 메인 홈페이지 기능 관리
 */

console.log('🏠 ChaekMate Home 로드 완료!');

// ==================== 검색 기능 ====================
const initHomeSearch = (): void => {
  const searchBtn = document.querySelector('.search-btn');
  const searchInput = document.querySelector('.search-input') as HTMLInputElement;

  searchBtn?.addEventListener('click', () => {
    const keyword = searchInput?.value.trim();
    if (keyword) {
      alert(`"${keyword}" 검색 기능은 준비 중입니다!`);
      // TODO: 실제 검색 페이지로 이동
      // window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
    }
  });

  // Enter 키로 검색
  searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchBtn?.dispatchEvent(new Event('click'));
    }
  });

  console.log('✅ 검색 기능 초기화 완료');
};

// ==================== 스무스 스크롤 ====================
const initSmoothScroll = (): void => {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e: Event) => {
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      
      // 외부 링크나 기능 링크는 제외
      if (href === '#' || !href) {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('✅ 스무스 스크롤 초기화 완료');
};

// ==================== 책 클릭 이벤트 ====================
const initBookClick = (): void => {
  const bookItems = document.querySelectorAll('.book-item');
  
  bookItems.forEach(item => {
    item.addEventListener('click', () => {
      // ✅ 수정: 상세 페이지로 이동
      const bookId = item.getAttribute('data-book-id') || '1';
      window.location.href = `/book-detail.html?id=${bookId}`;
    });
  });
};

// ==================== AI 추천 카드 클릭 ====================
const initRecommendClick = (): void => {
  const recommendBtns = document.querySelectorAll('.recommend-btn');
  
  recommendBtns.forEach(btn => {
    btn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      alert('AI 추천 상세보기 기능은 준비 중입니다!');
      // TODO: AI 추천 상세 페이지로 이동
    });
  });

  console.log('✅ AI 추천 클릭 이벤트 초기화 완료');
};

// ==================== 카테고리 클릭 ====================
const initCategoryClick = (): void => {
  const categoryItems = document.querySelectorAll('.category-item');
  
  categoryItems.forEach(item => {
    item.addEventListener('click', (e: Event) => {
      const href = (item as HTMLAnchorElement).getAttribute('href');
      
      // book-list.html 링크는 정상 이동 (alert 없음)
      if (href && href.includes('book-list.html')) {
        return;
      }
      
      // 그 외는 막기
      e.preventDefault();
    });
  });

  console.log('✅ 카테고리 클릭 이벤트 초기화 완료');
};

// ==================== 스크롤 애니메이션 ====================
const initScrollAnimations = (): void => {
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
    '.book-item, .recommend-card, .event-card, .category-item'
  );
  
  animatedElements.forEach(el => observer.observe(el));

  console.log('✅ 스크롤 애니메이션 초기화 완료');
};

// ==================== 헤더 스크롤 효과 ====================
const initHeaderScroll = (): void => {
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  console.log('✅ 헤더 스크롤 효과 초기화 완료');
};

// ==================== 메인 초기화 ====================
const initHome = (): void => {
  console.log('🎬 ChaekMate Home 초기화 시작...');
  
  initHomeSearch();
  initSmoothScroll();
  initBookClick();
  initRecommendClick();
  initCategoryClick();
  initScrollAnimations();
  initHeaderScroll();
  
  console.log('✨ ChaekMate Home 초기화 완료!');
};

// DOMContentLoaded 이벤트에서 초기화
document.addEventListener('DOMContentLoaded', initHome);