console.log('📄 ChaekMate Sentence Detail 로드 완료!');
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
        if (e.key === 'Enter')
            handleSearch();
    });
}
// ==================== 액션 버튼 ====================
function initActionButtons() {
    // 좋아요
    const likeBtn = document.querySelector('.like-btn');
    likeBtn === null || likeBtn === void 0 ? void 0 : likeBtn.addEventListener('click', () => {
        const countSpan = likeBtn.querySelector('.count');
        const isActive = likeBtn.classList.contains('active');
        if (isActive) {
            likeBtn.classList.remove('active');
            if (countSpan) {
                const count = parseInt(countSpan.textContent || '0');
                countSpan.textContent = (count - 1).toString();
            }
        }
        else {
            likeBtn.classList.add('active');
            if (countSpan) {
                const count = parseInt(countSpan.textContent || '0');
                countSpan.textContent = (count + 1).toString();
            }
        }
        console.log('좋아요 토글');
    });
    // 북마크
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    bookmarkBtn === null || bookmarkBtn === void 0 ? void 0 : bookmarkBtn.addEventListener('click', () => {
        const isActive = bookmarkBtn.classList.contains('active');
        const countSpan = bookmarkBtn.querySelector('.count');
        if (isActive) {
            bookmarkBtn.classList.remove('active');
            if (countSpan) {
                const count = parseInt(countSpan.textContent || '0');
                countSpan.textContent = Math.max(0, count - 1).toString();
            }
        }
        else {
            bookmarkBtn.classList.add('active');
            if (countSpan) {
                const count = parseInt(countSpan.textContent || '0');
                countSpan.textContent = (count + 1).toString();
            }
        }
        console.log('북마크 토글');
    });
    // 공유
    const shareBtn = document.querySelector('.share-btn');
    shareBtn === null || shareBtn === void 0 ? void 0 : shareBtn.addEventListener('click', () => {
        console.log('공유 클릭');
        if (navigator.share) {
            navigator.share({
                title: '문장 공유',
                text: '이 문장을 확인해보세요!',
                url: window.location.href
            }).catch(err => console.log('공유 취소:', err));
        }
        else {
            alert('링크가 복사되었습니다!');
        }
    });
    console.log('✅ 액션 버튼 초기화 완료');
}
// ==================== 책 보러가기 ====================
function initBookLink() {
    const bookLink = document.querySelector('.btn-view-book');
    const bookRef = document.querySelector('.book-reference');
    bookLink === null || bookLink === void 0 ? void 0 : bookLink.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = (bookRef === null || bookRef === void 0 ? void 0 : bookRef.getAttribute('data-book-id')) || '1';
        window.location.href = `/book-detail.html?id=${bookId}`;
    });
    bookRef === null || bookRef === void 0 ? void 0 : bookRef.addEventListener('click', () => {
        const bookId = bookRef.getAttribute('data-book-id') || '1';
        window.location.href = `/book-detail.html?id=${bookId}`;
    });
    console.log('✅ 책 링크 초기화 완료');
}
// ==================== 댓글 작성 ====================
function initCommentForm() {
    const form = document.getElementById('commentForm');
    const commentInput = document.getElementById('commentText');
    const commentCount = document.getElementById('commentCount');
    // 글자 수 카운터
    commentInput === null || commentInput === void 0 ? void 0 : commentInput.addEventListener('input', () => {
        const length = commentInput.value.length;
        if (commentCount) {
            commentCount.textContent = length.toString();
        }
    });
    // 댓글 제출
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
        e.preventDefault();
        const comment = commentInput.value.trim();
        if (!comment) {
            alert('댓글을 입력해주세요.');
            return;
        }
        if (comment.length < 2) {
            alert('댓글은 최소 2자 이상 입력해주세요.');
            return;
        }
        console.log('댓글 작성:', comment);
        // TODO: API 호출
        alert('댓글이 등록되었습니다!');
        commentInput.value = '';
        if (commentCount) {
            commentCount.textContent = '0';
        }
        // TODO: 댓글 목록에 추가
    });
    console.log('✅ 댓글 폼 초기화 완료');
}
// ==================== 댓글 좋아요 ====================
function initCommentLikes() {
    const likeBtns = document.querySelectorAll('.btn-comment-like');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('span');
            if (countSpan) {
                const count = parseInt(countSpan.textContent || '0');
                countSpan.textContent = (count + 1).toString();
            }
            console.log('댓글 좋아요');
            // TODO: API 호출
        });
    });
    console.log('✅ 댓글 좋아요 초기화 완료');
}
// ==================== 댓글 답글 ====================
function initCommentReplies() {
    const replyBtns = document.querySelectorAll('.btn-comment-reply');
    replyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            var _a;
            const commentItem = btn.closest('.comment-item');
            const username = (_a = commentItem === null || commentItem === void 0 ? void 0 : commentItem.querySelector('.comment-username')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('답글 클릭:', username);
            // TODO: 답글 입력 폼 표시
            const commentInput = document.getElementById('commentText');
            if (commentInput) {
                commentInput.value = `${username} `;
                commentInput.focus();
            }
        });
    });
    console.log('✅ 댓글 답글 초기화 완료');
}
// ==================== 댓글 더보기 ====================
function initLoadMoreComments() {
    const loadMoreBtn = document.querySelector('.btn-load-more-comments');
    loadMoreBtn === null || loadMoreBtn === void 0 ? void 0 : loadMoreBtn.addEventListener('click', () => {
        console.log('댓글 더보기');
        // TODO: API 호출
        alert('댓글을 더 불러옵니다...');
    });
    console.log('✅ 댓글 더보기 초기화 완료');
}
// ==================== 관련 문장 클릭 ====================
function initRelatedSentences() {
    const relatedCards = document.querySelectorAll('.related-card');
    relatedCards.forEach(card => {
        card.addEventListener('click', () => {
            const sentenceId = card.getAttribute('data-sentence-id') || '2';
            console.log('관련 문장 클릭:', sentenceId);
            window.location.href = `/sentence-detail.html?id=${sentenceId}`;
        });
    });
    console.log('✅ 관련 문장 초기화 완료');
}
// ==================== 해시태그 클릭 ====================
function initHashtags() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            var _a;
            e.stopPropagation();
            const tagText = ((_a = tag.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            console.log('해시태그 클릭:', tagText);
            window.location.href = `/sentence-sns.html?tag=${encodeURIComponent(tagText)}`;
        });
    });
    console.log('✅ 해시태그 초기화 완료');
}
// ==================== 메인 초기화 ====================
function initSentenceDetail() {
    console.log('🎬 ChaekMate Sentence Detail 초기화 시작...');
    initSearch();
    initActionButtons();
    initBookLink();
    initCommentForm();
    initCommentLikes();
    initCommentReplies();
    initLoadMoreComments();
    initRelatedSentences();
    initHashtags();
    console.log('✨ ChaekMate Sentence Detail 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSentenceDetail);
}
else {
    initSentenceDetail();
}
export { initSentenceDetail };
