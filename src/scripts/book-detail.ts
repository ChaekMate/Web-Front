console.log('📖 ChaekMate Book Detail 로드 완료!');

// 도서 정보 인터페이스
interface BookData {
    id: number;
    title: string;
    author: string;
    publisher: string;
    publishDate: string;
    pageCount: number;
    isbn: string;
    category: string;
    originalPrice: number;
    finalPrice: number;
    discountRate: number;
    rating: number;
    ratingCount: number;
    description: string;
    toc: string[];
    coverImage: string;
}

// ==================== 로그인 체크 ====================
function checkLoginStatus(): boolean {
    // TODO: 실제 로그인 상태 확인
    // const token = localStorage.getItem('authToken');
    // return !!token;
    
    // 더미: 로그인되어 있다고 가정 (테스트용)
    // 실제로는 false로 설정하여 로그인 페이지로 리다이렉트 테스트
    return true;
}

// ==================== URL에서 책 ID 가져오기 ====================
function getBookIdFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// ==================== 책 데이터 로드 ====================
function loadBookData(): void {
    const bookId = getBookIdFromUrl();
    
    if (!bookId) {
        console.error('책 ID가 없습니다.');
        return;
    }

    console.log('책 ID:', bookId);
    
    // TODO: 실제 API 호출
    // fetch(`/api/books/${bookId}`)
    //     .then(response => response.json())
    //     .then(data => renderBookData(data));
    
    // 현재는 더미 데이터 사용
    console.log('책 데이터 로드 완료');
}

