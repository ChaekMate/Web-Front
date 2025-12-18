console.log('📖 ChaekMate Sentence SNS 로드 완료!');

// ==================== 검색 기능 ====================
function initSearch(): void {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    const handleSearch = (): void => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            // TODO: 문장/책/작가 검색 API
            console.log('검색:', keyword);
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}&type=sentence`;
        }
    };

    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    });

    console.log('✅ 검색 기능 초기화 완료');
}

// ==================== 필터 탭 ====================
function initFilterTabs(): void {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            console.log('필터 변경:', filter);
            // TODO: 필터에 따라 피드 재로드
        });
    });

    console.log('✅ 필터 탭 초기화 완료');
}

// ==================== 좋아요 버튼 ====================
function initLikeButtons(): void {
    const likeBtns = document.querySelectorAll('.like-btn');

    likeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('.count');
            const isActive = btn.classList.contains('active');

            if (isActive) {
                btn.classList.remove('active');
                if (countSpan) {
                    const count = parseInt(countSpan.textContent || '0');
                    countSpan.textContent = (count - 1).toString();
                }
            } else {
                btn.classList.add('active');
                if (countSpan) {
                    const count = parseInt(countSpan.textContent || '0');
                    countSpan.textContent = (count + 1).toString();
                }
            }

            console.log('좋아요 토글');
            // TODO: API 호출
        });
    });

    console.log('✅ 좋아요 버튼 초기화 완료');
}

// ==================== 댓글 버튼 ====================
function initCommentButtons(): void {
    const commentBtns = document.querySelectorAll('.comment-btn');

    commentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.sentence-card');
            const sentenceId = card?.getAttribute('data-sentence-id');

            console.log('댓글 클릭:', sentenceId);
            window.location.href = `/sentence-detail.html?id=${sentenceId}`;
        });
    });

    console.log('✅ 댓글 버튼 초기화 완료');
}

// ==================== 북마크 버튼 ====================
function initBookmarkButtons(): void {
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');

    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isActive = btn.classList.contains('active');
            const countSpan = btn.querySelector('.count');

            if (isActive) {
                btn.classList.remove('active');
                if (countSpan) {
                    const count = parseInt(countSpan.textContent || '0');
                    countSpan.textContent = Math.max(0, count - 1).toString();
                }
            } else {
                btn.classList.add('active');
                if (countSpan) {
                    const count = parseInt(countSpan.textContent || '0');
                    countSpan.textContent = (count + 1).toString();
                }
            }

            console.log('북마크 토글');
            // TODO: API 호출
        });
    });

    console.log('✅ 북마크 버튼 초기화 완료');
}

// ==================== 공유 버튼 ====================
function initShareButtons(): void {
    const shareBtns = document.querySelectorAll('.share-btn');

    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const card = btn.closest('.sentence-card');
            const sentenceId = card?.getAttribute('data-sentence-id');

            console.log('공유 클릭:', sentenceId);

            // TODO: 공유 모달 표시 또는 네이티브 공유
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
    });

    console.log('✅ 공유 버튼 초기화 완료');
}

// ==================== 문장 카드 클릭 ====================
function initSentenceCards(): void {
    const sentenceCards = document.querySelectorAll('.sentence-card');

    sentenceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 버튼 클릭은 제외
            if ((e.target as HTMLElement).closest('button')) {
                return;
            }

            const sentenceId = card.getAttribute('data-sentence-id');
            console.log('문장 카드 클릭:', sentenceId);
            window.location.href = `/sentence-detail.html?id=${sentenceId}`;
        });
    });

    console.log('✅ 문장 카드 초기화 완료');
}

// ==================== 책 참조 클릭 ====================
function initBookReferences(): void {
    const bookRefs = document.querySelectorAll('.book-reference');

    bookRefs.forEach(ref => {
        ref.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const bookId = ref.getAttribute('data-book-id') || '1';
            console.log('책 참조 클릭:', bookId);
            window.location.href = `/book-detail.html?id=${bookId}`;
        });
    });

    console.log('✅ 책 참조 초기화 완료');
}

// ==================== 해시태그 클릭 ====================
function initHashtags(): void {
    const tags = document.querySelectorAll('.tag, .trending-tag');

    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const tagText = tag.textContent?.trim() || '';
            console.log('해시태그 클릭:', tagText);
            
            // TODO: 해시태그 검색
            window.location.href = `/sentence-sns.html?tag=${encodeURIComponent(tagText)}`;
        });
    });

    console.log('✅ 해시태그 초기화 완료');
}

// ==================== 팔로우 버튼 ====================
function initFollowButtons(): void {
    const followBtns = document.querySelectorAll('.btn-follow');

    followBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isFollowing = btn.textContent?.includes('팔로잉');

            if (isFollowing) {
                btn.textContent = '팔로우';
                btn.classList.remove('following');
            } else {
                btn.textContent = '팔로잉';
                btn.classList.add('following');
            }

            console.log('팔로우 토글');
            // TODO: API 호출
        });
    });

    console.log('✅ 팔로우 버튼 초기화 완료');
}

// ==================== 더보기 버튼 ====================
function initLoadMore(): void {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    loadMoreBtn?.addEventListener('click', () => {
        console.log('더 많은 문장 로드');
        
        // TODO: API 호출하여 추가 문장 로드
        alert('더 많은 문장을 로드합니다...');
    });

    console.log('✅ 더보기 버튼 초기화 완료');
}

// ==================== 메인 초기화 ====================
function initSentenceSNS(): void {
    console.log('🎬 ChaekMate Sentence SNS 초기화 시작...');

    initSearch();
    initFilterTabs();
    initLikeButtons();
    initCommentButtons();
    initBookmarkButtons();
    initShareButtons();
    initSentenceCards();
    initBookReferences();
    initHashtags();
    initFollowButtons();
    initLoadMore();

    console.log('✨ ChaekMate Sentence SNS 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSentenceSNS);
} else {
    initSentenceSNS();
}

export { initSentenceSNS };