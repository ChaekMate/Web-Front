console.log('🔍 ChaekMate Search 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
let currentKeyword = '';
let currentFilter = 'all';
let currentSort = 'relevance';
let currentPage = 1;
// URL 파라미터 파싱
function getSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    currentKeyword = urlParams.get('q') || urlParams.get('keyword') || '';
    if (currentKeyword) {
        const searchInput = document.getElementById('searchInput');
        const keywordElement = document.getElementById('searchKeyword');
        if (searchInput)
            searchInput.value = currentKeyword;
        if (keywordElement)
            keywordElement.textContent = currentKeyword;
        console.log('검색어:', currentKeyword);
        performSearch();
    }
    else {
        showNoResults();
    }
}
// 검색 API 호출
async function performSearch() {
    console.log(`검색 실행: "${currentKeyword}"`);
    showLoadingAnimation();
    try {
        const offset = (currentPage - 1) * 10;
        const response = await fetch(`${API_BASE_URL}/books/search?q=${encodeURIComponent(currentKeyword)}&limit=10&offset=${offset}`);
        const data = await response.json();
        hideLoadingAnimation();
        if (data.success && data.data.length > 0) {
            renderSearchResults(data.data, data.total);
        }
        else {
            showNoResults();
        }
    }
    catch (error) {
        console.error('검색 에러:', error);
        hideLoadingAnimation();
        showNoResults();
    }
}
// 검색 결과 렌더링
function renderSearchResults(books, total) {
    const resultsSection = document.getElementById('searchResults');
    const noResultsSection = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');
    if (noResultsSection)
        noResultsSection.style.display = 'none';
    if (resultsSection)
        resultsSection.style.display = 'block';
    if (resultCount)
        resultCount.textContent = String(total);
    if (!resultsSection)
        return;
    const html = books.map(book => `
        <div class="result-item book-item" data-book-id="${book.id}">
            <div class="item-image">
                <img src="${book.cover_image}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/120x180?text=Book'">
            </div>
            <div class="item-content">
                <div class="item-badge">도서</div>
                <h3 class="item-title">${book.title}</h3>
                <p class="item-author">${book.author} · ${book.publisher}</p>
                <div class="item-rating">
                    <span class="stars">${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}</span>
                    <span class="rating-score">${book.rating.toFixed(1)}</span>
                </div>
                <p class="item-description">${book.description || '도서 설명이 없습니다.'}</p>
            </div>
            <div class="item-actions">
                <p class="item-price">${book.price.toLocaleString()}원</p>
                <button class="btn-cart">장바구니</button>
                <button class="btn-buy">바로구매</button>
            </div>
        </div>
    `).join('');
    resultsSection.innerHTML = html;
    // 이벤트 재등록
    initCartButtons();
    initBuyButtons();
    initResultItemClick();
    highlightKeyword();
}
function showLoadingAnimation() {
    const results = document.getElementById('searchResults');
    if (results)
        results.style.opacity = '0.5';
}
function hideLoadingAnimation() {
    const results = document.getElementById('searchResults');
    if (results)
        results.style.opacity = '1';
}
function showNoResults() {
    const resultsSection = document.getElementById('searchResults');
    const noResultsSection = document.getElementById('noResults');
    if (resultsSection)
        resultsSection.style.display = 'none';
    if (noResultsSection)
        noResultsSection.style.display = 'block';
}
// 검색 실행
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const handleSearch = () => {
        const keyword = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
        if (keyword) {
            const newUrl = `${window.location.pathname}?q=${encodeURIComponent(keyword)}`;
            window.history.pushState({}, '', newUrl);
            currentKeyword = keyword;
            currentPage = 1;
            performSearch();
        }
    };
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', handleSearch);
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            handleSearch();
    });
    console.log('✅ 검색 기능 초기화 완료');
}
// 필터 탭
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter') || 'all';
            currentPage = 1;
            console.log('필터 변경:', currentFilter);
            performSearch();
        });
    });
    console.log('✅ 필터 탭 초기화 완료');
}
// 정렬
function initSortSelect() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect === null || sortSelect === void 0 ? void 0 : sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        currentPage = 1;
        console.log('정렬 변경:', currentSort);
        performSearch();
    });
    console.log('✅ 정렬 선택 초기화 완료');
}
// 장바구니 담기
function initCartButtons() {
    const cartBtns = document.querySelectorAll('.btn-cart');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            const item = btn.closest('.result-item');
            const title = (_a = item === null || item === void 0 ? void 0 : item.querySelector('.item-title')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('장바구니 담기:', title);
            alert(`"${title}"이(가) 장바구니에 담겼습니다.`);
        });
    });
    console.log('✅ 장바구니 버튼 초기화 완료');
}
// 바로구매
function initBuyButtons() {
    const buyBtns = document.querySelectorAll('.btn-buy');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            const item = btn.closest('.result-item');
            const title = (_a = item === null || item === void 0 ? void 0 : item.querySelector('.item-title')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('바로구매:', title);
            alert('바로구매 기능은 준비 중입니다.');
        });
    });
    console.log('✅ 바로구매 버튼 초기화 완료');
}
// 결과 아이템 클릭 (도서 상세로 이동)
function initResultItemClick() {
    const bookItems = document.querySelectorAll('.book-item');
    bookItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON')
                return;
            const bookId = item.getAttribute('data-book-id');
            if (bookId) {
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });
    console.log('✅ 결과 아이템 클릭 초기화 완료');
}
// 페이지네이션
function initPagination() {
    const pageNums = document.querySelectorAll('.page-num');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    pageNums.forEach(pageNum => {
        pageNum.addEventListener('click', () => {
            pageNums.forEach(p => p.classList.remove('active'));
            pageNum.classList.add('active');
            currentPage = parseInt(pageNum.textContent || '1');
            console.log('페이지 이동:', currentPage);
            performSearch();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            performSearch();
            updatePaginationUI();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener('click', () => {
        currentPage++;
        performSearch();
        updatePaginationUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    console.log('✅ 페이지네이션 초기화 완료');
}
function updatePaginationUI() {
    const pageNums = document.querySelectorAll('.page-num');
    const prevBtn = document.querySelector('.page-btn.prev');
    pageNums.forEach((pageNum, index) => {
        pageNum.classList.toggle('active', index + 1 === currentPage);
    });
    if (prevBtn)
        prevBtn.disabled = currentPage === 1;
}
// 연관 검색어 클릭
function initRelatedTags() {
    const relatedTags = document.querySelectorAll('.related-tag');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    Array.from(relatedTags).concat(Array.from(suggestionTags)).forEach(tag => {
        tag.addEventListener('click', (e) => {
            var _a;
            e.preventDefault();
            const keyword = (_a = tag.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            if (keyword) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput)
                    searchInput.value = keyword;
                currentKeyword = keyword;
                currentPage = 1;
                const newUrl = `${window.location.pathname}?q=${encodeURIComponent(keyword)}`;
                window.history.pushState({}, '', newUrl);
                performSearch();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    console.log('✅ 연관 검색어 초기화 완료');
}
// 검색어 하이라이트
function highlightKeyword() {
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
// 메인 초기화
function initSearchPage() {
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
    if (currentKeyword) {
        setTimeout(highlightKeyword, 100);
    }
    console.log('✨ ChaekMate Search 초기화 완료!');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPage);
}
else {
    initSearchPage();
}
