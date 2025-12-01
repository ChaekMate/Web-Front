/**
 * ChaekMate Search TypeScript
 * 검색 결과 페이지 기능 관리
 */

console.log('🔍 ChaekMate Search 로드 완료!');

// 검색 결과 인터페이스
interface SearchResult {
    type: 'book' | 'author' | 'publisher';
    id: string;
    title: string;
    description?: string;
    image: string;
    [key: string]: any;
}

// 전역 상태
let currentKeyword: string = '';
let currentFilter: string = 'all';
let currentSort: string = 'relevance';
let currentPage: number = 1;

// ==================== URL 파라미터 파싱 ====================
function getSearchParams(): void {
    const urlParams = new URLSearchParams(window.location.search);
    currentKeyword = urlParams.get('q') || urlParams.get('keyword') || '';
    
    if (currentKeyword) {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        const keywordElement = document.getElementById('searchKeyword');
        
        if (searchInput) {
            searchInput.value = currentKeyword;
        }
        if (keywordElement) {
            keywordElement.textContent = currentKeyword;
        }
        
        console.log('검색어:', currentKeyword);
        performSearch();
    } else {
        showNoResults();
    }
}

// ==================== 검색 실행 ====================
function performSearch(): void {
    console.log(`검색 실행: "${currentKeyword}", 필터: ${currentFilter}, 정렬: ${currentSort}`);
    
    // TODO: 실제 API 호출
    // fetch(`/api/search?q=${currentKeyword}&filter=${currentFilter}&sort=${currentSort}&page=${currentPage}`)
    //     .then(response => response.json())
    //     .then(data => renderSearchResults(data));
    
    showLoadingAnimation();
    
    setTimeout(() => {
        hideLoadingAnimation();
        console.log('검색 완료');
    }, 500);
}

function showLoadingAnimation(): void {
    const results = document.getElementById('searchResults');
    if (results) {
        results.style.opacity = '0.5';
    }
}

function hideLoadingAnimation(): void {
    const results = document.getElementById('searchResults');
    if (results) {
        results.style.opacity = '1';
    }
}

function showNoResults(): void {
    const resultsSection = document.getElementById('searchResults');
    const noResultsSection = document.getElementById('noResults');
    
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    if (noResultsSection) {
        noResultsSection.style.display = 'block';
    }
}

// ==================== 검색 실행 ====================
function initSearch(): void {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    const handleSearch = (): void => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            // URL 업데이트
            const newUrl = `${window.location.pathname}?q=${encodeURIComponent(keyword)}`;
            window.history.pushState({}, '', newUrl);
            
            currentKeyword = keyword;
            currentPage = 1;
            performSearch();
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

// ==================== 필터 탭 ====================
function initFilterTabs(): void {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 모든 탭 비활성화
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // 클릭한 탭 활성화
            tab.classList.add('active');
            
            currentFilter = tab.getAttribute('data-filter') || 'all';
            currentPage = 1;
            
            console.log('필터 변경:', currentFilter);
            performSearch();
        });
    });

    console.log('✅ 필터 탭 초기화 완료');
}

// ==================== 정렬 ====================
function initSortSelect(): void {
    const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement;

    sortSelect?.addEventListener('change', () => {
        currentSort = sortSelect.value;
        currentPage = 1;
        
        console.log('정렬 변경:', currentSort);
        performSearch();
    });

    console.log('✅ 정렬 선택 초기화 완료');
}

// ==================== 장바구니 담기 ====================
function initCartButtons(): void {
    const cartBtns = document.querySelectorAll('.btn-cart');

    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const item = btn.closest('.result-item');
            const title = item?.querySelector('.item-title')?.textContent;
            const price = item?.querySelector('.item-price')?.textContent;
            
            console.log('장바구니 담기:', title, price);
            alert(`"${title}"이(가) 장바구니에 담겼습니다.`);
            
            // TODO: 장바구니 API 호출
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
            
            const item = btn.closest('.result-item');
            const title = item?.querySelector('.item-title')?.textContent;
            
            console.log('바로구매:', title);
            alert('바로구매 기능은 준비 중입니다.');
            
            // TODO: 주문 페이지로 이동
        });
    });

    console.log('✅ 바로구매 버튼 초기화 완료');
}

