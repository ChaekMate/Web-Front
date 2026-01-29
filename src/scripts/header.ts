// header.js - 헤더 동적 업데이트
console.log('🔐 Header 초기화...');

// localStorage에서 토큰 확인
const accessToken = localStorage.getItem('access_token');
const isLoggedIn = !!accessToken;

console.log('로그인 상태:', isLoggedIn ? '로그인됨' : '로그아웃됨');

// 최상단 메뉴바 업데이트
const topMenu = document.getElementById('topMenu');
if (topMenu) {
    if (isLoggedIn) {
        // 로그인 상태
        topMenu.innerHTML = `
        <a href="/mypage.html">마이페이지</a>
        <a href="/wishlist.html">위시리스트</a>
        <a href="/discussion-history.html">토론 기록</a>
        <a href="/cs.html">고객센터</a>
         <button id="logout-btn" class="logout-link">로그아웃</button>
    `;

        // 로그아웃 버튼 이벤트
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('로그아웃 하시겠습니까?')) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    alert('로그아웃 되었습니다.');
                    window.location.href = '/home.html';
                }
            });
        }
    } else {
        // 로그아웃 상태
        topMenu.innerHTML = `
      <a href="/login.html">로그인</a>
      <a href="/signup.html">회원가입</a>
      <a href="/about.html">서비스 소개</a>
      <a href="/cs.html">고객센터</a>
    `;
    }
}

// 헤더 아이콘 영역 업데이트
const headerIcons = document.getElementById('headerIcons');
if (headerIcons) {
    if (isLoggedIn) {
        // 로그인 상태
        headerIcons.innerHTML = `
      <a href="/mypage.html" class="icon-link">
        <span class="icon">👤</span>
        <span>마이페이지</span>
      </a>
      <a href="/wishlist.html" class="icon-link">
        <span class="icon">❤️</span>
        <span>위시리스트</span>
      </a>
      <a href="/discussion-history.html" class="icon-link">
        <span class="icon">💬</span>
        <span>토론기록</span>
      </a>
    `;
    } else {
        // 로그아웃 상태
        headerIcons.innerHTML = `
      <a href="/login.html" class="icon-link">
        <span class="icon">👤</span>
        <span>로그인</span>
      </a>
      <a href="/about.html" class="icon-link">
        <span class="icon">ℹ️</span>
        <span>서비스소개</span>
      </a>
    `;
    }
}

console.log('✅ 헤더 업데이트 완료');