console.log('📖 ChaekMate Book Detail 로드 완료!');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface BookData {
    id: number;
    title: string;
    author: string;
    publisher: string;
    published_date: string;
    page_count: number;
    isbn: string;
    category: string;
    price: number;
    rating: number;
    cover_image: string;
    description: string;
    purchase_links?: {
        coupang?: string;
        aladin?: string;
        yes24?: string;
        kyobo?: string;
    };
}

// ✨ 전역 변수로 현재 도서 정보 저장
let currentBook: BookData | null = null;

// URL에서 책 ID 가져오기
function getBookIdFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 책 데이터 로드 및 렌더링
async function loadBookData(): Promise<void> {
    const bookId = getBookIdFromUrl();

    if (!bookId) {
        console.error('책 ID가 없습니다.');
        alert('잘못된 접근입니다.');
        window.location.href = '/home.html';
        return;
    }

    console.log('책 ID:', bookId);

    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const data = await response.json();

        if (data.success && data.data) {
            renderBookData(data.data);
        } else {
            throw new Error('도서 정보를 불러올 수 없습니다.');
        }
    } catch (error) {
        console.error('책 데이터 로드 에러:', error);
        alert('도서 정보를 불러오는 중 오류가 발생했습니다.');
        window.location.href = '/home.html';
    }
}

// 책 데이터 렌더링
function renderBookData(book: BookData): void {
    currentBook = book;
    // 로딩 숨기기, 메인 섹션 표시
    const loadingState = document.getElementById('loadingState');
    const bookMainSection = document.getElementById('bookMainSection');

    if (loadingState) loadingState.style.display = 'none';
    if (bookMainSection) bookMainSection.style.display = 'grid';

    // 이미지 (CORS 에러 방지)
    const bookCover = document.getElementById('bookCover') as HTMLImageElement;
    if (bookCover) {
        bookCover.src = book.cover_image;
        bookCover.onerror = () => {
            bookCover.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='500'%3E%3Crect fill='%23ddd' width='350' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3E이미지 없음%3C/text%3E%3C/svg%3E";
        };
    }

    // 기본 정보
    const bookTitle = document.getElementById('bookTitle');
    if (bookTitle) bookTitle.textContent = book.title;

    const bookAuthor = document.getElementById('bookAuthor');
    if (bookAuthor) bookAuthor.textContent = `${book.author} 저`;

    // 출판 정보
    const publisher = document.getElementById('publisher');
    if (publisher) publisher.textContent = book.publisher;

    const publishDate = document.getElementById('publishDate');
    if (publishDate) publishDate.textContent = book.published_date;

    const isbn = document.getElementById('isbn');
    if (isbn) isbn.textContent = book.isbn;

    // 평점
    const ratingScore = document.getElementById('ratingScore');
    if (ratingScore) ratingScore.textContent = book.rating.toFixed(1);

    const ratingStars = document.getElementById('ratingStars');
    if (ratingStars) {
        const fullStars = Math.floor(book.rating);
        const emptyStars = 5 - fullStars;
        ratingStars.textContent = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    }

    // 가격 (정가만 표시)
    const finalPrice = document.getElementById('finalPrice');
    if (finalPrice) finalPrice.textContent = `${book.price.toLocaleString()}원`;

    // 설명
    const bookDescription = document.getElementById('bookDescription');

    if (bookDescription) {
        const description = book.description || '';
        bookDescription.innerHTML = description
            ? `<p>${description}</p>`
            : '<p>도서 설명이 없습니다.</p>';
    }

    // 페이지 타이틀
    document.title = `${book.title} - ChaekMate`;

    console.log('✅ 책 데이터 렌더링 완료');
}

// 로그인 체크
function checkLoginStatus(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
}

// 탭 전환
function initTabs(): void {
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
function initWishlist(): void {
    const wishlistBtn = document.getElementById('wishlistBtn');

    wishlistBtn?.addEventListener('click', () => {
        wishlistBtn.classList.toggle('active');

        if (wishlistBtn.classList.contains('active')) {
            const heart = wishlistBtn.querySelector('.heart');
            if (heart) heart.textContent = '♥';
            console.log('위시리스트 추가');
        } else {
            const heart = wishlistBtn.querySelector('.heart');
            if (heart) heart.textContent = '♡';
            console.log('위시리스트 제거');
        }
    });

    console.log('✅ 위시리스트 초기화 완료');
}

// ✨ 위시리스트 버튼 초기화
function initWishlistButton(): void {
    const wishlistBtn = document.getElementById('addWishlistBtn');

    wishlistBtn?.addEventListener('click', () => {
        if (!currentBook) return;

        // 아이콘 토글
        if (wishlistBtn.textContent?.includes('♡')) {
            wishlistBtn.textContent = '♥ 위시리스트';
            console.log('위시리스트 추가:', currentBook.title);
            alert(`"${currentBook.title}"이(가) 위시리스트에 추가되었습니다.`);
        } else {
            wishlistBtn.textContent = '♡ 위시리스트';
            console.log('위시리스트 제거:', currentBook.title);
        }
    });

    console.log('✅ 위시리스트 버튼 초기화 완료');
}

/// ✨ 구매 모달 초기화
function initPurchaseModal(): void {
    const purchaseBtn = document.getElementById('purchaseBtn');
    const modal = document.getElementById('purchaseModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const storeItems = document.querySelectorAll('.store-item');

    // 모달 열기
    purchaseBtn?.addEventListener('click', () => {
        if (!currentBook) {
            alert('도서 정보를 불러오는 중입니다.');
            return;
        }
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    });

    // 모달 닫기
    const closeModal = () => {
        modal?.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복원
    };

    modalOverlay?.addEventListener('click', closeModal);
    modalCloseBtn?.addEventListener('click', closeModal);

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });

    // 서점 선택
    storeItems.forEach(item => {
        item.addEventListener('click', async () => {
            const store = item.getAttribute('data-store');
            if (!store || !currentBook) return;

            const storeName = item.querySelector('.store-name')?.textContent || store;

            // ✨ 클릭 추적 API 호출
            try {
                await fetch(`${API_BASE_URL}/books/${currentBook.id}/track-click`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ platform: store })
                });
                console.log(`✅ ${storeName} 클릭 추적 완료`);
            } catch (error) {
                console.error('클릭 추적 실패:', error);
            }

            // ✨ 제휴 링크로 이동
            const purchaseLinks = currentBook.purchase_links;
            let targetUrl: string | undefined;

            switch (store) {
                case 'coupang':
                    targetUrl = purchaseLinks?.coupang;
                    break;
                case 'aladin':
                    targetUrl = purchaseLinks?.aladin;
                    break;
                case 'yes24':
                    targetUrl = purchaseLinks?.yes24;
                    break;
                case 'kyobo':
                    targetUrl = purchaseLinks?.kyobo;
                    break;
            }

            if (targetUrl) {
                console.log(`🛒 ${storeName}로 이동:`, targetUrl);
                window.open(targetUrl, '_blank');
                closeModal();
            } else {
                alert(`${storeName} 링크를 준비 중입니다.`);
            }
        });
    });

    console.log('✅ 구매 모달 초기화 완료');
}

