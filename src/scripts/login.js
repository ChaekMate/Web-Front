console.log('🔐 ChaekMate Login 로드 완료!');
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
// 로그인 API 호출
const login = async (email, password) => {
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
    }
    catch (error) {
        throw error;
    }
};
// 로그인 폼 처리
const initLoginForm = () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error('loginForm을 찾을 수 없습니다.');
        return;
    }
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
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
        }
        catch (error) {
            console.error('❌ 로그인 실패:', error);
            alert(error.message || '로그인 중 오류가 발생했습니다.');
        }
    });
    console.log('✅ 로그인 폼 초기화 완료');
};
// 소셜 로그인 버튼 처리
const initSocialLogin = () => {
    const googleBtn = document.querySelector('.btn-google');
    const kakaoBtn = document.querySelector('.btn-kakao');
    const naverBtn = document.querySelector('.btn-naver');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Google 로그인 기능은 준비 중입니다!');
        });
    }
    if (kakaoBtn) {
        kakaoBtn.addEventListener('click', () => {
            alert('Kakao 로그인 기능은 준비 중입니다!');
        });
    }
    if (naverBtn) {
        naverBtn.addEventListener('click', () => {
            alert('Naver 로그인 기능은 준비 중입니다!');
        });
    }
    console.log('✅ 소셜 로그인 버튼 초기화 완료');
};
// 메인 초기화
const initLogin = () => {
    console.log('🎬 Login 초기화 시작...');
    initLoginForm();
    initSocialLogin();
    console.log('✨ Login 초기화 완료!');
};
document.addEventListener('DOMContentLoaded', initLogin);
