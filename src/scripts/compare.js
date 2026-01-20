console.log('📊 ChaekMate Compare 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
// URL 파라미터에서 도서 ID 추출
function getBookIdsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const idsParam = urlParams.get('ids');
    if (!idsParam) {
        return [];
    }
    return idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
}
// 도서 비교 API 호출
async function compareBooks(bookIds) {
    var _a, _b;
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const compareContainer = document.getElementById('compareContainer');
    if (!loadingState || !errorState || !compareContainer)
        return;
    // 검증
    if (bookIds.length < 2) {
        showError('최소 2권 이상의 도서가 필요합니다.');
        return;
    }
    if (bookIds.length > 3) {
        showError('최대 3권까지 비교할 수 있습니다.');
        return;
    }
    try {
        loadingState.style.display = 'block';
        errorState.style.display = 'none';
        compareContainer.style.display = 'none';
        const response = await fetch(`${API_BASE_URL}/books/compare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_ids: bookIds
            })
        });
        const data = await response.json();
        console.log('API 응답:', data); // 디버깅용
        if (!response.ok) {
            throw new Error('도서 비교에 실패했습니다.');
        }
        // 응답 구조 확인
        const books = ((_a = data.data) === null || _a === void 0 ? void 0 : _a.books) || data.books;
        const summary = ((_b = data.data) === null || _b === void 0 ? void 0 : _b.comparison_summary) || data.comparison_summary;
        if (!books || !summary) {
            throw new Error('응답 데이터가 올바르지 않습니다.');
        }
        loadingState.style.display = 'none';
        compareContainer.style.display = 'block';
        renderComparison(books, summary);
    }
    catch (error) {
        console.error('도서 비교 에러:', error);
        showError('도서 정보를 불러오는데 실패했습니다.');
    }
}
// 에러 표시
function showError(message) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    if (loadingState)
        loadingState.style.display = 'none';
    if (errorState) {
        errorState.style.display = 'block';
        const errorMessage = errorState.querySelector('p');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }
}
// 비교 결과 렌더링
function renderComparison(books, summary) {
    renderSummary(summary);
    renderTable(books, summary);
}
// 비교 요약 렌더링
function renderSummary(summary) {
    const summaryContainer = document.getElementById('compareSummary');
    if (!summaryContainer)
        return;
    const html = `
        <h3>비교 요약</h3>
        <div class="summary-item">
            <span class="summary-label">최저가:</span>
            <span class="summary-value">${summary.lowest_price ? summary.lowest_price.toLocaleString() + '원' : '정보 없음'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">최고가:</span>
            <span class="summary-value">${summary.highest_price ? summary.highest_price.toLocaleString() + '원' : '정보 없음'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">평균 가격:</span>
            <span class="summary-value">${summary.average_price ? Math.round(summary.average_price).toLocaleString() + '원' : '정보 없음'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">평균 평점:</span>
            <span class="summary-value">${summary.average_rating ? summary.average_rating.toFixed(1) : '정보 없음'}</span>
        </div>
    `;
    summaryContainer.innerHTML = html;
}
// 별점 생성
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}
// 비교 테이블 렌더링 (카드형)
function renderTable(books, summary) {
    const tableContainer = document.getElementById('compareTable');
    if (!tableContainer)
        return;
    const cardsHtml = books.map(book => {
        const isLowestPrice = book.price === summary.lowest_price;
        const isHighestRating = book.rating === summary.highest_rating;
        let cardClass = 'book-compare-card';
        if (isLowestPrice)
            cardClass += ' best-price';
        if (isHighestRating)
            cardClass += ' best-rating';
        const badges = [];
        if (isLowestPrice)
            badges.push('<span class="badge badge-price">최저가</span>');
        if (isHighestRating)
            badges.push('<span class="badge badge-rating">최고평점</span>');
        return `
            <div class="${cardClass}">
                <div class="card-badges">
                    ${badges.join('')}
                </div>
                
                <div class="card-cover">
                    <img src="${book.cover_image}" alt="${book.title}"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'280\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'200\\' height=\\'280\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\'%3E이미지 없음%3C/text%3E%3C/svg%3E'">
                </div>
                
                <div class="card-info">
                    <h3 class="card-title">${book.title}</h3>
                    
                    <div class="info-row">
                        <span class="info-label">저자</span>
                        <span class="info-value">${book.author}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">출판사</span>
                        <span class="info-value">${book.publisher}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">ISBN</span>
                        <span class="info-value">${book.isbn || '정보 없음'}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">평점</span>
                        <span class="info-value">
                            <div class="rating-display">
                                <span class="stars">${getStarRating(book.rating)}</span>
                                <span class="rating-number">${book.rating.toFixed(1)}</span>
                            </div>
                        </span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">테마</span>
                        <span class="info-value">${book.theme || '미분류'}</span>
                    </div>
                    
                    ${book.description ? `
                    <div class="card-description">
                        ${book.description.length > 150 ? book.description.substring(0, 150) + '...' : book.description}
                    </div>
                    ` : ''}
                </div>
                
                <div class="card-price">
                    <div class="price-label">가격</div>
                    <div class="price-value ${isLowestPrice ? 'lowest' : ''}">
                        ${book.price.toLocaleString()}원
                    </div>
                </div>
            </div>
        `;
    }).join('');
    tableContainer.innerHTML = cardsHtml;
}
// 검색 기능
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput');
    const handleSearch = () => {
        const keyword = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', handleSearch);
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            handleSearch();
    });
    console.log('✅ 검색 기능 초기화 완료');
}
// 초기화
function initCompare() {
    console.log('🎬 ChaekMate Compare 초기화 시작...');
    initSearch();
    const bookIds = getBookIdsFromUrl();
    if (bookIds.length === 0) {
        showError('비교할 도서를 선택해주세요.');
        return;
    }
    compareBooks(bookIds);
    console.log('✨ ChaekMate Compare 초기화 완료!');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompare);
}
else {
    initCompare();
}
