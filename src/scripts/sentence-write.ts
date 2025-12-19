console.log('✍️ ChaekMate Sentence Write 로드 완료!');

let selectedBook: any = null;
const hashtags: string[] = [];

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

// ==================== 도서 검색 ====================
function initBookSearch(): void {
    const searchBtn = document.querySelector('.btn-search-book');
    const bookSearchInput = document.getElementById('bookSearch') as HTMLInputElement;

    searchBtn?.addEventListener('click', () => {
        const keyword = bookSearchInput?.value.trim();
        if (keyword) {
            console.log('도서 검색:', keyword);
            
            // TODO: 실제 도서 검색 API 호출
            // 더미 데이터로 도서 선택
            selectBook({
                id: 1,
                title: '채식주의자',
                author: '한강',
                publisher: '창비'
            });
        }
    });

    console.log('✅ 도서 검색 초기화 완료');
}

// ==================== 도서 선택 ====================
function selectBook(book: any): void {
    selectedBook = book;

    const selectedBookEl = document.getElementById('selectedBook');
    const bookTitle = document.getElementById('selectedBookTitle');
    const bookAuthor = document.getElementById('selectedBookAuthor');

    if (selectedBookEl && bookTitle && bookAuthor) {
        selectedBookEl.style.display = 'flex';
        bookTitle.textContent = book.title;
        bookAuthor.textContent = `${book.author} · ${book.publisher}`;
    }

    updatePreview();

    console.log('도서 선택:', book);
}

// ==================== 도서 선택 제거 ====================
function initRemoveBook(): void {
    const removeBtn = document.querySelector('.btn-remove');

    removeBtn?.addEventListener('click', () => {
        selectedBook = null;
        const selectedBookEl = document.getElementById('selectedBook');
        if (selectedBookEl) {
            selectedBookEl.style.display = 'none';
        }

        updatePreview();
        console.log('도서 선택 제거');
    });

    console.log('✅ 도서 제거 초기화 완료');
}

// ==================== 문장 입력 ====================
function initSentenceInput(): void {
    const sentenceInput = document.getElementById('sentenceText') as HTMLTextAreaElement;
    const sentenceCount = document.getElementById('sentenceCount');

    sentenceInput?.addEventListener('input', () => {
        const length = sentenceInput.value.length;
        if (sentenceCount) {
            sentenceCount.textContent = length.toString();
        }

        updatePreview();
    });

    console.log('✅ 문장 입력 초기화 완료');
}

// ==================== 감상 입력 ====================
function initThoughtsInput(): void {
    const thoughtsInput = document.getElementById('myThoughts') as HTMLTextAreaElement;
    const thoughtsCount = document.getElementById('thoughtsCount');

    thoughtsInput?.addEventListener('input', () => {
        const length = thoughtsInput.value.length;
        if (thoughtsCount) {
            thoughtsCount.textContent = length.toString();
        }
    });

    console.log('✅ 감상 입력 초기화 완료');
}

// ==================== 해시태그 추가 ====================
function initHashtags(): void {
    const hashtagInput = document.getElementById('hashtagInput') as HTMLInputElement;
    const addBtn = document.querySelector('.btn-add-tag');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    // 추가 버튼
    addBtn?.addEventListener('click', () => {
        addHashtag(hashtagInput.value);
        hashtagInput.value = '';
    });

    // 엔터키
    hashtagInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addHashtag(hashtagInput.value);
            hashtagInput.value = '';
        }
    });

    // 추천 태그 클릭
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent?.trim() || '';
            addHashtag(tagText);
        });
    });

    console.log('✅ 해시태그 초기화 완료');
}

function addHashtag(tag: string): void {
    tag = tag.trim();
    
    // # 없으면 추가
    if (tag && !tag.startsWith('#')) {
        tag = '#' + tag;
    }

    // 이미 있거나 비어있으면 무시
    if (!tag || tag === '#' || hashtags.includes(tag)) {
        return;
    }

    // 최대 5개 제한
    if (hashtags.length >= 5) {
        alert('해시태그는 최대 5개까지 추가할 수 있습니다.');
        return;
    }

    hashtags.push(tag);
    renderHashtags();
    updatePreview();

    console.log('해시태그 추가:', tag);
}