// ✨ AI 기능 드롭다운 초기화
function initAIDropdown(): void {
    const aiDropdownBtn = document.getElementById('aiDropdownBtn');
    const aiDropdownMenu = document.getElementById('aiDropdownMenu');
    const compareBtn = document.getElementById('compareBtn');
    const discussBtn = document.getElementById('discussBtn');

    // 드롭다운 토글
    aiDropdownBtn?.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        aiDropdownMenu?.classList.toggle('active');
        aiDropdownBtn.classList.toggle('active');
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.ai-dropdown')) {
            aiDropdownMenu?.classList.remove('active');
            aiDropdownBtn?.classList.remove('active');
        }
    });

    // 도서 비교 버튼
    compareBtn?.addEventListener('click', () => {
        if (!currentBook) {
            alert('도서 정보를 불러오는 중입니다.');
            return;
        }

        const bookData = encodeURIComponent(JSON.stringify({
            id: currentBook.id,
            title: currentBook.title,
            author: currentBook.author,
            cover_image: currentBook.cover_image,
            price: currentBook.price,
            rating: currentBook.rating
        }));

        window.location.href = `/compare.html?book=${bookData}`;
    });

    // AI 책토론 버튼
    discussBtn?.addEventListener('click', () => {
        if (!currentBook) {
            alert('도서 정보를 불러오는 중입니다.');
            return;
        }

        const bookData = encodeURIComponent(JSON.stringify({
            id: currentBook.id,
            title: currentBook.title,
            author: currentBook.author,
            cover_image: currentBook.cover_image,
            isbn: currentBook.isbn
        }));

        window.location.href = `/discuss.html?book=${bookData}`;
    });

    console.log('✅ AI 드롭다운 초기화 완료');
}

// 리뷰 작성
function initWriteReview(): void {
    const writeReviewBtn = document.getElementById('writeReviewBtn');

    writeReviewBtn?.addEventListener('click', (e: Event) => {
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
function initDetailSearch(): void {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    const handleSearch = () => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };

    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    });

    console.log('✅ 검색 기능 초기화 완료');
}

// 리뷰 도움됨
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
        });
    });

    console.log('✅ 리뷰 도움됨 초기화 완료');
}

// 추천 도서 로드 및 클릭
async function initRecommendedBooks(): Promise<void> {
    const bookId = getBookIdFromUrl();
    if (!bookId) return;

    try {
        // API 호출하여 관련 도서 가져오기
        const response = await fetch(`${API_BASE_URL}/books/${bookId}/related?limit=4`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
            renderRecommendedBooks(data.data);
        } else {
            console.log('관련 도서가 없습니다.');
        }
    } catch (error) {
        console.error('관련 도서 로드 실패:', error);
    }

    console.log('✅ 추천 도서 초기화 완료');
}

// 추천 도서 렌더링
function renderRecommendedBooks(books: BookData[]): void {
    const recommendedGrid = document.querySelector('.recommended-grid');
    if (!recommendedGrid) return;

    recommendedGrid.innerHTML = books.map(book => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover_image}" 
                     alt="${book.title}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'150\\' height=\\'220\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'150\\' height=\\'220\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\'%3E이미지 없음%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p class="price">${book.price.toLocaleString()}원</p>
            </div>
        </div>
    `).join('');

    // 클릭 이벤트 추가
    const bookCards = recommendedGrid.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id');
            if (bookId) {
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });
}

// 메인 초기화
function initBookDetail(): void {
    console.log('🎬 ChaekMate Book Detail 초기화 시작...');

    loadBookData();
    initTabs();
    initWishlist();
    initPurchaseModal();
    initWishlistButton();
    initAIDropdown();
    initWriteReview();
    initReviewHelpful();
    initRecommendedBooks();
    initDetailSearch();

    console.log('✨ ChaekMate Book Detail 초기화 완료!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookDetail);
} else {
    initBookDetail();
}