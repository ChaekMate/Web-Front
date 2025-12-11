/**
 * ChaekMate New Books TypeScript
 * 신간 페이지 기능 관리
 */

console.log('📚 ChaekMate New Books 로드 완료!');

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

// ==================== 필터 기능 ====================
function initFilters(): void {
    // 기간 필터
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const period = btn.getAttribute('data-period');
            console.log('기간 필터:', period);
            // TODO: API 호출하여 필터링된 데이터 가져오기
        });
    });

    // 카테고리 필터
    const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement;
    
    categorySelect?.addEventListener('change', () => {
        const category = categorySelect.value;
        console.log('카테고리 필터:', category);
        // TODO: API 호출하여 필터링된 데이터 가져오기
    });

    // 정렬 필터
    const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement;
    
    sortSelect?.addEventListener('change', () => {
        const sort = sortSelect.value;
        console.log('정렬:', sort);
        // TODO: API 호출하여 정렬된 데이터 가져오기
    });

    console.log('✅ 필터 기능 초기화 완료');
}

// ==================== 책 클릭 이벤트 ====================
function initBookClick(): void {
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id') || '1';
            console.log('신간 도서 클릭:', bookId);
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
                // TODO: 이전/다음 페이지 로직
                return;
            }
            
            // 활성 페이지 변경
            pageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const pageNum = btn.textContent;
            console.log('페이지 이동:', pageNum);
            
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

// ==================== URL 파라미터 처리 ====================
function handleURLParams(): void {
    const urlParams = new URLSearchParams(window.location.search);
    
    const category = urlParams.get('category');
    if (category) {
        const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement;
        if (categorySelect) {
            categorySelect.value = category;
            console.log('URL 카테고리:', category);
        }
    }

    const period = urlParams.get('period');
    if (period) {
        const filterBtn = document.querySelector(`[data-period="${period}"]`);
        if (filterBtn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            filterBtn.classList.add('active');
            console.log('URL 기간:', period);
        }
    }

    console.log('✅ URL 파라미터 처리 완료');
}

// ==================== 메인 초기화 ====================
function initNewBooks(): void {
    console.log('🎬 ChaekMate New Books 초기화 시작...');
    
    initSearch();
    initFilters();
    initBookClick();
    initPagination();
    initScrollAnimations();
    handleURLParams();
    
    console.log('✨ ChaekMate New Books 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewBooks);
} else {
    initNewBooks();
}

export { initNewBooks };