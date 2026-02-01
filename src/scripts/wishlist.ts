// API Base URL 설정
const API_BASE_URL = 'http://localhost:8000/api/v1';

// 인증 헤더 생성 함수
function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// 위시리스트 타입 정의
interface WishlistItem {
    id: number;
    book_id: number;
    title: string;
    author: string;
    publisher: string;
    price: number;
    image_url: string;
    description?: string;
}

// 기본 이미지
const DEFAULT_IMAGE = 'https://via.placeholder.com/150x220/e0e0e0/999999?text=No+Image';

interface BookStore {
    store: string;
    url: string;
}

// 전역 상태
let wishlistItems: WishlistItem[] = [];
let selectedBook: WishlistItem | null = null;

// DOM 요소
const emptyWishlist = document.getElementById('emptyWishlist') as HTMLElement;
const wishlistContent = document.getElementById('wishlistContent') as HTMLElement;
const wishlistItemsContainer = document.getElementById('wishlistItems') as HTMLElement;
const totalCountElement = document.getElementById('totalCount') as HTMLElement;
const deleteSelectedBtn = document.getElementById('deleteSelected') as HTMLElement;
const recommendedGrid = document.getElementById('recommendedGrid') as HTMLElement;

// 모달 요소
const purchaseModal = document.getElementById('purchaseModal') as HTMLElement;
const modalOverlay = document.getElementById('modalOverlay') as HTMLElement;
const modalCloseBtn = document.getElementById('modalCloseBtn') as HTMLElement;
const selectedBookInfo = document.getElementById('selectedBookInfo') as HTMLElement;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadWishlist();
    loadRecommendedBooks();
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 선택 삭제 버튼
    deleteSelectedBtn?.addEventListener('click', deleteSelectedItems);

    // 모달 닫기
    modalCloseBtn?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // 서점 버튼 클릭
    const storeButtons = document.querySelectorAll('.store-item');
    storeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const store = target.dataset.store;
            if (store && selectedBook) {
                handleStorePurchase(store, selectedBook);
            }
        });
    });
}

// 위시리스트 불러오기
async function loadWishlist() {
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('위시리스트를 불러올 수 없습니다');
        }

        const data = await response.json();
        wishlistItems = data.items || [];

        if (wishlistItems.length === 0) {
            showEmptyState();
        } else {
            renderWishlist();
        }
    } catch (error) {
        console.error('위시리스트 로딩 실패:', error);
        showEmptyState();
    }
}

// 빈 상태 표시
function showEmptyState() {
    if (emptyWishlist && wishlistContent) {
        emptyWishlist.style.display = 'block';
        wishlistContent.style.display = 'none';
    }
}

// 위시리스트 렌더링
function renderWishlist() {
    if (!wishlistItemsContainer || !totalCountElement) return;

    if (emptyWishlist && wishlistContent) {
        emptyWishlist.style.display = 'none';
        wishlistContent.style.display = 'block';
    }

    totalCountElement.textContent = wishlistItems.length.toString();

    wishlistItemsContainer.innerHTML = wishlistItems.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <input type="checkbox" class="item-checkbox" data-id="${item.id}">
            
            <div class="item-image" data-book-id="${item.book_id}">
                <img src="${item.image_url || DEFAULT_IMAGE}" 
                     alt="${item.title}">
            </div>

            <div class="item-info" data-book-id="${item.book_id}">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-author">${item.author} · ${item.publisher}</p>
                ${item.description ? `<p class="item-description">${truncateText(item.description, 100)}</p>` : ''}
                <p class="item-price">${formatPrice(item.price)}</p>
            </div>

            <div class="item-actions">
                <button class="btn-purchase" data-id="${item.id}">
                    구매하기
                </button>
                <button class="btn-delete" data-id="${item.id}">
                    ✕
                </button>
            </div>
        </div>
    `).join('');

    // 아이템별 이벤트 리스너 추가
    attachItemEventListeners();
}

// 아이템 이벤트 리스너 연결
function attachItemEventListeners() {
    // 구매 버튼
    const purchaseButtons = document.querySelectorAll('.btn-purchase');
    purchaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt((e.currentTarget as HTMLElement).dataset.id || '0');
            const item = wishlistItems.find(item => item.id === id);
            if (item) {
                openPurchaseModal(item);
            }
        });
    });

    // 삭제 버튼
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt((e.currentTarget as HTMLElement).dataset.id || '0');
            deleteItem(id);
        });
    });

    // 이미지/정보 클릭 시 상세 페이지로
    const clickableElements = document.querySelectorAll('.item-image, .item-info');
    clickableElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const bookId = parseInt((e.currentTarget as HTMLElement).dataset.bookId || '0');
            if (bookId) {
                window.location.href = `/book/${bookId}`;
            }
        });
    });
}

// 선택된 아이템 삭제
async function deleteSelectedItems() {
    const checkboxes = document.querySelectorAll('.item-checkbox:checked') as NodeListOf<HTMLInputElement>;
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id || '0'));

    if (selectedIds.length === 0) {
        alert('삭제할 항목을 선택해주세요');
        return;
    }

    if (!confirm(`${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/wishlist/batch-delete`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ids: selectedIds })
        });

        if (!response.ok) {
            throw new Error('삭제 실패');
        }

        // 로컬 상태 업데이트
        wishlistItems = wishlistItems.filter(item => selectedIds.indexOf(item.id) === -1);
        
        if (wishlistItems.length === 0) {
            showEmptyState();
        } else {
            renderWishlist();
        }

    } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다');
    }
}

// 단일 아이템 삭제
async function deleteItem(id: number) {
    if (!confirm('위시리스트에서 삭제하시겠습니까?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('삭제 실패');
        }

        wishlistItems = wishlistItems.filter(item => item.id !== id);
        
        if (wishlistItems.length === 0) {
            showEmptyState();
        } else {
            renderWishlist();
        }

    } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다');
    }
}

// 구매 모달 열기
function openPurchaseModal(item: WishlistItem) {
    selectedBook = item;

    // 선택된 도서 정보 표시
    if (selectedBookInfo) {
        selectedBookInfo.innerHTML = `
            <img src="${item.image_url || DEFAULT_IMAGE}" 
                 alt="${item.title}">
            <div class="selected-book-details">
                <h3>${item.title}</h3>
                <p>${item.author} · ${item.publisher}</p>
                <p style="font-weight: 700; color: #000; margin-top: 8px;">${formatPrice(item.price)}</p>
            </div>
        `;
    }

    purchaseModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeModal() {
    purchaseModal?.classList.remove('active');
    document.body.style.overflow = '';
    selectedBook = null;
}

// 서점 구매 처리
async function handleStorePurchase(store: string, book: WishlistItem) {
    try {
        // 구매 클릭 이벤트 기록 (애널리틱스용)
        await fetch(`${API_BASE_URL}/analytics/purchase-click`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                book_id: book.book_id,
                store: store,
                source: 'wishlist'
            })
        });

        // 서점 URL 가져오기
        const response = await fetch(`${API_BASE_URL}/books/${book.book_id}/store-link?store=${store}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('링크를 가져올 수 없습니다');
        }

        const data = await response.json();
        
        if (data.url) {
            // 새 창에서 서점 열기
            window.open(data.url, '_blank', 'noopener,noreferrer');
            closeModal();
        } else {
            alert('해당 서점의 링크를 찾을 수 없습니다');
        }

    } catch (error) {
        console.error('구매 처리 실패:', error);
        alert('구매 페이지로 이동할 수 없습니다');
    }
}

