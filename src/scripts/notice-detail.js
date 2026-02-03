/**
 * ChaekMate Notice Detail TypeScript
 * 공지사항 상세 페이지 기능 관리
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log('📄 ChaekMate Notice Detail 로드 완료!');
// ==================== API 설정 ====================
const API_BASE_URL = 'http://localhost:8000';
// JWT 토큰 가져오기
function getToken() {
    return localStorage.getItem('access_token');
}
// 헤더 설정
function getAuthHeaders() {
    const token = getToken();
    return Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Bearer ${token}` } : {}));
}
// 현재 사용자 정보 가져오기
function getCurrentUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = getToken();
            if (!token)
                return null;
            const response = yield fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                return yield response.json();
            }
            return null;
        }
        catch (error) {
            console.error('사용자 정보 조회 실패:', error);
            return null;
        }
    });
}
// ==================== URL 파라미터 가져오기 ====================
function getNoticeIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}
// ==================== 공지사항 불러오기 ====================
function loadNoticeDetail() {
    return __awaiter(this, void 0, void 0, function* () {
        const noticeId = getNoticeIdFromURL();
        if (!noticeId) {
            showError();
            return;
        }
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/notices/${noticeId}`);
            if (!response.ok) {
                showError();
                return;
            }
            const notice = yield response.json();
            renderNoticeDetail(notice);
            // 관리자 권한 확인
            const user = yield getCurrentUser();
            if (user === null || user === void 0 ? void 0 : user.is_admin) {
                showAdminActions(noticeId);
            }
            // 이전/다음 글 로드
            yield loadAdjacentNotices(noticeId);
        }
        catch (error) {
            console.error('공지사항 로드 오류:', error);
            showError();
        }
    });
}
// ==================== 공지사항 렌더링 ====================
function renderNoticeDetail(notice) {
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
function showAdminActions(noticeId) {
    const adminActions = document.getElementById('adminActions');
    if (!adminActions)
        return;
    adminActions.style.display = 'flex';
    // 수정 버튼
    const btnEdit = document.getElementById('btnEdit');
    btnEdit === null || btnEdit === void 0 ? void 0 : btnEdit.addEventListener('click', () => {
        // 수정 페이지로 이동 또는 모달 표시
        // 여기서는 고객센터 페이지의 수정 모달을 재사용할 수 있습니다
        alert('수정 기능은 고객센터 페이지에서 사용 가능합니다.');
        window.location.href = '/cs.html#notice';
    });
    // 삭제 버튼
    const btnDelete = document.getElementById('btnDelete');
    btnDelete === null || btnDelete === void 0 ? void 0 : btnDelete.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?'))
            return;
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/notices/admin/${noticeId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                alert('공지사항이 삭제되었습니다.');
                window.location.href = '/cs.html#notice';
            }
            else {
                const error = yield response.json();
                alert(error.detail || '공지사항 삭제에 실패했습니다.');
            }
        }
        catch (error) {
            console.error('공지사항 삭제 오류:', error);
            alert('공지사항 삭제 중 오류가 발생했습니다.');
        }
    }));
}
// ==================== 이전/다음 글 로드 ====================
function loadAdjacentNotices(currentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 공지사항 목록을 가져와서 이전/다음 글 찾기
            const response = yield fetch(`${API_BASE_URL}/api/v1/notices?skip=0&limit=100`);
            if (!response.ok)
                return;
            const data = yield response.json();
            const notices = data.notices;
            // 현재 공지사항의 인덱스 찾기
            const currentIndex = notices.findIndex(n => n.id === currentId);
            if (currentIndex === -1)
                return;
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
        }
        catch (error) {
            console.error('이전/다음 글 로드 오류:', error);
        }
    });
}
// ==================== 이전 글 표시 ====================
function showPrevNotice(notice) {
    const prevNotice = document.getElementById('prevNotice');
    const prevNoticeLink = document.getElementById('prevNoticeLink');
    const prevNoticeTitle = document.getElementById('prevNoticeTitle');
    if (prevNotice && prevNoticeLink && prevNoticeTitle) {
        prevNotice.style.display = 'flex';
        prevNoticeLink.href = `/notice-detail.html?id=${notice.id}`;
        prevNoticeTitle.textContent = notice.title;
    }
}
// ==================== 다음 글 표시 ====================
function showNextNotice(notice) {
    const nextNotice = document.getElementById('nextNotice');
    const nextNoticeLink = document.getElementById('nextNoticeLink');
    const nextNoticeTitle = document.getElementById('nextNoticeTitle');
    if (nextNotice && nextNoticeLink && nextNoticeTitle) {
        nextNotice.style.display = 'flex';
        nextNoticeLink.href = `/notice-detail.html?id=${notice.id}`;
        nextNoticeTitle.textContent = notice.title;
    }
}
// ==================== 로딩 숨기기 ====================
function hideLoading() {
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.style.display = 'none';
    }
}
// ==================== 에러 표시 ====================
function showError() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    if (loadingState)
        loadingState.style.display = 'none';
    if (errorState)
        errorState.style.display = 'block';
}
// ==================== 검색 기능 ====================
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const handleSearch = () => {
        const keyword = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
        if (keyword) {
            window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
        }
    };
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', handleSearch);
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}
// ==================== 유틸리티 함수 ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthStr = month < 10 ? '0' + month : String(month);
    const dayStr = day < 10 ? '0' + day : String(day);
    return `${year}-${monthStr}-${dayStr}`;
}
function getNoticeTypeLabel(type) {
    const labels = {
        'important': '중요',
        'notice': '공지',
        'update': '업데이트',
        'event': '이벤트',
        'maintenance': '점검'
    };
    return labels[type] || type;
}
function formatContent(content) {
    // 줄바꿈을 <p> 태그로 변환
    return content
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('');
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// ==================== 메인 초기화 ====================
function initNoticeDetail() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🎬 Notice Detail 초기화 시작...');
        initSearch();
        yield loadNoticeDetail();
        console.log('✨ Notice Detail 초기화 완료!');
    });
}
// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNoticeDetail);
}
else {
    initNoticeDetail();
}
export { initNoticeDetail };
