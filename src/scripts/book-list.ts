// 도서 인터페이스
interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    year: number;
    rating: number;
    price: number;
    coverImage: string;
}

// 카테고리 정보
interface CategoryInfo {
    name: string;
    description: string;
}

// 카테고리 매핑
const categories: Record<string, CategoryInfo> = {
    'novel': {
        name: '소설',
        description: '다양한 감동과 이야기가 담긴 소설 작품들'
    },
    'essay': {
        name: '에세이',
        description: '작가의 생각과 감성이 담긴 에세이 모음'
    },
    'self-improvement': {
        name: '자기계발',
        description: '더 나은 자신을 위한 성장의 책들'
    },
    'economics': {
        name: '경제경영',
        description: '비즈니스와 경제를 이해하는 필독서'
    },
    'humanities': {
        name: '인문',
        description: '인간과 세상에 대한 깊이 있는 통찰'
    },
    'science': {
        name: '과학',
        description: '세상을 이해하는 과학적 지식'
    }
};

// 더미 도서 데이터
const dummyBooks: Book[] = [
    {
        id: 1,
        title: '채식주의자',
        author: '한강',
        publisher: '창비',
        year: 2007,
        rating: 4.2,
        price: 12600,
        coverImage: 'https://via.placeholder.com/180x260?text=채식주의자'
    },
    {
        id: 2,
        title: '82년생 김지영',
        author: '조남주',
        publisher: '민음사',
        year: 2016,
        rating: 4.5,
        price: 13800,
        coverImage: 'https://via.placeholder.com/180x260?text=82년생+김지영'
    },
    {
        id: 3,
        title: '달러구트 꿈 백화점',
        author: '이미예',
        publisher: '팩토리나인',
        year: 2020,
        rating: 4.8,
        price: 14400,
        coverImage: 'https://via.placeholder.com/180x260?text=달러구트'
    },
    {
        id: 4,
        title: '미드나잇 라이브러리',
        author: '매트 헤이그',
        publisher: '인플루엔셜',
        year: 2021,
        rating: 4.3,
        price: 15120,
        coverImage: 'https://via.placeholder.com/180x260?text=미드나잇'
    }
];

// 별점 렌더링
function renderStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// 도서 카드 생성
function createBookCard(book: Book): string {
    return `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.coverImage}" alt="${book.title}">
                <div class="book-overlay">
                    <button class="quick-view-btn">미리보기</button>
                </div>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-publisher">${book.publisher} · ${book.year}</p>
                <div class="book-rating">
                    <span class="stars">${renderStars(book.rating)}</span>
                    <span class="rating-score">${book.rating}</span>
                </div>
                <p class="book-price">${book.price.toLocaleString()}원</p>
            </div>
        </div>
    `;
}

