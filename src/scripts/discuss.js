var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log('💬 ChaekMate Discuss 로드 완료!');
const messages = [];
// ==================== 검색 기능 ====================
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
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
    console.log('✅ 검색 기능 초기화 완료');
}
// ==================== URL에서 도서 ID 가져오기 ====================
function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('book_id');
    return bookId ? parseInt(bookId) : null;
}
// ==================== 도서 정보 로드 (더미 데이터) ====================
function loadBookInfo(bookId) {
    // TODO: API 연동 시 실제 데이터 로드
    // 현재는 더미 데이터 사용
    const dummyBook = {
        id: bookId || 1,
        title: '트렌드 코리아 2026',
        author: '김난도^전인영^최지혜^권정윤^한다혜^이수진^이준영^이향은^이혜원^김서영',
        publisher: '미래의창',
        cover_image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280'%3E%3Crect fill='%23ddd' width='200' height='280'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3E책 표지%3C/text%3E%3C/svg%3E",
        description: '2026년 대한민국을 이끌어갈 10가지 소비트렌드를 전망하는 책입니다. HORSE POWER AI 대전환의 시대, 무엇을 준비해야 하는가? 세상을 작동하게 만드는 진짜 힘은 무엇인가?',
        price: 18000,
        rating: 4.5
    };
    renderBookInfo(dummyBook);
    console.log('✅ 도서 정보 로드 완료');
}
// ==================== 도서 정보 렌더링 ====================
function renderBookInfo(book) {
    const bookCover = document.getElementById('bookCover');
    const bookTitle = document.getElementById('bookTitle');
    const bookAuthor = document.getElementById('bookAuthor');
    const bookPublisher = document.getElementById('bookPublisher');
    const bookPrice = document.getElementById('bookPrice');
    const bookRating = document.getElementById('bookRating');
    const bookDescription = document.getElementById('bookDescription');
    if (bookCover)
        bookCover.src = book.cover_image;
    if (bookTitle)
        bookTitle.textContent = book.title;
    if (bookAuthor)
        bookAuthor.textContent = book.author.split('^')[0] + ' 외';
    if (bookPublisher)
        bookPublisher.textContent = book.publisher;
    if (bookPrice)
        bookPrice.textContent = book.price.toLocaleString() + '원';
    if (bookRating)
        bookRating.textContent = book.rating.toString();
    if (bookDescription)
        bookDescription.textContent = book.description;
}
// ==================== 메시지 추가 ====================
function addMessage(type, text) {
    const message = {
        type,
        text,
        timestamp: new Date()
    };
    messages.push(message);
    renderMessage(message);
    // 스크롤을 최하단으로
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
// ==================== 메시지 렌더링 ====================
function renderMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages)
        return;
    // 추천 질문 제거 (첫 메시지 이후)
    const suggestedQuestions = chatMessages.querySelector('.suggested-questions');
    if (suggestedQuestions && messages.length > 1) {
        suggestedQuestions.remove();
    }
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}-message`;
    const avatar = message.type === 'ai' ? '🤖' : '👤';
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${message.text}</div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
}
// ==================== 타이핑 인디케이터 ====================
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages)
        return document.createElement('div');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-text">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}
// ==================== AI 응답 생성 (더미) ====================
function getAIResponse(userMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: API 연동 시 실제 AI 응답 받기
        // 현재는 더미 응답 반환
        yield new Promise(resolve => setTimeout(resolve, 1500)); // 1.5초 대기
        const responses = [
            '좋은 질문이네요! 이 책에서는 2026년의 주요 트렌드를 다양한 관점에서 분석하고 있습니다.',
            '저자는 AI 기술의 발전이 소비 패턴에 미치는 영향을 특히 강조하고 있습니다.',
            '이 주제는 책의 3장에서 자세히 다루어지고 있는데, 매우 흥미로운 관점을 제시합니다.',
            '네, 맞습니다. 책에서는 이러한 변화가 우리 일상에 어떤 영향을 미칠지 구체적인 사례와 함께 설명하고 있습니다.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    });
}
// ==================== 메시지 전송 ====================
function sendMessage(text) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!text.trim())
            return;
        // 사용자 메시지 추가
        addMessage('user', text);
        // 입력창 초기화
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = '';
            chatInput.style.height = 'auto';
        }
        // 타이핑 인디케이터 표시
        showTypingIndicator();
        // AI 응답 받기 (더미)
        const aiResponse = yield getAIResponse(text);
        // 타이핑 인디케이터 제거
        hideTypingIndicator();
        // AI 응답 추가
        addMessage('ai', aiResponse);
    });
}
// ==================== 입력 이벤트 ====================
function initChatInput() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    // 자동 높이 조절
    chatInput === null || chatInput === void 0 ? void 0 : chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    });
    // Enter 키로 전송 (Shift + Enter는 줄바꿈)
    chatInput === null || chatInput === void 0 ? void 0 : chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(chatInput.value);
        }
    });
    // 전송 버튼 클릭
    sendBtn === null || sendBtn === void 0 ? void 0 : sendBtn.addEventListener('click', () => {
        if (chatInput) {
            sendMessage(chatInput.value);
        }
    });
    console.log('✅ 채팅 입력 초기화 완료');
}
// ==================== 추천 질문 클릭 ====================
function initSuggestedQuestions() {
    const questionBtns = document.querySelectorAll('.question-btn');
    questionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.textContent || '';
            sendMessage(question);
        });
    });
    console.log('✅ 추천 질문 초기화 완료');
}
// ==================== 도서 액션 버튼 ====================
function initBookActions() {
    const primaryBtn = document.querySelector('.action-btn.primary');
    const secondaryBtn = document.querySelector('.action-btn.secondary');
    primaryBtn === null || primaryBtn === void 0 ? void 0 : primaryBtn.addEventListener('click', () => {
        const bookId = getBookIdFromUrl();
        if (bookId) {
            window.location.href = `/book-detail.html?id=${bookId}`;
        }
    });
    secondaryBtn === null || secondaryBtn === void 0 ? void 0 : secondaryBtn.addEventListener('click', () => {
        alert('장바구니 기능은 준비 중입니다.');
    });
    console.log('✅ 도서 액션 버튼 초기화 완료');
}
// ==================== 메인 초기화 ====================
function initDiscuss() {
    console.log('🎬 ChaekMate Discuss 초기화 시작...');
    initSearch();
    const bookId = getBookIdFromUrl();
    if (!bookId) {
        console.warn('⚠️ book_id 파라미터가 없습니다. 더미 데이터를 사용합니다.');
    }
    loadBookInfo(bookId);
    initChatInput();
    initSuggestedQuestions();
    initBookActions();
    console.log('✨ ChaekMate Discuss 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscuss);
}
else {
    initDiscuss();
}
