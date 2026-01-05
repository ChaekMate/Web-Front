var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log('📖 ChaekMate Book Detail 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
// URL에서 책 ID 가져오기
function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
// 책 데이터 로드 및 렌더링
function loadBookData() {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = getBookIdFromUrl();
        if (!bookId) {
            console.error('책 ID가 없습니다.');
            alert('잘못된 접근입니다.');
            window.location.href = '/home.html';
            return;
        }
        console.log('책 ID:', bookId);
        try {
            const response = yield fetch(`${API_BASE_URL}/books/${bookId}`);
            const data = yield response.json();
            if (data.success && data.data) {
                renderBookData(data.data);
            }
            else {
                throw new Error('도서 정보를 불러올 수 없습니다.');
            }
        }
        catch (error) {
            console.error('책 데이터 로드 에러:', error);
            alert('도서 정보를 불러오는 중 오류가 발생했습니다.');
            window.location.href = '/home.html';
        }
    });
}
// 책 데이터 렌더링
function renderBookData(book) {
    // 로딩 숨기기, 메인 섹션 표시
    const loadingState = document.getElementById('loadingState');
    const bookMainSection = document.getElementById('bookMainSection');
    if (loadingState)
        loadingState.style.display = 'none';
    if (bookMainSection)
        bookMainSection.style.display = 'grid';
    // 이미지 (CORS 에러 방지)
    const bookCover = document.getElementById('bookCover');
    if (bookCover) {
        bookCover.src = book.cover_image;
        bookCover.onerror = () => {
            bookCover.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='500'%3E%3Crect fill='%23ddd' width='350' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3E이미지 없음%3C/text%3E%3C/svg%3E";
        };
    }
    // 기본 정보
    const bookTitle = document.getElementById('bookTitle');
    if (bookTitle)
        bookTitle.textContent = book.title;
    const bookAuthor = document.getElementById('bookAuthor');
    if (bookAuthor)
        bookAuthor.textContent = `${book.author} 저`;
    // 출판 정보
    const publisher = document.getElementById('publisher');
    if (publisher)
        publisher.textContent = book.publisher;
    const publishDate = document.getElementById('publishDate');
    if (publishDate)
        publishDate.textContent = book.publish_date;
    const pageCount = document.getElementById('pageCount');
    if (pageCount)
        pageCount.textContent = `${book.page_count}쪽`;
    const isbn = document.getElementById('isbn');
    if (isbn)
        isbn.textContent = book.isbn;
    // 평점
    const ratingScore = document.getElementById('ratingScore');
    if (ratingScore)
        ratingScore.textContent = book.rating.toFixed(1);
    const ratingStars = document.getElementById('ratingStars');
    if (ratingStars) {
        const fullStars = Math.floor(book.rating);
        const emptyStars = 5 - fullStars;
        ratingStars.textContent = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    }
    // 가격
    const finalPrice = document.getElementById('finalPrice');
    if (finalPrice)
        finalPrice.textContent = `${book.price.toLocaleString()}원`;
    const originalPrice = document.getElementById('originalPrice');
    if (originalPrice)
        originalPrice.textContent = `${book.price.toLocaleString()}원`;
    // 설명
    const bookDescription = document.getElementById('bookDescription');
    if (bookDescription) {
        bookDescription.innerHTML = book.description
            ? `<p>${book.description}</p>`
            : '<p>도서 설명이 없습니다.</p>';
    }
    // 페이지 타이틀
    document.title = `${book.title} - ChaekMate`;
    console.log('✅ 책 데이터 렌더링 완료');
}
// 로그인 체크
function checkLoginStatus() {
    const token = localStorage.getItem('access_token');
    return !!token;
}
// 탭 전환
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            btn.classList.add('active');
            const targetContent = document.getElementById(`${tabName}Tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    console.log('✅ 탭 초기화 완료');
}
// 위시리스트
function initWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    wishlistBtn === null || wishlistBtn === void 0 ? void 0 : wishlistBtn.addEventListener('click', () => {
        wishlistBtn.classList.toggle('active');
        if (wishlistBtn.classList.contains('active')) {
            const heart = wishlistBtn.querySelector('.heart');
            if (heart)
                heart.textContent = '♥';
            console.log('위시리스트 추가');
        }
        else {
            const heart = wishlistBtn.querySelector('.heart');
            if (heart)
                heart.textContent = '♡';
            console.log('위시리스트 제거');
        }
    });
    console.log('✅ 위시리스트 초기화 완료');
}
// 수량 조절
function initQuantity() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.getElementById('quantity');
    minusBtn === null || minusBtn === void 0 ? void 0 : minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = (currentValue - 1).toString();
        }
    });
    plusBtn === null || plusBtn === void 0 ? void 0 : plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 99) {
            qtyInput.value = (currentValue + 1).toString();
        }
    });
    qtyInput === null || qtyInput === void 0 ? void 0 : qtyInput.addEventListener('change', () => {
        let value = parseInt(qtyInput.value);
        if (isNaN(value) || value < 1)
            value = 1;
        else if (value > 99)
            value = 99;
        qtyInput.value = value.toString();
    });
    console.log('✅ 수량 조절 초기화 완료');
}
// 장바구니 담기
function initAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const qtyInput = document.getElementById('quantity');
    addToCartBtn === null || addToCartBtn === void 0 ? void 0 : addToCartBtn.addEventListener('click', () => {
        var _a;
        const bookTitle = (_a = document.getElementById('bookTitle')) === null || _a === void 0 ? void 0 : _a.textContent;
        const quantity = qtyInput.value;
        console.log('장바구니 담기:', bookTitle, '수량:', quantity);
        alert(`"${bookTitle}"이(가) 장바구니에 담겼습니다.`);
    });
    console.log('✅ 장바구니 초기화 완료');
}
// 바로구매
function initBuyNow() {
    const buyNowBtn = document.getElementById('buyNowBtn');
    buyNowBtn === null || buyNowBtn === void 0 ? void 0 : buyNowBtn.addEventListener('click', () => {
        alert('바로구매 기능은 준비 중입니다.');
    });
    console.log('✅ 바로구매 초기화 완료');
}
// 리뷰 작성
function initWriteReview() {
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    writeReviewBtn === null || writeReviewBtn === void 0 ? void 0 : writeReviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!checkLoginStatus()) {
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = '/login.html';
            return;
        }
        const bookId = getBookIdFromUrl() || '1';
        window.location.href = `/review-write.html?bookId=${bookId}`;
    });
    console.log('✅ 리뷰 작성 초기화 완료');
}
// 검색 기능
function initDetailSearch() {
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
// 리뷰 도움됨
function initReviewHelpful() {
    const helpfulBtns = document.querySelectorAll('.review-helpful');
    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('span');
            if (countSpan) {
                const currentCount = parseInt(countSpan.textContent || '0');
                countSpan.textContent = (currentCount + 1).toString();
            }
            btn.setAttribute('disabled', 'true');
            btn.style.opacity = '0.5';
        });
    });
    console.log('✅ 리뷰 도움됨 초기화 완료');
}
// 추천 도서 클릭
function initRecommendedBooks() {
    const bookCards = document.querySelectorAll('.recommended-grid .book-card');
    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            alert('추천 도서 기능은 준비 중입니다.');
        });
    });
    console.log('✅ 추천 도서 초기화 완료');
}
// 메인 초기화
function initBookDetail() {
    console.log('🎬 ChaekMate Book Detail 초기화 시작...');
    loadBookData();
    initTabs();
    initWishlist();
    initQuantity();
    initAddToCart();
    initBuyNow();
    initWriteReview();
    initReviewHelpful();
    initRecommendedBooks();
    initDetailSearch();
    console.log('✨ ChaekMate Book Detail 초기화 완료!');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookDetail);
}
else {
    initBookDetail();
}