// 추천 도서 불러오기
async function loadRecommendedBooks() {
    if (!recommendedGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/books/random?limit=8`);

        if (!response.ok) {
            throw new Error('추천 도서를 불러올 수 없습니다');
        }

        const data = await response.json();
        renderRecommendedBooks(data.books || []);

    } catch (error) {
        console.error('추천 도서 로딩 실패:', error);
        recommendedGrid.innerHTML = '<p style="text-align: center; color: #666;">추천 도서를 불러올 수 없습니다</p>';
    }
}

// 추천 도서 렌더링
function renderRecommendedBooks(books: any[]) {
    if (!recommendedGrid) return;

    recommendedGrid.innerHTML = books.map(book => `
        <div class="recommended-item" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover_image || DEFAULT_IMAGE}" 
                     alt="${book.title}">
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p class="price">${formatPrice(book.price)}</p>
                <button class="btn-add-wishlist" data-book-id="${book.id}">
                    위시리스트 담기
                </button>
            </div>
        </div>
    `).join('');

    // 추천 도서 이벤트 리스너
    const recommendedItems = document.querySelectorAll('.recommended-item');
    recommendedItems.forEach(item => {
        const bookCover = item.querySelector('.book-cover');
        const bookInfo = item.querySelector('.book-info h3, .book-info p:not(.price)');
        
        bookCover?.addEventListener('click', () => {
            const bookId = (item as HTMLElement).dataset.bookId;
            if (bookId) {
                window.location.href = `/book/${bookId}`;
            }
        });

        bookInfo?.addEventListener('click', () => {
            const bookId = (item as HTMLElement).dataset.bookId;
            if (bookId) {
                window.location.href = `/book/${bookId}`;
            }
        });
    });

    const wishlistButtons = document.querySelectorAll('.btn-add-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            const bookId = parseInt((e.currentTarget as HTMLElement).dataset.bookId || '0');
            await addToWishlist(bookId, e.currentTarget as HTMLElement);
        });
    });
}

// 위시리스트에 추가
async function addToWishlist(bookId: number, button: HTMLElement) {
    try {
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ book_id: bookId })
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('로그인이 필요합니다');
                window.location.href = '/login';
                return;
            }
            throw new Error('위시리스트 추가 실패');
        }

        button.textContent = '✓ 추가됨';
        button.style.backgroundColor = '#000';
        button.style.color = '#fff';
        
        setTimeout(() => {
            button.textContent = '위시리스트 담기';
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 2000);

        // 위시리스트 새로고침
        loadWishlist();

    } catch (error) {
        console.error('위시리스트 추가 실패:', error);
        alert('위시리스트에 추가할 수 없습니다');
    }
}

// 유틸리티 함수: 가격 포맷
function formatPrice(price: number): string {
    return `${price.toLocaleString()}원`;
}

// 유틸리티 함수: 텍스트 자르기
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && purchaseModal?.classList.contains('active')) {
        closeModal();
    }
});