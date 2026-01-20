console.log('✍️ ChaekMate Review Write 로드 완료!');
let currentRating = 0;
let isEditMode = false;
let reviewId = null;
// ==================== 초기화 ====================
function initReviewWrite() {
    console.log('🎬 ChaekMate Review Write 초기화 시작...');
    checkEditMode();
    initSearch();
    initStarRating();
    initCharCounter();
    initFormValidation();
    initPreview();
    initButtons();
    loadBookInfo();
    console.log('✨ ChaekMate Review Write 초기화 완료!');
}
// ==================== 수정 모드 체크 ====================
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    reviewId = urlParams.get('reviewId');
    if (reviewId) {
        isEditMode = true;
        const pageTitle = document.getElementById('pageTitle');
        const submitBtn = document.getElementById('submitBtn');
        if (pageTitle)
            pageTitle.textContent = '리뷰 수정';
        if (submitBtn)
            submitBtn.textContent = '수정하기';
        loadReviewData(reviewId);
        console.log('수정 모드:', reviewId);
    }
}
// ==================== 검색 기능 ====================
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const handleSearch = () => {
        const keyword = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', handleSearch);
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}
// ==================== 별점 입력 ====================
function initStarRating() {
    const starBtns = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('rating');
    const ratingText = document.getElementById('ratingText');
    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = parseInt(btn.getAttribute('data-rating') || '0');
            currentRating = rating;
            if (ratingInput)
                ratingInput.value = rating.toString();
            // 별 표시 업데이트
            starBtns.forEach((star, index) => {
                if (index < rating) {
                    star.textContent = '★';
                    star.classList.add('active');
                }
                else {
                    star.textContent = '☆';
                    star.classList.remove('active');
                }
            });
            // 텍스트 업데이트
            if (ratingText) {
                const texts = ['', '별로예요', '그저 그래요', '괜찮아요', '좋아요', '최고예요!'];
                ratingText.textContent = texts[rating] || '';
            }
            console.log('별점 선택:', rating);
        });
    });
}
// ==================== 글자 수 카운터 ====================
function initCharCounter() {
    const titleInput = document.getElementById('reviewTitle');
    const contentTextarea = document.getElementById('reviewContent');
    const titleCount = document.getElementById('titleCount');
    const contentCount = document.getElementById('contentCount');
    const minText = document.getElementById('minText');
    titleInput === null || titleInput === void 0 ? void 0 : titleInput.addEventListener('input', () => {
        const length = titleInput.value.length;
        if (titleCount)
            titleCount.textContent = length.toString();
    });
    contentTextarea === null || contentTextarea === void 0 ? void 0 : contentTextarea.addEventListener('input', () => {
        const length = contentTextarea.value.length;
        if (contentCount) {
            contentCount.textContent = length.toString();
            if (length < 20) {
                contentCount.classList.add('error');
                minText === null || minText === void 0 ? void 0 : minText.classList.add('error');
            }
            else {
                contentCount.classList.remove('error');
                minText === null || minText === void 0 ? void 0 : minText.classList.remove('error');
            }
        }
    });
}
// ==================== 폼 유효성 검사 ====================
function initFormValidation() {
    const reviewForm = document.getElementById('reviewForm');
    reviewForm === null || reviewForm === void 0 ? void 0 : reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // 별점 체크
        if (currentRating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }
        // 제목 체크
        const titleInput = document.getElementById('reviewTitle');
        if (!titleInput.value.trim()) {
            alert('제목을 입력해주세요.');
            titleInput.focus();
            return;
        }
        // 내용 체크
        const contentTextarea = document.getElementById('reviewContent');
        const content = contentTextarea.value.trim();
        if (!content) {
            alert('리뷰 내용을 입력해주세요.');
            contentTextarea.focus();
            return;
        }
        if (content.length < 20) {
            alert('리뷰 내용은 최소 20자 이상 작성해주세요.');
            contentTextarea.focus();
            return;
        }
        // 폼 데이터 수집
        const formData = collectFormData();
        console.log('제출 데이터:', formData);
        // API 호출
        try {
            if (isEditMode) {
                // 수정
                await updateReview(reviewId, formData);
                alert('리뷰가 수정되었습니다.');
            }
            else {
                // 등록
                await createReview(formData);
                alert('리뷰가 등록되었습니다.');
            }
            // 도서 상세 페이지로 이동
            const bookId = new URLSearchParams(window.location.search).get('bookId') || '1';
            window.location.href = `/book-detail.html?id=${bookId}`;
        }
        catch (error) {
            console.error('리뷰 제출 오류:', error);
            alert('리뷰 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
}
// ==================== 폼 데이터 수집 ====================
function collectFormData() {
    const titleInput = document.getElementById('reviewTitle');
    const contentTextarea = document.getElementById('reviewContent');
    const prosTextarea = document.getElementById('reviewPros');
    const consTextarea = document.getElementById('reviewCons');
    const spoilerCheck = document.getElementById('hasSpoiler');
    // 추천 대상
    const recommendCheckboxes = document.querySelectorAll('input[name="recommend"]:checked');
    const recommendTo = Array.from(recommendCheckboxes).map(cb => cb.value);
    // 공개 설정
    const visibilityRadio = document.querySelector('input[name="visibility"]:checked');
    const bookId = new URLSearchParams(window.location.search).get('bookId') || '1';
    return {
        bookId,
        rating: currentRating,
        title: titleInput.value.trim(),
        content: contentTextarea.value.trim(),
        pros: prosTextarea.value.trim() || null,
        cons: consTextarea.value.trim() || null,
        recommendTo,
        hasSpoiler: spoilerCheck.checked,
        visibility: (visibilityRadio === null || visibilityRadio === void 0 ? void 0 : visibilityRadio.value) || 'public',
        createdAt: new Date().toISOString()
    };
}
// ==================== 미리보기 ====================
function initPreview() {
    const previewBtn = document.getElementById('previewBtn');
    const modal = document.getElementById('previewModal');
    const closeModal = document.getElementById('closeModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const previewContent = document.getElementById('previewContent');
    previewBtn === null || previewBtn === void 0 ? void 0 : previewBtn.addEventListener('click', () => {
        // 유효성 검사
        if (currentRating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }
        const titleInput = document.getElementById('reviewTitle');
        const contentTextarea = document.getElementById('reviewContent');
        if (!titleInput.value.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!contentTextarea.value.trim() || contentTextarea.value.length < 20) {
            alert('리뷰 내용은 최소 20자 이상 작성해주세요.');
            return;
        }
        // 미리보기 생성
        generatePreview();
        // 모달 열기
        modal === null || modal === void 0 ? void 0 : modal.classList.add('active');
    });
    // 모달 닫기
    closeModal === null || closeModal === void 0 ? void 0 : closeModal.addEventListener('click', () => {
        modal === null || modal === void 0 ? void 0 : modal.classList.remove('active');
    });
    closePreviewBtn === null || closePreviewBtn === void 0 ? void 0 : closePreviewBtn.addEventListener('click', () => {
        modal === null || modal === void 0 ? void 0 : modal.classList.remove('active');
    });
    // 모달 배경 클릭 시 닫기
    modal === null || modal === void 0 ? void 0 : modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}
// ==================== 미리보기 생성 ====================
function generatePreview() {
    const previewContent = document.getElementById('previewContent');
    if (!previewContent)
        return;
    const formData = collectFormData();
    const stars = '★'.repeat(formData.rating) + '☆'.repeat(5 - formData.rating);
    const recommendTags = formData.recommendTo.map((tag) => {
        const tagMap = {
            'beginner': '입문자',
            'student': '학생',
            'worker': '직장인',
            'professional': '전문가',
            'general': '일반 독자'
        };
        return `<span class="preview-tag">${tagMap[tag]}</span>`;
    }).join('');
    let html = `
        <div class="preview-rating">${stars} ${formData.rating}.0</div>
        <h3 class="preview-title">${formData.title}</h3>
    `;
    if (formData.hasSpoiler) {
        html += `<div class="preview-spoiler">⚠️ 이 리뷰에는 스포일러가 포함되어 있습니다</div>`;
    }
    html += `<div class="preview-content">${formData.content}</div>`;
    if (formData.pros) {
        html += `
            <div class="preview-section">
                <h4>👍 좋았던 점</h4>
                <p>${formData.pros}</p>
            </div>
        `;
    }
    if (formData.cons) {
        html += `
            <div class="preview-section">
                <h4>👎 아쉬운 점</h4>
                <p>${formData.cons}</p>
            </div>
        `;
    }
    if (formData.recommendTo.length > 0) {
        html += `
            <div class="preview-section">
                <h4>💡 추천 대상</h4>
                <div class="preview-tags">${recommendTags}</div>
            </div>
        `;
    }
    previewContent.innerHTML = html;
}
// ==================== 버튼 이벤트 ====================
function initButtons() {
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', () => {
        if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
            const bookId = new URLSearchParams(window.location.search).get('bookId') || '1';
            window.location.href = `/book-detail.html?id=${bookId}`;
        }
    });
}
// ==================== 도서 정보 로드 ====================
function loadBookInfo() {
    const bookId = new URLSearchParams(window.location.search).get('bookId');
    // TODO: API 호출하여 도서 정보 가져오기
    // const bookData = await fetch(`/api/books/${bookId}`);
    // 더미 데이터
    const bookTitle = document.getElementById('bookTitle');
    const bookAuthor = document.getElementById('bookAuthor');
    const bookPublisher = document.getElementById('bookPublisher');
    if (bookTitle)
        bookTitle.textContent = '채식주의자';
    if (bookAuthor)
        bookAuthor.textContent = '한강';
    if (bookPublisher)
        bookPublisher.textContent = '창비';
    console.log('도서 정보 로드:', bookId);
}
// ==================== 리뷰 데이터 로드 (수정 모드) ====================
function loadReviewData(reviewId) {
    // TODO: API 호출하여 리뷰 데이터 가져오기
    // const reviewData = await fetch(`/api/reviews/${reviewId}`);
    console.log('리뷰 데이터 로드:', reviewId);
    // 더미 데이터로 폼 채우기
    // setFormData(reviewData);
}
// ==================== API: 리뷰 등록 ====================
async function createReview(data) {
    // TODO: 실제 API 호출
    console.log('리뷰 등록:', data);
    // const response = await fetch('/api/reviews', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
    // return response.json();
}
// ==================== API: 리뷰 수정 ====================
async function updateReview(reviewId, data) {
    // TODO: 실제 API 호출
    console.log('리뷰 수정:', reviewId, data);
    // const response = await fetch(`/api/reviews/${reviewId}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
    // return response.json();
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewWrite);
}
else {
    initReviewWrite();
}
export { initReviewWrite };
