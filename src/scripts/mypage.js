console.log('👤 ChaekMate MyPage 로드 완료!');
// ==================== 탭 전환 ====================
function initTabs() {
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');
            // 모든 메뉴 아이템 비활성화
            menuItems.forEach(menu => menu.classList.remove('active'));
            // 모든 탭 컨텐츠 숨기기
            tabContents.forEach(tab => tab.classList.remove('active'));
            // 클릭한 메뉴 활성화
            item.classList.add('active');
            // 해당 탭 표시
            const targetTab = document.getElementById(`${tabName}Tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
    console.log('✅ 탭 전환 초기화 완료');
}
// ==================== 검색 기능 ====================
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput');
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', () => {
        const keyword = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
        if (keyword) {
            console.log('검색:', keyword);
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    });
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.dispatchEvent(new Event('click'));
        }
    });
    console.log('✅ 검색 기능 초기화 완료');
}
// ==================== 로그아웃 ====================
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn === null || logoutBtn === void 0 ? void 0 : logoutBtn.addEventListener('click', () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            console.log('로그아웃');
            // TODO: 로그아웃 처리
            window.location.href = '/login.html';
        }
    });
    console.log('✅ 로그아웃 초기화 완료');
}
// ==================== 프로필 수정 ====================
function initProfileEdit() {
    const form = document.querySelector('.profile-form');
    const inputs = form === null || form === void 0 ? void 0 : form.querySelectorAll('input:not([readonly])');
    const btnPrimary = form === null || form === void 0 ? void 0 : form.querySelector('.btn-primary');
    const btnSecondary = form === null || form === void 0 ? void 0 : form.querySelector('.btn-secondary');
    // 원본 데이터 저장
    const originalValues = new Map();
    inputs === null || inputs === void 0 ? void 0 : inputs.forEach(input => {
        const inputElement = input;
        originalValues.set(inputElement, inputElement.value);
    });
    btnPrimary === null || btnPrimary === void 0 ? void 0 : btnPrimary.addEventListener('click', () => {
        const updates = {};
        inputs === null || inputs === void 0 ? void 0 : inputs.forEach(input => {
            var _a;
            const inputElement = input;
            const label = (_a = inputElement.previousElementSibling) === null || _a === void 0 ? void 0 : _a.textContent;
            updates[label || ''] = inputElement.value;
        });
        console.log('프로필 수정:', updates);
        alert('프로필이 수정되었습니다.');
        // TODO: API 호출
    });
    btnSecondary === null || btnSecondary === void 0 ? void 0 : btnSecondary.addEventListener('click', () => {
        // 원본 값으로 복원
        inputs === null || inputs === void 0 ? void 0 : inputs.forEach(input => {
            const inputElement = input;
            const originalValue = originalValues.get(inputElement);
            if (originalValue !== undefined) {
                inputElement.value = originalValue;
            }
        });
    });
    console.log('✅ 프로필 수정 초기화 완료');
}
// ==================== 주문 내역 ====================
function initOrders() {
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        // ✅ 수정: 클래스명으로 정확히 선택
        const trackBtn = item.querySelector('.btn-track');
        const reviewBtn = item.querySelector('.btn-review-write');
        const bookImage = item.querySelector('.book-image');
        // 배송 조회
        trackBtn === null || trackBtn === void 0 ? void 0 : trackBtn.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            const orderNumber = (_a = item.querySelector('.order-number')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('배송 조회:', orderNumber);
            alert('배송 조회 기능은 준비 중입니다.');
            // TODO: 배송 조회 페이지로 이동
        });
        // ✅ 수정: 리뷰 작성 - 실제 페이지 이동
        reviewBtn === null || reviewBtn === void 0 ? void 0 : reviewBtn.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            // data 속성에서 bookId 가져오기
            const bookId = reviewBtn.getAttribute('data-book-id') ||
                item.getAttribute('data-book-id') || '1';
            const bookTitle = (_a = item.querySelector('.book-info h3')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('리뷰 작성:', { bookId, bookTitle });
            // 리뷰 작성 페이지로 이동
            window.location.href = `/review-write.html?bookId=${bookId}`;
        });
        // 책 이미지 클릭 시 상세 페이지로 이동
        bookImage === null || bookImage === void 0 ? void 0 : bookImage.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = item.getAttribute('data-book-id') || '1';
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
    });
    console.log('✅ 주문 내역 초기화 완료');
}
// ==================== 리뷰 관리 ====================
function initReviews() {
    const reviewItems = document.querySelectorAll('.review-item');
    reviewItems.forEach(item => {
        // ✅ 수정: 클래스명으로 정확히 선택
        const editBtn = item.querySelector('.btn-edit');
        const deleteBtn = item.querySelector('.btn-delete');
        // ✅ 수정: 리뷰 수정 - 실제 페이지 이동
        editBtn === null || editBtn === void 0 ? void 0 : editBtn.addEventListener('click', () => {
            var _a;
            // data 속성에서 ID 가져오기
            const bookId = editBtn.getAttribute('data-book-id') ||
                item.getAttribute('data-book-id') || '1';
            const reviewId = editBtn.getAttribute('data-review-id') ||
                item.getAttribute('data-review-id');
            const bookTitle = (_a = item.querySelector('.book-title')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('리뷰 수정:', { bookId, reviewId, bookTitle });
            // 리뷰 수정 페이지로 이동
            window.location.href = `/review-write.html?bookId=${bookId}&reviewId=${reviewId}`;
        });
        // 리뷰 삭제
        deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener('click', async () => {
            var _a;
            const reviewId = deleteBtn.getAttribute('data-review-id') ||
                item.getAttribute('data-review-id');
            const bookTitle = (_a = item.querySelector('.book-title')) === null || _a === void 0 ? void 0 : _a.textContent;
            if (confirm(`"${bookTitle}" 리뷰를 삭제하시겠습니까?`)) {
                console.log('리뷰 삭제:', reviewId);
                try {
                    // TODO: API 호출
                    // await deleteReview(reviewId);
                    item.remove();
                    alert('리뷰가 삭제되었습니다.');
                }
                catch (error) {
                    console.error('리뷰 삭제 오류:', error);
                    alert('리뷰 삭제 중 오류가 발생했습니다.');
                }
            }
        });
    });
    console.log('✅ 리뷰 관리 초기화 완료');
}
// ==================== 위시리스트 ====================
function initWishlist() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    wishlistItems.forEach(item => {
        const bookCover = item.querySelector('.book-cover');
        const removeBtn = item.querySelector('.remove-btn');
        const cartBtn = item.querySelector('.btn-cart');
        // 책 표지 클릭 시 상세 페이지로 이동
        bookCover === null || bookCover === void 0 ? void 0 : bookCover.addEventListener('click', () => {
            const bookId = item.getAttribute('data-book-id') || '1';
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
        // 위시리스트에서 제거
        removeBtn === null || removeBtn === void 0 ? void 0 : removeBtn.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            const bookTitle = (_a = item.querySelector('h3')) === null || _a === void 0 ? void 0 : _a.textContent;
            if (confirm(`"${bookTitle}"을(를) 위시리스트에서 제거하시겠습니까?`)) {
                item.remove();
                console.log('위시리스트 제거:', bookTitle);
                // TODO: API 호출
            }
        });
        // 장바구니 담기
        cartBtn === null || cartBtn === void 0 ? void 0 : cartBtn.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            const bookTitle = (_a = item.querySelector('h3')) === null || _a === void 0 ? void 0 : _a.textContent;
            alert(`"${bookTitle}"이(가) 장바구니에 담겼습니다.`);
            console.log('장바구니 담기:', bookTitle);
            // TODO: API 호출
        });
    });
    console.log('✅ 위시리스트 초기화 완료');
}
// ==================== 독서 기록 ====================
function initReading() {
    const readingItems = document.querySelectorAll('.reading-item');
    readingItems.forEach(item => {
        item.addEventListener('click', () => {
            var _a;
            const bookTitle = (_a = item.querySelector('h4')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('독서 기록 상세:', bookTitle);
            alert('독서 기록 상세 페이지는 준비 중입니다.');
            // TODO: 독서 기록 상세 페이지로 이동
        });
    });
    console.log('✅ 독서 기록 초기화 완료');
}
// ==================== 설정 ====================
function initSettings() {
    const checkboxes = document.querySelectorAll('.setting-item input[type="checkbox"]');
    const passwordBtn = document.querySelector('.settings-section .btn-outline');
    const deleteAccountBtn = document.querySelector('.settings-section .btn-danger');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            var _a;
            const target = e.target;
            const label = (_a = target.nextElementSibling) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log(`${label}: ${target.checked}`);
            // TODO: API 호출
        });
    });
    passwordBtn === null || passwordBtn === void 0 ? void 0 : passwordBtn.addEventListener('click', () => {
        console.log('비밀번호 변경');
        // ✅ 수정: 비밀번호 찾기 페이지로 이동
        window.location.href = '/find-password.html';
    });
    deleteAccountBtn === null || deleteAccountBtn === void 0 ? void 0 : deleteAccountBtn.addEventListener('click', () => {
        if (confirm('정말로 회원 탈퇴하시겠습니까?\n탈퇴 후 모든 정보가 삭제되며 복구할 수 없습니다.')) {
            console.log('회원 탈퇴');
            alert('회원 탈퇴 기능은 준비 중입니다.');
            // TODO: 회원 탈퇴 처리
        }
    });
    console.log('✅ 설정 초기화 완료');
}
// ==================== URL 해시 처리 ====================
function handleUrlHash() {
    const hash = window.location.hash.substring(1); // # 제거
    if (hash) {
        const menuItem = document.querySelector(`[data-tab="${hash}"]`);
        if (menuItem) {
            menuItem.click();
        }
    }
}
// ==================== 메인 초기화 ====================
function initMyPage() {
    console.log('🎬 ChaekMate MyPage 초기화 시작...');
    initTabs();
    initSearch();
    initLogout();
    initProfileEdit();
    initOrders();
    initReviews();
    initWishlist();
    initReading();
    initSettings();
    handleUrlHash();
    console.log('✨ ChaekMate MyPage 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMyPage);
}
else {
    initMyPage();
}
export { initMyPage };
