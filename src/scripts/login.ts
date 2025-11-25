/**
 * ChaekMate Login TypeScript
 * 로그인 기능 전용
 */

console.log('🔐 ChaekMate Login 로드 완료!');

// ==================== 로그인 폼 처리 ====================
const initLoginForm = (): void => {
  const loginForm = document.getElementById('loginForm');
  
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const remember = formData.get('remember');

    console.log('로그인 시도:', { email, remember: !!remember });

    // TODO: 실제 API 연동
    // 임시로 성공 메시지
    alert(`로그인 기능은 준비 중입니다!\n\n입력하신 이메일: ${email}`);
    
    // 실제로는 API 호출 후 홈으로 이동
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, remember })
    // });
    // 
    // if (response.ok) {
    //   const data = await response.json();
    //   localStorage.setItem('token', data.token);
    //   window.location.href = '/home.html';
    // }
  });

  console.log('✅ 로그인 폼 초기화 완료');
};

// ==================== 소셜 로그인 ====================
const initSocialLogin = (): void => {
  const socialButtons = document.querySelectorAll('.btn-social');
  
  socialButtons.forEach(button => {
    button.addEventListener('click', () => {
      const socialType = button.classList.contains('btn-google') ? 'Google' :
                        button.classList.contains('btn-kakao') ? 'Kakao' :
                        button.classList.contains('btn-naver') ? 'Naver' : '';
      
      console.log(`${socialType} 로그인 시도`);
      
      // TODO: 실제 소셜 로그인 연동
      alert(`${socialType} 로그인 기능은 준비 중입니다!`);
      
      // 실제로는 OAuth 인증 URL로 이동
      // window.location.href = `/api/auth/${socialType.toLowerCase()}`;
    });
  });

  console.log('✅ 소셜 로그인 버튼 초기화 완료');
};

// ==================== 이메일 형식 검증 ====================
const initEmailValidation = (): void => {
  const emailInput = document.getElementById('email') as HTMLInputElement;
  
  if (!emailInput) return;

  emailInput.addEventListener('blur', () => {
    const email = emailInput.value;
    const formGroup = emailInput.closest('.form-group');
    
    if (email === '') {
      formGroup?.classList.remove('error', 'success');
      return;
    }

    // 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      formGroup?.classList.add('success');
      formGroup?.classList.remove('error');
    } else {
      formGroup?.classList.add('error');
      formGroup?.classList.remove('success');
    }
  });

  console.log('✅ 이메일 검증 초기화 완료');
};

// ==================== 비밀번호 찾기 ====================
const initFindPassword = (): void => {
  const findPasswordLink = document.querySelector('a[href="#find-password"]');
  
  if (!findPasswordLink) return;

  findPasswordLink.addEventListener('click', (e: Event) => {
    e.preventDefault();
    
    alert('비밀번호 찾기 기능은 준비 중입니다!');
    
    // TODO: 비밀번호 찾기 페이지로 이동
    // window.location.href = '/find-password.html';
  });

  console.log('✅ 비밀번호 찾기 초기화 완료');
};

// ==================== 메인 초기화 ====================
const init = (): void => {
  console.log('🎬 ChaekMate Login 초기화 시작...');
  
  initLoginForm();
  initSocialLogin();
  initEmailValidation();
  initFindPassword();
  
  console.log('✨ ChaekMate Login 초기화 완료!');
};

// DOMContentLoaded 이벤트에서 초기화
document.addEventListener('DOMContentLoaded', init);