// 검색 기능
function initBookListSearch(): void {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    if (searchBtn && searchOverlay && searchClose && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        });

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                console.log('검색:', searchInput.value);
                // TODO: 실제 검색 API 연동
                window.location.href = `/search.html?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
    }

    console.log('✅ 검색 기능 초기화 완료');
}

// 정렬 필터
function initSortFilter(): void {
    const sortFilter = document.getElementById('sortFilter') as HTMLSelectElement;
    
    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            const sortType = sortFilter.value;
            console.log('정렬 기준:', sortType);
            // TODO: 정렬 로직 구현
        });
    }

    console.log('✅ 정렬 필터 초기화 완료');
}

// 카테고리 정보 설정
function setCategoryInfo(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'novel';
    
    const categoryInfo: CategoryInfo = (categories[category] || categories['novel']) as CategoryInfo;
    
    const titleElement = document.getElementById('categoryTitle');
    const descriptionElement = document.getElementById('categoryDescription');
    
    if (titleElement) {
        titleElement.textContent = categoryInfo.name;
    }
    
    if (descriptionElement) {
        descriptionElement.textContent = categoryInfo.description;
    }
    
    document.title = `${categoryInfo.name} - ChaekMate`;

    console.log('✅ 카테고리 정보 설정 완료:', categoryInfo.name);
}

// 도서 목록 로드
function loadBooks(): void {
    const bookGrid = document.getElementById('bookGrid');
    
    if (bookGrid) {
        // 기존 카드 제거 (초기 더미 데이터)
        bookGrid.innerHTML = '';
        
        // 더미 데이터로 카드 생성
        dummyBooks.forEach(book => {
            bookGrid.innerHTML += createBookCard(book);
        });
        
        // ✅ 추가: 카드 생성 후 클릭 이벤트 등록
        attachBookCardEvents();
        
        // TODO: 실제 API에서 데이터 가져오기
        // const category = new URLSearchParams(window.location.search).get('category');
        // fetch(`/api/books?category=${category}`)
        //     .then(response => response.json())
        //     .then(books => {
        //         books.forEach(book => {
        //             bookGrid.innerHTML += createBookCard(book);
        //         });
        //         attachBookCardEvents();
        //     });
    }

    console.log('✅ 도서 목록 로드 완료');
}

// 더보기 버튼
function initLoadMore(): void {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            console.log('더 많은 도서 로드');
            // TODO: 페이지네이션 구현
            // 현재는 더미 데이터 추가
            const bookGrid = document.getElementById('bookGrid');
            if (bookGrid) {
                dummyBooks.forEach(book => {
                    bookGrid.innerHTML += createBookCard(book);
                });
                
                // ✅ 추가: 새로 생성된 카드에도 이벤트 등록
                attachBookCardEvents();
            }
        });
    }

    console.log('✅ 더보기 버튼 초기화 완료');
}

// ✅ 수정: 도서 카드에 클릭 이벤트 등록 (개선된 방식)
function attachBookCardEvents(): void {
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        // 이미 이벤트가 등록되어 있는지 확인
        if (card.getAttribute('data-event-attached') === 'true') {
            return;
        }
        
        // 이벤트 등록 표시
        card.setAttribute('data-event-attached', 'true');
        
        // 미리보기 버튼 클릭
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                const bookId = card.getAttribute('data-book-id');
                console.log('미리보기:', bookId);
                // TODO: 미리보기 모달 표시
                alert('미리보기 기능은 준비 중입니다.');
            });
        }
        
        // 카드 전체 클릭 - 상세 페이지 이동
        card.addEventListener('click', () => {
            const bookId = card.getAttribute('data-book-id');
            
            if (bookId) {
                console.log('도서 상세로 이동:', bookId);
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        });
    });

    console.log('✅ 도서 카드 이벤트 등록 완료:', bookCards.length, '개');
}

// ✅ 대안: 이벤트 위임 방식 (더 효율적)
function initBookCardClickDelegation(): void {
    const bookGrid = document.getElementById('bookGrid');
    
    if (!bookGrid) return;
    
    bookGrid.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        
        // 미리보기 버튼 클릭
        if (target.classList.contains('quick-view-btn')) {
            e.stopPropagation();
            const bookCard = target.closest('.book-card');
            const bookId = bookCard?.getAttribute('data-book-id');
            console.log('미리보기:', bookId);
            alert('미리보기 기능은 준비 중입니다.');
            return;
        }
        
        // 도서 카드 클릭
        const bookCard = target.closest('.book-card');
        if (bookCard) {
            const bookId = bookCard.getAttribute('data-book-id');
            if (bookId) {
                console.log('도서 상세로 이동:', bookId);
                window.location.href = `/book-detail.html?id=${bookId}`;
            }
        }
    });

    console.log('✅ 도서 카드 클릭 이벤트 위임 완료');
}

// 메인 초기화 함수
function initBookList(): void {
    console.log('📚 ChaekMate Book List 로드 완료!');
    
    // 카테고리 정보 설정
    setCategoryInfo();
    
    // 도서 목록 로드
    loadBooks();
    
    // 검색 기능 초기화
    initBookListSearch();
    
    // 정렬 필터 초기화
    initSortFilter();
    
    // 더보기 버튼 초기화
    initLoadMore();
    
    // ✅ 방법 1: 각 카드에 개별 이벤트 등록 (이미 loadBooks()에서 호출됨)
    // attachBookCardEvents();
    
    // ✅ 방법 2: 이벤트 위임 방식 (권장)
    // 더 효율적이고 동적으로 추가되는 카드에도 자동 적용
    initBookCardClickDelegation();
    
    console.log('✨ ChaekMate Book List 초기화 완료!');
}

// DOM 로드 완료 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookList);
} else {
    initBookList();
}

export { initBookList };