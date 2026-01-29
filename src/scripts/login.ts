console.log('🔐 ChaekMate Login 로드 완료!');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// 로그인 API 호출
const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || '로그인에 실패했습니다.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// 로그인 폼 처리
const initLoginForm = (): void => {
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  if (!loginForm) {
    console.error('loginForm을 찾을 수 없습니다.');
    return;
  }

  loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    console.log('로그인 시도:', email);

    try {
      const data = await login(email, password);

      console.log('✅ 로그인 성공:', data);

      // 토큰 저장
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      alert('로그인 성공!');

      // 홈으로 이동
      window.location.href = '/home.html';

    } catch (error: any) {
      console.error('❌ 로그인 실패:', error);
      alert(error.message || '로그인 중 오류가 발생했습니다.');
    }
  });

  console.log('✅ 로그인 폼 초기화 완료');
};

// ==================== 소셜 로그인 ====================
const initSocialLogin = (): void => {
  const googleBtn = document.querySelector('.btn-google');
  const kakaoBtn = document.querySelector('.btn-kakao');
  const naverBtn = document.querySelector('.btn-naver');

  // Google 로그인
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        console.log('🔍 Google 로그인 시작...');

        const response = await fetch(`${API_BASE_URL}/auth/google`);
        const data = await response.json();

        if (data.success && data.auth_url) {
          console.log('✅ Google 인증 URL 받음, 리다이렉트 중...');
          // OAuth 페이지로 리다이렉트
          window.location.href = data.auth_url;
        } else {
          throw new Error('Google 인증 URL을 받지 못했습니다.');
        }
      } catch (error) {
        console.error('❌ Google 로그인 오류:', error);
        alert('Google 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    });
  }

  // Kakao 로그인
  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', async () => {
      try {
        console.log('🔍 Kakao 로그인 시작...');

        const response = await fetch(`${API_BASE_URL}/auth/kakao`);
        const data = await response.json();

        if (data.success && data.auth_url) {
          console.log('✅ Kakao 인증 URL 받음, 리다이렉트 중...');
          window.location.href = data.auth_url;
        } else {
          throw new Error('Kakao 인증 URL을 받지 못했습니다.');
        }
      } catch (error) {
        console.error('❌ Kakao 로그인 오류:', error);
        alert('Kakao 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    });
  }

  // Naver 로그인
  if (naverBtn) {
    naverBtn.addEventListener('click', async () => {
      try {
        console.log('🔍 Naver 로그인 시작...');

        const response = await fetch(`${API_BASE_URL}/auth/naver`);
        const data = await response.json();

        if (data.success && data.auth_url) {
          console.log('✅ Naver 인증 URL 받음, 리다이렉트 중...');

          // ✨ state 값 저장 (선택사항 - 보안 강화)
          if (data.state) {
            sessionStorage.setItem('naver_oauth_state', data.state);
          }

          // Naver 로그인 페이지로 이동
          window.location.href = data.auth_url;
        } else {
          throw new Error('Naver 인증 URL을 받지 못했습니다.');
        }
      } catch (error) {
        console.error('❌ Naver 로그인 오류:', error);
        alert('Naver 로그인 중 오류가 발생했습니다.');
      }
    });
  }

  console.log('✅ 소셜 로그인 버튼 초기화 완료');
};

// 메인 초기화
const initLogin = (): void => {
  console.log('🎬 Login 초기화 시작...');

  initLoginForm();
  initSocialLogin();

  console.log('✨ Login 초기화 완료!');
};

document.addEventListener('DOMContentLoaded', initLogin);