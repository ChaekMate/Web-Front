/**
 * ChaekMate Bestseller TypeScript
 * 베스트셀러 페이지 기능 관리
 */

console.log('📚 ChaekMate Bestseller 로드 완료!');

// ==================== 기간 필터 ====================
function initPeriodFilter(): void {
    const periodBtns = document.querySelectorAll('.period-btn');

    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 모든 버튼 비활성화
            periodBtns.forEach(b => b.classList.remove('active'));
            
            // 클릭한 버튼 활성화
            btn.classList.add('active');
            
            const period = btn.getAttribute('data-period');
            console.log('기간 필터:', period);
            
            // TODO: API 호출하여 데이터 갱신
            loadBestsellers(period || 'weekly');
        });
    });

    console.log('✅ 기간 필터 초기화 완료');
}

// ==================== 카테고리 필터 ====================
function initCategoryFilter(): void {
    const categorySelect = document.getElementById('categoryFilter') as HTMLSelectElement;

    categorySelect?.addEventListener('change', () => {
        const category = categorySelect.value;
        console.log('카테고리 필터:', category);
        
        // TODO: API 호출하여 데이터 갱신
        loadBestsellersByCategory(category);
    });

    console.log('✅ 카테고리 필터 초기화 완료');
}

// ==================== 베스트셀러 데이터 로드 ====================
function loadBestsellers(period: string): void {
    console.log(`${period} 베스트셀러 로딩...`);
    
    // TODO: 실제 API 호출
    // fetch(`/api/bestsellers?period=${period}`)
    //     .then(response => response.json())
    //     .then(data => renderBestsellers(data));
    
    // 현재는 로딩 애니메이션만
    showLoadingAnimation();
    
    setTimeout(() => {
        hideLoadingAnimation();
        console.log('베스트셀러 로딩 완료');
    }, 500);
}

function loadBestsellersByCategory(category: string): void {
    console.log(`${category} 카테고리 베스트셀러 로딩...`);
    
    // TODO: 실제 API 호출
    showLoadingAnimation();
    
    setTimeout(() => {
        hideLoadingAnimation();
        console.log('카테고리별 베스트셀러 로딩 완료');
    }, 500);
}

function showLoadingAnimation(): void {
    const list = document.querySelector('.bestseller-list');
    list?.classList.add('loading');
}

function hideLoadingAnimation(): void {
    const list = document.querySelector('.bestseller-list');
    list?.classList.remove('loading');
}

// ==================== 장바구니 담기 ====================
function initCartButtons(): void {
    const cartBtns = document.querySelectorAll('.btn-cart');

    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const item = btn.closest('.bestseller-item');
            const title = item?.querySelector('.book-title')?.textContent;
            const price = item?.querySelector('.book-price')?.textContent;
            
            console.log('장바구니 담기:', title, price);
            alert(`"${title}"이(가) 장바구니에 담겼습니다.`);
            
            // TODO: 장바구니 API 호출
            // addToCart({ title, price });
        });
    });

    console.log('✅ 장바구니 버튼 초기화 완료');
}

// ==================== 바로구매 ====================
function initBuyButtons(): void {
    const buyBtns = document.querySelectorAll('.btn-buy');

    buyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const item = btn.closest('.bestseller-item');
            const title = item?.querySelector('.book-title')?.textContent;
            const price = item?.querySelector('.book-price')?.textContent;
            
            console.log('바로구매:', title, price);
            alert('바로구매 기능은 준비 중입니다.');
            
            // TODO: 주문 페이지로 이동
            // window.location.href = `/order?book=${bookId}`;
        });
    });

    console.log('✅ 바로구매 버튼 초기화 완료');
}

// ==================== 책 상세 페이지로 이동 ====================
function initBookClick(): void {
    const bookItems = document.querySelectorAll('.bestseller-item');

    bookItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).tagName === 'BUTTON') {
                return;
            }
            
            // ✅ 수정: 상세 페이지로 이동
            const bookId = item.getAttribute('data-book-id') || '1';
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
    });
}

// ==================== 검색 기능 ====================
function initSearch(): void {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    searchBtn?.addEventListener('click', () => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            console.log('검색:', keyword);
            alert(`"${keyword}" 검색 기능은 준비 중입니다.`);
            // TODO: 검색 페이지로 이동
        }
    });

    searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            searchBtn?.dispatchEvent(new Event('click'));
        }
    });

    console.log('✅ 검색 기능 초기화 완료');
}

// ==================== 스크롤 애니메이션 ====================
function initScrollAnimation(): void {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        },
        { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.bestseller-item');
    items.forEach(item => observer.observe(item));

    console.log('✅ 스크롤 애니메이션 초기화 완료');
}

// ==================== 순위 변동 애니메이션 ====================
function animateRankChanges(): void {
    const rankChanges = document.querySelectorAll('.rank-change');
    
    rankChanges.forEach(badge => {
        if (badge.classList.contains('up') || badge.classList.contains('new')) {
            badge.classList.add('pulse');
        }
    });

    console.log('✅ 순위 변동 애니메이션 완료');
}

// ==================== 메인 초기화 ====================
function initBestseller(): void {
    console.log('🎬 ChaekMate Bestseller 초기화 시작...');

    initPeriodFilter();
    initCategoryFilter();
    initCartButtons();
    initBuyButtons();
    initBookClick();
    initSearch();
    initScrollAnimation();
    animateRankChanges();

    console.log('✨ ChaekMate Bestseller 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBestseller);
} else {
    initBestseller();
}

export { initBestseller };