function removeHashtag(tag: string): void {
    const index = hashtags.indexOf(tag);
    if (index > -1) {
        hashtags.splice(index, 1);
        renderHashtags();
        updatePreview();
    }

    console.log('해시태그 제거:', tag);
}

function renderHashtags(): void {
    const hashtagList = document.getElementById('hashtagList');
    if (!hashtagList) return;

    hashtagList.innerHTML = hashtags.map(tag => `
        <span class="tag" onclick="removeHashtag('${tag}')">
            ${tag} <span style="margin-left: 4px; cursor: pointer;">×</span>
        </span>
    `).join('');
}

// window에 함수 노출 (HTML onclick에서 사용)
(window as any).removeHashtag = removeHashtag;

// ==================== 미리보기 업데이트 ====================
function updatePreview(): void {
    const sentenceInput = document.getElementById('sentenceText') as HTMLTextAreaElement;
    const previewSentence = document.getElementById('previewSentence');
    const previewBook = document.getElementById('previewBook');
    const previewBookTitle = document.getElementById('previewBookTitle');
    const previewBookAuthor = document.getElementById('previewBookAuthor');
    const previewTags = document.getElementById('previewTags');

    // 문장
    if (previewSentence) {
        const text = sentenceInput?.value.trim() || '문장을 입력하면 여기에 미리보기가 표시됩니다';
        previewSentence.textContent = text;
    }

    // 책
    if (previewBook) {
        if (selectedBook) {
            previewBook.style.display = 'flex';
            if (previewBookTitle) previewBookTitle.textContent = selectedBook.title;
            if (previewBookAuthor) previewBookAuthor.textContent = `${selectedBook.author} · ${selectedBook.publisher}`;
        } else {
            previewBook.style.display = 'none';
        }
    }

    // 해시태그
    if (previewTags) {
        previewTags.innerHTML = hashtags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
    }
}

// ==================== 폼 제출 ====================
function initFormSubmit(): void {
    const form = document.getElementById('sentenceForm') as HTMLFormElement;
    const sentenceInput = document.getElementById('sentenceText') as HTMLTextAreaElement;
    const pageNumber = document.getElementById('pageNumber') as HTMLInputElement;
    const myThoughts = document.getElementById('myThoughts') as HTMLTextAreaElement;

    form?.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        // 유효성 검사
        if (!selectedBook) {
            alert('책을 선택해주세요.');
            return;
        }

        if (!sentenceInput.value.trim()) {
            alert('문장을 입력해주세요.');
            sentenceInput.focus();
            return;
        }

        if (sentenceInput.value.length < 10) {
            alert('문장은 최소 10자 이상 입력해주세요.');
            sentenceInput.focus();
            return;
        }

        // 공개 설정
        const visibilityRadio = document.querySelector('input[name="visibility"]:checked') as HTMLInputElement;

        // 데이터 수집
        const formData = {
            bookId: selectedBook.id,
            sentence: sentenceInput.value.trim(),
            pageNumber: pageNumber.value || null,
            thoughts: myThoughts.value.trim() || null,
            hashtags: hashtags,
            visibility: visibilityRadio?.value || 'public'
        };

        console.log('문장 공유:', formData);

        // TODO: API 호출
        alert('문장이 공유되었습니다!');
        window.location.href = '/sentence-sns.html';
    });

    console.log('✅ 폼 제출 초기화 완료');
}

// ==================== 취소 버튼 ====================
function initCancelButton(): void {
    const cancelBtn = document.getElementById('cancelBtn');

    cancelBtn?.addEventListener('click', () => {
        if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
            window.location.href = '/sentence-sns.html';
        }
    });

    console.log('✅ 취소 버튼 초기화 완료');
}

// ==================== 메인 초기화 ====================
function initSentenceWrite(): void {
    console.log('🎬 ChaekMate Sentence Write 초기화 시작...');

    initSearch();
    initBookSearch();
    initRemoveBook();
    initSentenceInput();
    initThoughtsInput();
    initHashtags();
    initFormSubmit();
    initCancelButton();

    console.log('✨ ChaekMate Sentence Write 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSentenceWrite);
} else {
    initSentenceWrite();
}

export { initSentenceWrite };