// ==================== 탭 전환 ====================
function initTabs(): void {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // 모든 탭 비활성화
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 선택한 탭 활성화
            btn.classList.add('active');
            const targetContent = document.getElementById(`${tabName}Tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    console.log('✅ 탭 초기화 완료');
}

// ==================== 위시리스트 ====================
function initWishlist(): void {
    const wishlistBtn = document.getElementById('wishlistBtn');
    
    wishlistBtn?.addEventListener('click', () => {
        wishlistBtn.classList.toggle('active');
        
        if (wishlistBtn.classList.contains('active')) {
            const heart = wishlistBtn.querySelector('.heart');
            if (heart) {
                heart.textContent = '♥';
            }
            console.log('위시리스트 추가');
            // TODO: API 호출
        } else {
            const heart = wishlistBtn.querySelector('.heart');
            if (heart) {
                heart.textContent = '♡';
            }
            console.log('위시리스트 제거');
            // TODO: API 호출
        }
    });

    console.log('✅ 위시리스트 초기화 완료');
}

// ==================== 수량 조절 ====================
function initQuantity(): void {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.getElementById('quantity') as HTMLInputElement;

    minusBtn?.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = (currentValue - 1).toString();
        }
    });

    plusBtn?.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 99) {
            qtyInput.value = (currentValue + 1).toString();
        }
    });

    qtyInput?.addEventListener('change', () => {
        let value = parseInt(qtyInput.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 99) {
            value = 99;
        }
        qtyInput.value = value.toString();
    });

    console.log('✅ 수량 조절 초기화 완료');
}

// ==================== 장바구니 담기 ====================
function initAddToCart(): void {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const qtyInput = document.getElementById('quantity') as HTMLInputElement;

    addToCartBtn?.addEventListener('click', () => {
        const bookTitle = document.getElementById('bookTitle')?.textContent;
        const quantity = qtyInput.value;
        
        console.log('장바구니 담기:', bookTitle, '수량:', quantity);
        alert(`"${bookTitle}"이(가) 장바구니에 담겼습니다.`);
        
        // TODO: 장바구니 API 호출
        // addToCart({ bookId, quantity });
    });

    console.log('✅ 장바구니 초기화 완료');
}

// ==================== 바로구매 ====================
function initBuyNow(): void {
    const buyNowBtn = document.getElementById('buyNowBtn');
    const qtyInput = document.getElementById('quantity') as HTMLInputElement;

    buyNowBtn?.addEventListener('click', () => {
        const bookTitle = document.getElementById('bookTitle')?.textContent;
        const quantity = qtyInput.value;
        
        console.log('바로구매:', bookTitle, '수량:', quantity);
        alert('주문 페이지로 이동합니다.');
        
        // TODO: 주문 페이지로 이동
        // window.location.href = `/order?bookId=${bookId}&quantity=${quantity}`;
    });

    console.log('✅ 바로구매 초기화 완료');
}

// ==================== 리뷰 작성 ====================
function initWriteReview(): void {
    const writeReviewBtn = document.getElementById('writeReviewBtn');

    writeReviewBtn?.addEventListener('click', (e: Event) => {
        e.preventDefault();
        
        // ✅ 추가: 로그인 체크
        if (!checkLoginStatus()) {
            alert('로그인이 필요한 서비스입니다.');
            const returnUrl = encodeURIComponent(window.location.href);
            window.location.href = `/login.html?returnUrl=${returnUrl}`;
            return;
        }
        
        const bookId = getBookIdFromUrl() || '1';
        console.log('리뷰 작성 페이지로 이동:', bookId);
        
        // ✅ 수정: 실제 페이지 이동
        window.location.href = `/review-write.html?bookId=${bookId}`;
    });

    console.log('✅ 리뷰 작성 초기화 완료');
}

// ==================== 리뷰 수정 ====================
function initReviewEdit(): void {
    const editBtns = document.querySelectorAll('.btn-edit-review');

    editBtns.forEach(btn => {
        btn.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            
            const reviewId = btn.getAttribute('data-review-id');
            const bookId = btn.getAttribute('data-book-id') || getBookIdFromUrl() || '1';
            
            console.log('리뷰 수정:', { bookId, reviewId });
            
            // ✅ 리뷰 수정 페이지로 이동
            window.location.href = `/review-write.html?bookId=${bookId}&reviewId=${reviewId}`;
        });
    });

    console.log('✅ 리뷰 수정 초기화 완료');
}

// ==================== 리뷰 도움됨 ====================
function initReviewHelpful(): void {
    const helpfulBtns = document.querySelectorAll('.review-helpful');

    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('span');
            if (countSpan) {
                const currentCount = parseInt(countSpan.textContent || '0');
                countSpan.textContent = (currentCount + 1).toString();
            }
            
            btn.setAttribute('disabled', 'true');
            (btn as HTMLElement).style.opacity = '0.5';
            
            console.log('리뷰 도움됨');
            // TODO: API 호출
        });
    });

    console.log('✅ 리뷰 도움됨 초기화 완료');
}

// ==================== 리뷰 더보기 ====================
function initLoadMoreReviews(): void {
    const loadMoreBtn = document.getElementById('loadMoreReviews');

    loadMoreBtn?.addEventListener('click', () => {
        console.log('리뷰 더 로드');
        alert('리뷰 더보기 기능은 준비 중입니다.');
        
        // TODO: API 호출하여 추가 리뷰 로드
    });

    console.log('✅ 리뷰 더보기 초기화 완료');
}

// ==================== 추천 도서 클릭 ====================
function initRecommendedBooks(): void {
    const bookCards = document.querySelectorAll('.recommended-grid .book-card');

    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3')?.textContent;
            console.log('추천 도서 클릭:', title);
            
            // TODO: 해당 책 상세 페이지로 이동
            // const bookId = card.getAttribute('data-book-id');
            // window.location.href = `/book-detail.html?id=${bookId}`;
            
            alert('추천 도서 페이지로 이동합니다.');
        });
    });

    console.log('✅ 추천 도서 초기화 완료');
}

// ==================== 검색 기능 ====================
function initSearch(): void {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    searchBtn?.addEventListener('click', () => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            console.log('검색:', keyword);
            // ✅ 수정: 실제 페이지 이동
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
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

    const sections = document.querySelectorAll('.tab-content, .recommended-books');
    sections.forEach(section => observer.observe(section));

    console.log('✅ 스크롤 애니메이션 초기화 완료');
}

// ==================== 페이지 타이틀 업데이트 ====================
function updatePageTitle(): void {
    const bookTitle = document.getElementById('bookTitle')?.textContent;
    if (bookTitle) {
        document.title = `${bookTitle} - ChaekMate`;
    }
}

// ==================== 메인 초기화 ====================
function initBookDetail(): void {
    console.log('🎬 ChaekMate Book Detail 초기화 시작...');

    loadBookData();
    initTabs();
    initWishlist();
    initQuantity();
    initAddToCart();
    initBuyNow();
    initWriteReview();
    initReviewEdit();  // ✅ 추가
    initReviewHelpful();
    initLoadMoreReviews();
    initRecommendedBooks();
    initSearch();
    initScrollAnimation();
    updatePageTitle();

    console.log('✨ ChaekMate Book Detail 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookDetail);
} else {
    initBookDetail();
}

export { initBookDetail, getBookIdFromUrl };