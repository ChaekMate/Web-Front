/**
 * ChaekMate Signup TypeScript
 * 회원가입 기능 전용
 */

console.log('📝 ChaekMate Signup 로드 완료!');

// ==================== 회원가입 폼 처리 ====================
const initSignupForm = (): void => {
  const signupForm = document.getElementById('signupForm');
  
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    
    const formData = new FormData(signupForm as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('password-confirm') as string;
    const phone = formData.get('phone') as string;

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 약관 동의 확인
    const termsChecked = (formData.get('terms') as string) === 'on';
    const privacyChecked = (formData.get('privacy') as string) === 'on';

    if (!termsChecked || !privacyChecked) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    const marketingChecked = (formData.get('marketing') as string) === 'on';

    console.log('회원가입 시도:', { name, email, phone, marketing: marketingChecked });

    // TODO: 실제 API 연동
    alert(`회원가입 기능은 준비 중입니다!\n\n입력하신 정보:\n이름: ${name}\n이메일: ${email}`);
  });

  console.log('✅ 회원가입 폼 초기화 완료');
};

// ==================== 전체 동의 체크박스 ====================
const initSignupAgreeAll = (): void => {
  const agreeAll = document.getElementById('agreeAll') as HTMLInputElement;
  
  if (!agreeAll) return;

  const termsItems = document.querySelectorAll('.terms-item') as NodeListOf<HTMLInputElement>;

  // 전체 동의 클릭
  agreeAll.addEventListener('change', () => {
    termsItems.forEach(item => {
      item.checked = agreeAll.checked;
    });
  });

  // 개별 항목 클릭 시 전체 동의 체크박스 업데이트
  termsItems.forEach(item => {
    item.addEventListener('change', () => {
      const allChecked = Array.from(termsItems).every(checkbox => checkbox.checked);
      agreeAll.checked = allChecked;
    });
  });

  console.log('✅ 전체 동의 체크박스 초기화 완료');
};

// ==================== 소셜 회원가입 ====================
const initSignupSocial = (): void => {
  const socialButtons = document.querySelectorAll('.btn-social');
  
  socialButtons.forEach(button => {
    button.addEventListener('click', () => {
      const socialType = button.classList.contains('btn-google') ? 'Google' :
                        button.classList.contains('btn-kakao') ? 'Kakao' :
                        button.classList.contains('btn-naver') ? 'Naver' : '';
      
      console.log(`${socialType} 회원가입 시도`);
      
      // TODO: 실제 소셜 회원가입 연동
      alert(`${socialType} 회원가입 기능은 준비 중입니다!`);
    });
  });

  console.log('✅ 소셜 회원가입 버튼 초기화 완료');
};

// ==================== 비밀번호 실시간 검증 ====================
const initSignupPasswordValidation = (): void => {
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const passwordConfirmInput = document.getElementById('password-confirm') as HTMLInputElement;
  
  if (!passwordInput || !passwordConfirmInput) return;

  // 비밀번호 확인 검증
  passwordConfirmInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    
    const formGroup = passwordConfirmInput.closest('.form-group');
    
    if (passwordConfirm === '') {
      formGroup?.classList.remove('error', 'success');
      return;
    }

    if (password !== passwordConfirm) {
      formGroup?.classList.add('error');
      formGroup?.classList.remove('success');
    } else {
      formGroup?.classList.add('success');
      formGroup?.classList.remove('error');
    }
  });

  // 비밀번호 강도 체크
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const formGroup = passwordInput.closest('.form-group');
    
    if (password.length === 0) {
      formGroup?.classList.remove('error', 'success');
      return;
    }

    const hasLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (hasLength && hasLetter && hasNumber) {
      formGroup?.classList.add('success');
      formGroup?.classList.remove('error');
    } else {
      formGroup?.classList.add('error');
      formGroup?.classList.remove('success');
    }
  });

  console.log('✅ 비밀번호 검증 초기화 완료');
};

// ==================== 이메일 형식 검증 ====================
const initSignupEmailValidation = (): void => {
  const emailInput = document.getElementById('email') as HTMLInputElement;
  
  if (!emailInput) return;

  emailInput.addEventListener('blur', () => {
    const email = emailInput.value;
    const formGroup = emailInput.closest('.form-group');
    
    if (email === '') {
      formGroup?.classList.remove('error', 'success');
      return;
    }

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

// ==================== 약관 링크 처리 ====================
const initSignupTermsLinks = (): void => {
  const termsLinks = document.querySelectorAll('.terms-link');
  
  termsLinks.forEach(link => {
    link.addEventListener('click', (e: Event) => {
      e.preventDefault();
      
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      const termsType = href === '#terms' ? '이용약관' :
                       href === '#privacy' ? '개인정보 처리방침' :
                       href === '#marketing' ? '마케팅 정보 수신' : '';
      
      alert(`${termsType} 내용 보기 기능은 준비 중입니다.`);
    });
  });

  console.log('✅ 약관 링크 초기화 완료');
};

// ==================== 메인 초기화 ====================
const initSignup = (): void => {
  console.log('🎬 ChaekMate Signup 초기화 시작...');
  
  initSignupForm();
  initSignupAgreeAll();
  initSignupSocial();
  initSignupPasswordValidation();
  initSignupEmailValidation();
  initSignupTermsLinks();
  
  console.log('✨ ChaekMate Signup 초기화 완료!');
};

// DOMContentLoaded 이벤트에서 초기화
document.addEventListener('DOMContentLoaded', initSignup);