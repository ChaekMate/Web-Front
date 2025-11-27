/**
 * ChaekMate AI Recommend TypeScript
 * AI 챗봇 도서 추천 기능
 */

console.log('🤖 ChaekMate AI Recommend 로드 완료!');

// 메시지 타입 정의
interface Message {
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  books?: RecommendedBook[];
}

interface RecommendedBook {
  title: string;
  author: string;
  publisher: string;
  reason: string;
}

// ==================== 메시지 추가 ====================
const addMessage = (type: 'user' | 'ai', text: string, books?: RecommendedBook[]): void => {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;

  // 추천 질문 카드 제거 (첫 메시지 이후)
  const suggestionCards = document.querySelector('.suggestion-cards');
  if (suggestionCards && type === 'user') {
    suggestionCards.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  avatarDiv.textContent = type === 'ai' ? '🤖' : '👤';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  const textDiv = document.createElement('div');
  textDiv.className = 'message-text';
  
  // 텍스트를 줄바꿈으로 분리
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    const p = document.createElement('p');
    p.textContent = line;
    textDiv.appendChild(p);
  });

  contentDiv.appendChild(textDiv);

  // 도서 추천이 있으면 추가
  if (books && books.length > 0) {
    const bookRecommendation = createBookRecommendation(books);
    contentDiv.appendChild(bookRecommendation);
  }

  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);

  messagesContainer.appendChild(messageDiv);

  // 스크롤을 맨 아래로
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  console.log(`✅ ${type} 메시지 추가:`, text);
};

// ==================== 도서 추천 카드 생성 ====================
const createBookRecommendation = (books: RecommendedBook[]): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'book-recommendation';

  const title = document.createElement('div');
  title.className = 'book-recommendation-title';
  title.textContent = '📚 추천 도서';
  container.appendChild(title);

  const booksContainer = document.createElement('div');
  booksContainer.className = 'recommended-books';

  books.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'recommended-book';

    const cover = document.createElement('div');
    cover.className = 'book-cover-small';
    cover.textContent = '책 표지';

    const info = document.createElement('div');
    info.className = 'book-info-small';

    const bookTitle = document.createElement('h4');
    bookTitle.textContent = book.title;

    const author = document.createElement('p');
    author.textContent = book.author;

    const publisher = document.createElement('p');
    publisher.textContent = book.publisher;

    const reason = document.createElement('p');
    reason.textContent = `💡 ${book.reason}`;
    reason.style.marginTop = '8px';
    reason.style.color = '#000';
    reason.style.fontWeight = '600';

    const detailBtn = document.createElement('button');
    detailBtn.className = 'book-detail-btn';
    detailBtn.textContent = '자세히 보기';
    detailBtn.onclick = () => {
      alert(`"${book.title}" 상세 페이지는 준비 중입니다!`);
      // TODO: 책 상세 페이지로 이동
      // window.location.href = `/book-detail.html?title=${encodeURIComponent(book.title)}`;
    };

    info.appendChild(bookTitle);
    info.appendChild(author);
    info.appendChild(publisher);
    info.appendChild(reason);
    info.appendChild(detailBtn);

    bookDiv.appendChild(cover);
    bookDiv.appendChild(info);

    booksContainer.appendChild(bookDiv);
  });

  container.appendChild(booksContainer);

  return container;
};

// ==================== 로딩 메시지 표시 ====================
const showLoading = (): HTMLElement => {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return document.createElement('div');

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'loading-message';

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  avatarDiv.textContent = '🤖';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message-text';

  const loadingContent = document.createElement('div');
  loadingContent.className = 'loading-message';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'loading-dot';
    loadingContent.appendChild(dot);
  }

  loadingDiv.appendChild(loadingContent);
  contentDiv.appendChild(loadingDiv);
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  return messageDiv;
};

// ==================== 로딩 메시지 제거 ====================
const removeLoading = (): void => {
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.remove();
  }
};

