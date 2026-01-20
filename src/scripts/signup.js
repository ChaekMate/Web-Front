console.log('📝 ChaekMate Signup 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const register = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.detail || '회원가입에 실패했습니다.');
        }
        return result;
    }
    catch (error) {
        throw error;
    }
};
const initSignupForm = () => {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm)
        return;
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const password = String(formData.get('password') || '');
        const passwordConfirm = String(formData.get('password-confirm') || '');
        const phone = String(formData.get('phone') || '').trim();
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        const termsChecked = formData.get('terms') === 'on';
        const privacyChecked = formData.get('privacy') === 'on';
        if (!termsChecked || !privacyChecked) {
            alert('필수 약관에 동의해주세요.');
            return;
        }
        const marketingChecked = formData.get('marketing') === 'on';
        console.log('회원가입 시도:', { name, email });
        try {
            const result = await register({
                name,
                email,
                password,
                phone: phone || undefined,
                agree_terms: termsChecked,
                agree_privacy: privacyChecked,
                agree_marketing: marketingChecked
            });
            console.log('✅ 회원가입 성공:', result);
            if (result.access_token) {
                localStorage.setItem('access_token', result.access_token);
            }
            if (result.refresh_token) {
                localStorage.setItem('refresh_token', result.refresh_token);
            }
            alert('회원가입 성공! 환영합니다.');
            window.location.href = '/home.html';
        }
        catch (error) {
            console.error('❌ 회원가입 실패:', error);
            alert(error.message || '회원가입 중 오류가 발생했습니다.');
        }
    });
    console.log('✅ 회원가입 폼 초기화 완료');
};
const initSignupAgreeAll = () => {
    const agreeAll = document.getElementById('agreeAll');
    if (!agreeAll)
        return;
    const termsItems = document.querySelectorAll('.terms-item');
    agreeAll.addEventListener('change', () => {
        termsItems.forEach(item => {
            item.checked = agreeAll.checked;
        });
    });
    termsItems.forEach(item => {
        item.addEventListener('change', () => {
            const allChecked = Array.from(termsItems).every(checkbox => checkbox.checked);
            agreeAll.checked = allChecked;
        });
    });
    console.log('✅ 전체 동의 체크박스 초기화 완료');
};
const initSignupSocial = () => {
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('소셜 회원가입 기능은 준비 중입니다!');
        });
    });
    console.log('✅ 소셜 회원가입 버튼 초기화 완료');
};
const initSignupPasswordValidation = () => {
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    if (!passwordInput || !passwordConfirmInput)
        return;
    passwordConfirmInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;
        const formGroup = passwordConfirmInput.closest('.form-group');
        if (passwordConfirm === '') {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('error', 'success');
            return;
        }
        if (password !== passwordConfirm) {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.add('error');
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('success');
        }
        else {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.add('success');
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('error');
        }
    });
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const formGroup = passwordInput.closest('.form-group');
        if (password.length === 0) {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('error', 'success');
            return;
        }
        const hasLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (hasLength && hasLetter && hasNumber) {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.add('success');
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('error');
        }
        else {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.add('error');
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('success');
        }
    });
    console.log('✅ 비밀번호 검증 초기화 완료');
};
const initSignupEmailValidation = () => {
    const emailInput = document.getElementById('email');
    if (!emailInput)
        return;
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value;
        const formGroup = emailInput.closest('.form-group');
        if (email === '') {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('error', 'success');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.add('success');
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('error');
        }
        else {
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.add('error');
            formGroup === null || formGroup === void 0 ? void 0 : formGroup.classList.remove('success');
        }
    });
    console.log('✅ 이메일 검증 초기화 완료');
};
const initSignupTermsLinks = () => {
    const termsLinks = document.querySelectorAll('.terms-link');
    termsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('약관 내용 보기 기능은 준비 중입니다.');
        });
    });
    console.log('✅ 약관 링크 초기화 완료');
};
const initSignup = () => {
    console.log('🎬 ChaekMate Signup 초기화 시작...');
    initSignupForm();
    initSignupAgreeAll();
    initSignupSocial();
    initSignupPasswordValidation();
    initSignupEmailValidation();
    initSignupTermsLinks();
    console.log('✨ ChaekMate Signup 초기화 완료!');
};
document.addEventListener('DOMContentLoaded', initSignup);