// ==================== 결과 아이템 클릭 ====================
function initResultItemClick(): void {
    const bookItems = document.querySelectorAll('.book-item');
    const authorItems = document.querySelectorAll('.author-item');
    const publisherItems = document.querySelectorAll('.publisher-item');

    // 도서 클릭
    bookItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).tagName === 'BUTTON') {
                return;
            }
            
            const title = item.querySelector('.item-title')?.textContent;
            console.log('도서 상세 페이지:', title);
            alert('도서 상세 페이지는 준비 중입니다.');
            
            // TODO: 상세 페이지로 이동
            // const bookId = item.getAttribute('data-book-id');
            // window.location.href = `/book/${bookId}`;
        });
    });

    // 저자 클릭
    authorItems.forEach(item => {
        const viewBtn = item.querySelector('.btn-view-author');
        viewBtn?.addEventListener('click', () => {
            const name = item.querySelector('.item-title')?.textContent;
            console.log('저자 페이지:', name);
            alert('저자 페이지는 준비 중입니다.');
            
            // TODO: 저자 페이지로 이동
        });
    });

    // 출판사 클릭
    publisherItems.forEach(item => {
        const viewBtn = item.querySelector('.btn-view-publisher');
        viewBtn?.addEventListener('click', () => {
            const name = item.querySelector('.item-title')?.textContent;
            console.log('출판사 페이지:', name);
            alert('출판사 페이지는 준비 중입니다.');
            
            // TODO: 출판사 페이지로 이동
        });
    });

    console.log('✅ 결과 아이템 클릭 초기화 완료');
}

// ==================== 페이지네이션 ====================
function initPagination(): void {
    const pageNums = document.querySelectorAll('.page-num');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');

    pageNums.forEach(pageNum => {
        pageNum.addEventListener('click', () => {
            // 모든 페이지 번호 비활성화
            pageNums.forEach(p => p.classList.remove('active'));
            
            // 클릭한 페이지 활성화
            pageNum.classList.add('active');
            
            currentPage = parseInt(pageNum.textContent || '1');
            console.log('페이지 이동:', currentPage);
            
            performSearch();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    prevBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            console.log('이전 페이지:', currentPage);
            performSearch();
            updatePaginationUI();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextBtn?.addEventListener('click', () => {
        currentPage++;
        console.log('다음 페이지:', currentPage);
        performSearch();
        updatePaginationUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    console.log('✅ 페이지네이션 초기화 완료');
}

function updatePaginationUI(): void {
    const pageNums = document.querySelectorAll('.page-num');
    const prevBtn = document.querySelector('.page-btn.prev') as HTMLButtonElement;
    const nextBtn = document.querySelector('.page-btn.next') as HTMLButtonElement;
    
    pageNums.forEach((pageNum, index) => {
        pageNum.classList.toggle('active', index + 1 === currentPage);
    });
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    // TODO: 실제 총 페이지 수에 따라 nextBtn disabled 처리
}

// ==================== 연관 검색어 클릭 ====================
function initRelatedTags(): void {
    const relatedTags = document.querySelectorAll('.related-tag');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    [...relatedTags, ...suggestionTags].forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const keyword = tag.textContent?.trim();
            
            if (keyword) {
                const searchInput = document.getElementById('searchInput') as HTMLInputElement;
                if (searchInput) {
                    searchInput.value = keyword;
                }
                
                currentKeyword = keyword;
                currentPage = 1;
                
                // URL 업데이트
                const newUrl = `${window.location.pathname}?q=${encodeURIComponent(keyword)}`;
                window.history.pushState({}, '', newUrl);
                
                performSearch();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    console.log('✅ 연관 검색어 초기화 완료');
}

// ==================== 검색 결과 하이라이트 ====================
function highlightKeyword(): void {
    const keyword = currentKeyword.toLowerCase();
    const titles = document.querySelectorAll('.item-title');
    
    titles.forEach(title => {
        const text = title.textContent || '';
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes(keyword)) {
            const index = lowerText.indexOf(keyword);
            const before = text.substring(0, index);
            const match = text.substring(index, index + keyword.length);
            const after = text.substring(index + keyword.length);
            
            title.innerHTML = `${before}<mark style="background-color: #ffeb3b; font-weight: 900;">${match}</mark>${after}`;
        }
    });

    console.log('✅ 검색어 하이라이트 완료');
}

// ==================== 메인 초기화 ====================
function initSearchPage(): void {
    console.log('🎬 ChaekMate Search 초기화 시작...');

    getSearchParams();
    initSearch();
    initFilterTabs();
    initSortSelect();
    initCartButtons();
    initBuyButtons();
    initResultItemClick();
    initPagination();
    initRelatedTags();
    
    // 검색어가 있으면 하이라이트
    if (currentKeyword) {
        setTimeout(highlightKeyword, 100);
    }

    console.log('✨ ChaekMate Search 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPage);
} else {
    initSearchPage();
}

export { initSearchPage };