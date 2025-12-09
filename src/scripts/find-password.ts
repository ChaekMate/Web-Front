/**
 * ChaekMate Find Password TypeScript
 * 비밀번호 찾기 페이지 기능 관리
 */

console.log('🔑 ChaekMate Find Password 로드 완료!');

let currentStep = 1;
let userEmail = '';
let timerInterval: number | null = null;

// ==================== 단계 이동 ====================
function goToStep(step: number): void {
    // 이전 단계 비활성화
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    // 새 단계 활성화
    const stepContent = document.getElementById(`step${step}`);
    if (stepContent) {
        stepContent.classList.add('active');
    }

    document.querySelectorAll('.step').forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('active');
        }
    });

    currentStep = step;
    console.log('단계 이동:', step);

    // 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== Step 1: 이메일 입력 ====================
function initStep1(): void {
    const emailForm = document.getElementById('emailForm') as HTMLFormElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;

    emailForm?.addEventListener('submit', async (e: Event) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 형식이 아닙니다.');
            return;
        }

        console.log('이메일 확인:', email);

        // TODO: API 호출하여 이메일 존재 여부 확인
        // const response = await fetch('/api/auth/check-email', { ... });

        // 더미: 성공 시뮬레이션
        userEmail = email;

        // 이메일 표시
        const emailDisplay = document.getElementById('emailDisplay');
        if (emailDisplay) {
            emailDisplay.textContent = email;
        }

        // 다음 단계로
        goToStep(2);
        startTimer();
    });

    console.log('✅ Step 1 초기화 완료');
}

// ==================== Step 2: 인증번호 확인 ====================
function startTimer(): void {
    let timeLeft = 180; // 3분

    const timerEl = document.getElementById('timer');

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = window.setInterval(() => {
        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        if (timerEl) {
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval!);
            alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
            goToStep(1);
        }
    }, 1000);
}

function initStep2(): void {
    const verifyForm = document.getElementById('verifyForm') as HTMLFormElement;
    const verifyCodeInput = document.getElementById('verifyCode') as HTMLInputElement;
    const resendBtn = document.getElementById('resendBtn');

    // 재전송 버튼
    resendBtn?.addEventListener('click', () => {
        console.log('인증번호 재전송:', userEmail);

        // TODO: API 호출하여 인증번호 재전송
        // await fetch('/api/auth/resend-code', { ... });

        alert('인증번호가 재전송되었습니다.');
        startTimer();
    });

    // 인증번호 확인
    verifyForm?.addEventListener('submit', async (e: Event) => {
        e.preventDefault();

        const code = verifyCodeInput.value.trim();

        if (!code || code.length !== 6) {
            alert('6자리 인증번호를 입력해주세요.');
            return;
        }

        console.log('인증번호 확인:', code);

        // TODO: API 호출하여 인증번호 확인
        // const response = await fetch('/api/auth/verify-code', { ... });

        // 더미: 성공 시뮬레이션
        if (code === '123456') {
            clearInterval(timerInterval!);
            goToStep(3);
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    });

    console.log('✅ Step 2 초기화 완료');
}

// ==================== Step 3: 비밀번호 재설정 ====================
function initStep3(): void {
    const passwordForm = document.getElementById('passwordForm') as HTMLFormElement;
    const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    const passwordHelp = document.getElementById('passwordHelp');
    const confirmHelp = document.getElementById('confirmHelp');

    // 비밀번호 강도 체크
    newPasswordInput?.addEventListener('input', () => {
        const password = newPasswordInput.value;
        checkPasswordStrength(password);
        checkPasswordRules(password);
    });

    // 비밀번호 확인
    confirmPasswordInput?.addEventListener('input', () => {
        const password = newPasswordInput.value;
        const confirm = confirmPasswordInput.value;

        if (!confirmHelp) return;

        if (confirm.length === 0) {
            confirmHelp.textContent = '';
            confirmHelp.className = 'help-text-inline';
        } else if (password === confirm) {
            confirmHelp.textContent = '✓ 비밀번호가 일치합니다';
            confirmHelp.className = 'help-text-inline success';
        } else {
            confirmHelp.textContent = '✗ 비밀번호가 일치하지 않습니다';
            confirmHelp.className = 'help-text-inline error';
        }
    });

    // 폼 제출
    passwordForm?.addEventListener('submit', async (e: Event) => {
        e.preventDefault();

        const password = newPasswordInput.value;
        const confirm = confirmPasswordInput.value;

        // 유효성 검사
        if (!isPasswordValid(password)) {
            alert('비밀번호 규칙을 만족하지 않습니다.');
            return;
        }

        if (password !== confirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        console.log('비밀번호 변경 요청');

        // TODO: API 호출하여 비밀번호 변경
        // await fetch('/api/auth/reset-password', { ... });

        // 완료 화면으로
        document.getElementById('step3')?.classList.remove('active');
        document.getElementById('complete')?.classList.add('active');
    });

    console.log('✅ Step 3 초기화 완료');
}

// ==================== 비밀번호 강도 체크 ====================
function checkPasswordStrength(password: string): void {
    const strengthBar = document.querySelector('.strength-bar') as HTMLElement;

    if (!strengthBar) return;

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    strengthBar.className = 'strength-bar';

    if (strength <= 1) {
        strengthBar.classList.add('weak');
    } else if (strength <= 3) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
}

// ==================== 비밀번호 규칙 체크 ====================
function checkPasswordRules(password: string): void {
    const rule1 = document.getElementById('rule1');
    const rule2 = document.getElementById('rule2');
    const rule3 = document.getElementById('rule3');
    const rule4 = document.getElementById('rule4');

    if (rule1) {
        rule1.className = password.length >= 8 ? 'valid' : '';
    }

    if (rule2) {
        rule2.className = /[a-zA-Z]/.test(password) ? 'valid' : '';
    }

    if (rule3) {
        rule3.className = /[0-9]/.test(password) ? 'valid' : '';
    }

    if (rule4) {
        rule4.className = /[^a-zA-Z0-9]/.test(password) ? 'valid' : '';
    }
}

// ==================== 비밀번호 유효성 검사 ====================
function isPasswordValid(password: string): boolean {
    return (
        password.length >= 8 &&
        /[a-zA-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^a-zA-Z0-9]/.test(password)
    );
}

// ==================== 메인 초기화 ====================
function initFindPassword(): void {
    console.log('🎬 ChaekMate Find Password 초기화 시작...');

    initStep1();
    initStep2();
    initStep3();

    console.log('✨ ChaekMate Find Password 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFindPassword);
} else {
    initFindPassword();
}

export { initFindPassword };