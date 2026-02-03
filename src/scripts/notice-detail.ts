/**
 * ChaekMate Notice Detail TypeScript
 * 공지사항 상세 페이지 기능 관리
 */

console.log('📄 ChaekMate Notice Detail 로드 완료!');

// ==================== 타입 정의 ====================
interface Notice {
    id: number;
    author_id: number;
    type: 'important' | 'notice' | 'update' | 'event' | 'maintenance';
    title: string;
    content: string;
    is_published: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
    author_email?: string;
}

interface User {
    id: number;
    email: string;
    name: string;
    is_admin: boolean;
}

// ==================== API 설정 ====================
const API_BASE_URL = 'http://localhost:8000';

// JWT 토큰 가져오기
function getToken(): string | null {
    return localStorage.getItem('access_token');
}

// 헤더 설정
function getAuthHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

// 현재 사용자 정보 가져오기
async function getCurrentUser(): Promise<User | null> {
    try {
        const token = getToken();
        if (!token) return null;

        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return null;
    }
}

// ==================== URL 파라미터 가져오기 ====================
function getNoticeIdFromURL(): number | null {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// ==================== 공지사항 불러오기 ====================
async function loadNoticeDetail(): Promise<void> {
    const noticeId = getNoticeIdFromURL();

    if (!noticeId) {
        showError();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/notices/${noticeId}`);

        if (!response.ok) {
            showError();
            return;
        }

        const notice: Notice = await response.json();
        renderNoticeDetail(notice);

        // 관리자 권한 확인
        const user = await getCurrentUser();
        if (user?.is_admin) {
            showAdminActions(noticeId);
        }

        // 이전/다음 글 로드
        await loadAdjacentNotices(noticeId);

    } catch (error) {
        console.error('공지사항 로드 오류:', error);
        showError();
    }
}

// ==================== 공지사항 렌더링 ====================
function renderNoticeDetail(notice: Notice): void {
    // 로딩 상태 숨기기
    hideLoading();

    // 공지사항 컨텐츠 표시
    const noticeDetail = document.getElementById('noticeDetail');
    if (noticeDetail) {
        noticeDetail.style.display = 'block';
    }

    // 배지
    const badge = document.getElementById('noticeBadge');
    if (badge) {
        badge.className = `notice-badge ${notice.type}`;
        badge.textContent = getNoticeTypeLabel(notice.type);
    }

    // 제목
    const title = document.getElementById('noticeTitle');
    if (title) {
        title.textContent = notice.title;
    }

    // 날짜
    const date = document.getElementById('noticeDate');
    if (date) {
        date.textContent = formatDate(notice.created_at);
    }

    // 조회수
    const views = document.getElementById('noticeViews');
    if (views) {
        views.textContent = notice.view_count.toString();
    }

    // 내용
    const content = document.getElementById('noticeContent');
    if (content) {
        content.innerHTML = formatContent(notice.content);
    }
}

// ==================== 관리자 액션 버튼 표시 ====================
function showAdminActions(noticeId: number): void {
    const adminActions = document.getElementById('adminActions');
    if (!adminActions) return;

    adminActions.style.display = 'flex';

    // 수정 버튼
    const btnEdit = document.getElementById('btnEdit');
    btnEdit?.addEventListener('click', () => {
        // 수정 페이지로 이동 또는 모달 표시
        // 여기서는 고객센터 페이지의 수정 모달을 재사용할 수 있습니다
        alert('수정 기능은 고객센터 페이지에서 사용 가능합니다.');
        window.location.href = '/cs.html#notice';
    });

    // 삭제 버튼
    const btnDelete = document.getElementById('btnDelete');
    btnDelete?.addEventListener('click', async () => {
        if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/notices/admin/${noticeId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                alert('공지사항이 삭제되었습니다.');
                window.location.href = '/cs.html#notice';
            } else {
                const error = await response.json();
                alert(error.detail || '공지사항 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('공지사항 삭제 오류:', error);
            alert('공지사항 삭제 중 오류가 발생했습니다.');
        }
    });
}

// ==================== 이전/다음 글 로드 ====================
async function loadAdjacentNotices(currentId: number): Promise<void> {
    try {
        // 공지사항 목록을 가져와서 이전/다음 글 찾기
        const response = await fetch(`${API_BASE_URL}/api/v1/notices?skip=0&limit=100`);
        
        if (!response.ok) return;

        const data = await response.json();
        const notices: Notice[] = data.notices;

        // 현재 공지사항의 인덱스 찾기
        const currentIndex = notices.findIndex(n => n.id === currentId);
        
        if (currentIndex === -1) return;

        // 이전 글 (더 최신 글)
        if (currentIndex > 0) {
            const prevNotice = notices[currentIndex - 1];
            showPrevNotice(prevNotice);
        }

        // 다음 글 (더 오래된 글)
        if (currentIndex < notices.length - 1) {
            const nextNotice = notices[currentIndex + 1];
            showNextNotice(nextNotice);
        }

    } catch (error) {
        console.error('이전/다음 글 로드 오류:', error);
    }
}

// ==================== 이전 글 표시 ====================
function showPrevNotice(notice: Notice): void {
    const prevNotice = document.getElementById('prevNotice');
    const prevNoticeLink = document.getElementById('prevNoticeLink') as HTMLAnchorElement;
    const prevNoticeTitle = document.getElementById('prevNoticeTitle');

    if (prevNotice && prevNoticeLink && prevNoticeTitle) {
        prevNotice.style.display = 'flex';
        prevNoticeLink.href = `/notice-detail.html?id=${notice.id}`;
        prevNoticeTitle.textContent = notice.title;
    }
}

// ==================== 다음 글 표시 ====================
function showNextNotice(notice: Notice): void {
    const nextNotice = document.getElementById('nextNotice');
    const nextNoticeLink = document.getElementById('nextNoticeLink') as HTMLAnchorElement;
    const nextNoticeTitle = document.getElementById('nextNoticeTitle');

    if (nextNotice && nextNoticeLink && nextNoticeTitle) {
        nextNotice.style.display = 'flex';
        nextNoticeLink.href = `/notice-detail.html?id=${notice.id}`;
        nextNoticeTitle.textContent = notice.title;
    }
}

// ==================== 로딩 숨기기 ====================
function hideLoading(): void {
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.style.display = 'none';
    }
}

// ==================== 에러 표시 ====================
function showError(): void {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'block';
}

// ==================== 검색 기능 ====================
function initSearch(): void {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    const handleSearch = (): void => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };

    searchBtn?.addEventListener('click', handleSearch);

    searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// ==================== 유틸리티 함수 ====================
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const monthStr = month < 10 ? '0' + month : String(month);
    const dayStr = day < 10 ? '0' + day : String(day);
    
    return `${year}-${monthStr}-${dayStr}`;
}

function getNoticeTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
        'important': '중요',
        'notice': '공지',
        'update': '업데이트',
        'event': '이벤트',
        'maintenance': '점검'
    };
    return labels[type] || type;
}

function formatContent(content: string): string {
    // 줄바꿈을 <p> 태그로 변환
    return content
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('');
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== 메인 초기화 ====================
async function initNoticeDetail(): Promise<void> {
    console.log('🎬 Notice Detail 초기화 시작...');

    initSearch();
    await loadNoticeDetail();

    console.log('✨ Notice Detail 초기화 완료!');
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNoticeDetail);
} else {
    initNoticeDetail();
}

export { initNoticeDetail };