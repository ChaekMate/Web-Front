console.log('📄 ChaekMate Sentence Detail 로드 완료!');

// ==================== 검색 기능 ====================
function initSearch(): void {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    const handleSearch = (): void => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };

    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// ==================== 액션 버튼 ====================
function initActionButtons(): void {
    // 좋아요
    const likeBtn = document.querySelector('.like-btn');
    likeBtn?.addEventListener('click', () => {
        const countSpan = likeBtn.querySelector('.count');
        const isActive = likeBtn.classList.contains('active');

        if (isActive) {
            likeBtn.classList.remove('active');
            if (countSpan) {
                const count = parseInt(countSpan.textContent || '0');
                countSpan.textContent = (count - 1).toString();
            }
        } else {
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
    bookmarkBtn?.addEventListener('click', () => {
        const isActive = bookmarkBtn.classList.contains('active');
        const countSpan = bookmarkBtn.querySelector('.count');

        if (isActive) {
            bookmarkBtn.classList.remove('active');
            if (countSpan) {
                const count = parseInt(countSpan.textContent || '0');
                countSpan.textContent = Math.max(0, count - 1).toString();
            }
        } else {
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
    shareBtn?.addEventListener('click', () => {
        console.log('공유 클릭');

        if (navigator.share) {
            navigator.share({
                title: '문장 공유',
                text: '이 문장을 확인해보세요!',
                url: window.location.href
            }).catch(err => console.log('공유 취소:', err));
        } else {
            alert('링크가 복사되었습니다!');
        }
    });

    console.log('✅ 액션 버튼 초기화 완료');
}

// ==================== 책 보러가기 ====================
function initBookLink(): void {
    const bookLink = document.querySelector('.btn-view-book');
    const bookRef = document.querySelector('.book-reference');

    bookLink?.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = bookRef?.getAttribute('data-book-id') || '1';
        window.location.href = `/book-detail.html?id=${bookId}`;
    });

    bookRef?.addEventListener('click', () => {
        const bookId = bookRef.getAttribute('data-book-id') || '1';
        window.location.href = `/book-detail.html?id=${bookId}`;
    });

    console.log('✅ 책 링크 초기화 완료');
}

// ==================== 댓글 작성 ====================
function initCommentForm(): void {
    const form = document.getElementById('commentForm') as HTMLFormElement;
    const commentInput = document.getElementById('commentText') as HTMLTextAreaElement;
    const commentCount = document.getElementById('commentCount');

    // 글자 수 카운터
    commentInput?.addEventListener('input', () => {
        const length = commentInput.value.length;
        if (commentCount) {
            commentCount.textContent = length.toString();
        }
    });

    // 댓글 제출
    form?.addEventListener('submit', (e: Event) => {
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
function initCommentLikes(): void {
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
function initCommentReplies(): void {
    const replyBtns = document.querySelectorAll('.btn-comment-reply');

    replyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const commentItem = btn.closest('.comment-item');
            const username = commentItem?.querySelector('.comment-username')?.textContent;

            console.log('답글 클릭:', username);
            
            // TODO: 답글 입력 폼 표시
            const commentInput = document.getElementById('commentText') as HTMLTextAreaElement;
            if (commentInput) {
                commentInput.value = `${username} `;
                commentInput.focus();
            }
        });
    });

    console.log('✅ 댓글 답글 초기화 완료');
}

// ==================== 댓글 더보기 ====================
function initLoadMoreComments(): void {
    const loadMoreBtn = document.querySelector('.btn-load-more-comments');

    loadMoreBtn?.addEventListener('click', () => {
        console.log('댓글 더보기');
        
        // TODO: API 호출
        alert('댓글을 더 불러옵니다...');
    });

    console.log('✅ 댓글 더보기 초기화 완료');
}

// ==================== 관련 문장 클릭 ====================
function initRelatedSentences(): void {
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
function initHashtags(): void {
    const tags = document.querySelectorAll('.tag');

    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const tagText = tag.textContent?.trim() || '';
            console.log('해시태그 클릭:', tagText);
            
            window.location.href = `/sentence-sns.html?tag=${encodeURIComponent(tagText)}`;
        });
    });

    console.log('✅ 해시태그 초기화 완료');
}

// ==================== 메인 초기화 ====================
function initSentenceDetail(): void {
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
} else {
    initSentenceDetail();
}

export { initSentenceDetail };