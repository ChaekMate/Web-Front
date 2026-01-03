var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log('AI Recommend Start');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
// 메시지 추가 함수
const addMessage = (type, text, books) => {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages)
        return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    if (type === 'user') {
        messageDiv.innerHTML = `
      <div class="message-content">
        <div class="message-text">
          <p>${text}</p>
        </div>
      </div>
    `;
    }
    else {
        let booksHTML = '';
        if (books && books.length > 0) {
            booksHTML = `
        <div class="book-recommendations">
          ${books.map(book => `
            <div class="book-card">
              <div class="book-cover">
                <img src="${book.cover_image}" alt="${book.title}">
              </div>
              <div class="book-info">
                <h4 class="book-title">${book.title}</h4>
                <p class="book-author">${book.author}</p>
                <p class="book-price">${book.price.toLocaleString()}원</p>
                <p class="book-reason">${book.reason}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
        }
        messageDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="message-text">
          <p>${text}</p>
        </div>
        ${booksHTML}
      </div>
    `;
    }
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    // 추천 질문 카드 제거
    const suggestionCards = document.querySelector('.suggestion-cards');
    if (suggestionCards) {
        suggestionCards.remove();
    }
};
// 로딩 메시지 추가
const addLoadingMessage = () => {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages)
        return document.createElement('div');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading';
    loadingDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <div class="message-text">
        <p>책을 찾고 있습니다...</p>
      </div>
    </div>
  `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
};
// AI 추천 API 호출
const getRecommendation = (message) => __awaiter(this, void 0, void 0, function* () {
    try {
        const token = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = yield fetch(`${API_BASE_URL}/recommendations/chat`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ message })
        });
        if (!response.ok) {
            throw new Error('API 호출 실패');
        }
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
});
// 메시지 전송 처리
const handleSendMessage = (message) => __awaiter(this, void 0, void 0, function* () {
    if (!message.trim())
        return;
    // 사용자 메시지 추가
    addMessage('user', message);
    // 입력창 초기화
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = '';
    }
    // 로딩 메시지 표시
    const loadingMessage = addLoadingMessage();
    // AI 추천 받기
    const result = yield getRecommendation(message);
    // 로딩 메시지 제거
    loadingMessage.remove();
    if (result && result.success) {
        // AI 응답 추가
        addMessage('ai', result.message, result.books);
    }
    else {
        // 에러 메시지
        addMessage('ai', '죄송합니다. 추천을 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
});
// 폼 제출 이벤트
const initChatForm = () => {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            handleSendMessage(message);
        });
    }
    // Enter 키 처리
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = chatInput.value.trim();
                handleSendMessage(message);
            }
        });
    }
};
// 추천 질문 카드 클릭
const initSuggestionCards = () => {
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const question = card.getAttribute('data-question');
            if (question) {
                handleSendMessage(question);
            }
        });
    });
};
// 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Ready');
    initChatForm();
    initSuggestionCards();
});
console.log('AI Recommend End');