// ==================== AI 응답 생성 (더미) ====================
const getAIResponse = async (userMessage: string): Promise<{ text: string; books?: RecommendedBook[] }> => {
  // TODO: 실제 LLM API 연동
  // const response = await fetch('/api/ai/recommend', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message: userMessage })
  // });
  // const data = await response.json();
  // return data;

  // 임시 더미 응답
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기

  const dummyBooks: RecommendedBook[] = [
    {
      title: '아몬드',
      author: '손원평',
      publisher: '창비',
      reason: '감정에 대한 깊은 이해와 공감을 다룬 소설입니다'
    },
    {
      title: '달러구트 꿈 백화점',
      author: '이미예',
      publisher: '팩토리나인',
      reason: '위로와 힐링이 필요한 당신에게 추천합니다'
    },
    {
      title: '트렌드 코리아 2025',
      author: '김난도 외',
      publisher: '미래의창',
      reason: '새로운 시작을 준비하는 데 도움이 될 것입니다'
    }
  ];

  return {
    text: `당신의 상황을 이해했습니다.\n다음 책들을 추천드립니다:`,
    books: dummyBooks
  };
};

// ==================== 메시지 전송 처리 ====================
const handleSendMessage = async (message: string): Promise<void> => {
  if (!message.trim()) return;

  const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
  const chatSubmit = document.getElementById('chatSubmit') as HTMLButtonElement;

  // 사용자 메시지 추가
  addMessage('user', message);

  // 입력창 초기화
  if (chatInput) {
    chatInput.value = '';
    chatInput.style.height = 'auto';
  }

  // 버튼 비활성화
  if (chatSubmit) {
    chatSubmit.disabled = true;
  }

  // 로딩 표시
  showLoading();

  try {
    // AI 응답 받기
    const response = await getAIResponse(message);

    // 로딩 제거
    removeLoading();

    // AI 응답 추가
    addMessage('ai', response.text, response.books);

  } catch (error) {
    console.error('AI 응답 에러:', error);
    removeLoading();
    addMessage('ai', '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    // 버튼 활성화
    if (chatSubmit) {
      chatSubmit.disabled = false;
    }
  }
};

// ==================== 폼 제출 처리 ====================
const initChatForm = (): void => {
  const chatForm = document.getElementById('chatForm');
  
  if (!chatForm) return;

  chatForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
    const message = chatInput?.value.trim();

    if (message) {
      await handleSendMessage(message);
    }
  });

  console.log('✅ 채팅 폼 초기화 완료');
};

// ==================== 텍스트 영역 자동 높이 조절 ====================
const initAutoResize = (): void => {
  const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
  
  if (!chatInput) return;

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  console.log('✅ 자동 높이 조절 초기화 완료');
};

// ==================== 추천 질문 카드 클릭 ====================
const initSuggestionCards = (): void => {
  const suggestionCards = document.querySelectorAll('.suggestion-card');
  
  suggestionCards.forEach(card => {
    card.addEventListener('click', async () => {
      const question = card.getAttribute('data-question');
      if (question) {
        await handleSendMessage(question);
      }
    });
  });

  console.log('✅ 추천 질문 카드 초기화 완료');
};

// ==================== 검색 기능 ====================
const initAISearch = (): void => {
  const searchBtn = document.querySelector('.search-btn') as HTMLButtonElement | null;
  const searchInput = document.querySelector('.search-input') as HTMLInputElement | null;

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const keyword = searchInput?.value.trim();
      if (keyword) {
        alert(`"${keyword}" 검색 기능은 준비 중입니다!`);
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (searchBtn) {
          searchBtn.click();
        }
      }
    });
  }

  console.log('✅ 검색 기능 초기화 완료');
};

// ==================== 메인 초기화 ====================
const initAIRecommend = (): void => {
  console.log('🎬 ChaekMate AI Recommend 초기화 시작...');
  
  initChatForm();
  initAutoResize();
  initSuggestionCards();
  initAISearch();
  
  console.log('✨ ChaekMate AI Recommend 초기화 완료!');
};

// DOMContentLoaded 이벤트에서 초기화
document.addEventListener('DOMContentLoaded', initAIRecommend);