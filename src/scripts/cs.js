/**
 * ChaekMate Customer Service TypeScript
 * 고객센터 페이지 기능 관리 - 백엔드 API 연동
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
console.log('📞 ChaekMate CS 로드 완료!');
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
    console.log('✅ 검색 기능 초기화 완료');
}
// ==================== CS 검색 ====================
function initCSSearch() {
    const csSearchBtn = document.getElementById('csSearchBtn');
    const csSearchInput = document.getElementById('csSearchInput');
    const handleCSSearch = () => {
        const keyword = csSearchInput === null || csSearchInput === void 0 ? void 0 : csSearchInput.value.trim();
        if (keyword) {
            console.log('CS 검색:', keyword);
            filterFAQ(keyword);
        }
    };
    csSearchBtn === null || csSearchBtn === void 0 ? void 0 : csSearchBtn.addEventListener('click', handleCSSearch);
    csSearchInput === null || csSearchInput === void 0 ? void 0 : csSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleCSSearch();
        }
    });
    console.log('✅ CS 검색 초기화 완료');
}
function filterFAQ(keyword) {
    const faqItems = document.querySelectorAll('.faq-item');
    let visibleCount = 0;
    faqItems.forEach(item => {
        var _a, _b, _c, _d;
        const title = ((_b = (_a = item.querySelector('.faq-title')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
        const answer = ((_d = (_c = item.querySelector('.faq-answer')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
        const searchTerm = keyword.toLowerCase();
        if (title.includes(searchTerm) || answer.includes(searchTerm)) {
            item.classList.remove('hidden');
            visibleCount++;
        }
        else {
            item.classList.add('hidden');
        }
    });
    console.log(`검색 결과: ${visibleCount}개`);
    if (visibleCount > 0) {
        const faqTab = document.querySelector('[data-tab="faq"]');
        if (faqTab) {
            faqTab.dispatchEvent(new Event('click'));
        }
    }
}
// ==================== 탭 전환 ====================
function initTabs() {
    const tabs = document.querySelectorAll('.cs-tab');
    const contents = document.querySelectorAll('.cs-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId || '');
            targetContent === null || targetContent === void 0 ? void 0 : targetContent.classList.add('active');
            console.log('탭 전환:', targetId);
            // 문의 탭으로 전환 시 데이터 로드
            if (targetId === 'inquiry') {
                loadInquiries();
            }
            else if (targetId === 'notice') {
                loadNotices();
            }
        });
    });
    console.log('✅ 탭 전환 초기화 완료');
}
// ==================== FAQ 카테고리 필터 ====================
function initFAQCategories() {
    const categories = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            const selectedCategory = category.getAttribute('data-category');
            console.log('카테고리 필터:', selectedCategory);
            faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.classList.remove('hidden');
                }
                else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    console.log('✅ FAQ 카테고리 초기화 완료');
}
// ==================== FAQ 아코디언 ====================
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            if (faqItem === null || faqItem === void 0 ? void 0 : faqItem.classList.contains('active')) {
                faqItem.classList.remove('active');
            }
            else {
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                faqItem === null || faqItem === void 0 ? void 0 : faqItem.classList.add('active');
            }
        });
    });
    console.log('✅ FAQ 아코디언 초기화 완료');
}
// ==================== 1:1 문의 폼 ====================
function initInquiryForm() {
    const inquiryForm = document.getElementById('inquiryForm');
    const cancelBtn = document.getElementById('inquiryCancelBtn');
    inquiryForm === null || inquiryForm === void 0 ? void 0 : inquiryForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const category = document.getElementById('inquiryCategory').value;
        const title = document.getElementById('inquiryTitle').value;
        const content = document.getElementById('inquiryContent').value;
        if (!category || !title || !content) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/inquiries`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    category,
                    title,
                    content
                })
            });
            if (response.ok) {
                alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
                inquiryForm.reset();
                // 내 문의 내역 새로고침
                yield loadInquiries();
                // 내 문의 내역으로 스크롤
                setTimeout(() => {
                    const myInquiriesSection = document.querySelector('.my-inquiries-section');
                    myInquiriesSection === null || myInquiriesSection === void 0 ? void 0 : myInquiriesSection.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
            else {
                const error = yield response.json();
                alert(error.detail || '문의 접수에 실패했습니다.');
            }
        }
        catch (error) {
            console.error('문의 제출 오류:', error);
            alert('문의 접수 중 오류가 발생했습니다.');
        }
    }));
    cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', () => {
        if (confirm('작성 중인 내용을 취소하시겠습니까?')) {
            inquiryForm.reset();
        }
    });
    console.log('✅ 문의 폼 초기화 완료');
}
// ==================== 문의 목록 로드 ====================
function loadInquiries() {
    return __awaiter(this, arguments, void 0, function* (page = 1, statusFilter) {
        try {
            const user = yield getCurrentUser();
            if (!user) {
                showLoginRequired();
                return;
            }
            // ✅ 관리자/사용자 UI 전환
            toggleInquiryUI(user.is_admin);
            const limit = 10;
            const skip = (page - 1) * limit;
            let url = user.is_admin
                ? `${API_BASE_URL}/api/v1/inquiries/admin?skip=${skip}&limit=${limit}`
                : `${API_BASE_URL}/api/v1/inquiries/my?skip=${skip}&limit=${limit}`;
            if (statusFilter) {
                url += `&status_filter=${statusFilter}`;
            }
            const response = yield fetch(url, {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = yield response.json();
                renderInquiries(data.inquiries, user.is_admin);
                renderPagination(data.total, page, limit);
            }
            else {
                console.error('문의 목록 로드 실패');
            }
        }
        catch (error) {
            console.error('문의 목록 로드 오류:', error);
        }
    });
}
// ==================== 관리자/사용자 UI 전환 ====================
function toggleInquiryUI(isAdmin) {
    const adminSection = document.querySelector('.admin-inquiry-section');
    const userSection = document.querySelector('.user-inquiry-section');
    if (isAdmin) {
        if (adminSection)
            adminSection.style.display = 'block';
        if (userSection)
            userSection.style.display = 'none';
        console.log('✅ 관리자 UI 활성화');
    }
    else {
        if (adminSection)
            adminSection.style.display = 'none';
        if (userSection)
            userSection.style.display = 'block';
        console.log('✅ 일반 사용자 UI 활성화');
    }
}
// ==================== 상태 필터 초기화 (관리자용) ====================
function initStatusFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const status = btn.getAttribute('data-status');
            const statusFilter = status === 'all' ? undefined : status;
            console.log('상태 필터:', status);
            loadInquiries(1, statusFilter);
        });
    });
    console.log('✅ 상태 필터 초기화 완료');
}
// ==================== 문의 목록 렌더링 ====================
function renderInquiries(inquiries, isAdmin) {
    const inquiryList = isAdmin
        ? document.querySelector('.admin-inquiry-section .inquiry-list')
        : document.querySelector('.user-inquiry-section .inquiry-list');
    if (!inquiryList) {
        console.error('inquiry-list를 찾을 수 없습니다. isAdmin:', isAdmin);
        return;
    }
    if (inquiries.length === 0) {
        inquiryList.innerHTML = `
            <div class="empty-state">
                <p style="text-align: center; padding: 60px 20px; color: #666; font-size: 16px;">
                    ${isAdmin ? '등록된 문의가 없습니다.' : '작성한 문의가 없습니다.'}
                </p>
            </div>
        `;
        return;
    }
    inquiryList.innerHTML = inquiries.map(inquiry => `
        <div class="inquiry-item">
            <div class="inquiry-header">
                <span class="inquiry-status ${inquiry.status === 'completed' ? 'completed' : 'pending'}">
                    ${inquiry.status === 'completed' ? '답변완료' : '답변대기'}
                </span>
                <span class="inquiry-date">${formatDate(inquiry.created_at)}</span>
            </div>
            <div class="inquiry-content">
                <div class="inquiry-category-badge">${getCategoryLabel(inquiry.category)}</div>
                <h3 class="inquiry-title">${escapeHtml(inquiry.title)}</h3>
                <p class="inquiry-preview">${escapeHtml(inquiry.content.substring(0, 100))}${inquiry.content.length > 100 ? '...' : ''}</p>
                ${isAdmin ? `<p class="inquiry-user-info" style="margin-top: 8px; font-size: 13px; color: #666;">문의자 ID: ${inquiry.user_id}</p>` : ''}
            </div>
            
            ${inquiry.status === 'completed' && inquiry.admin_reply ? `
                <div class="admin-answer">
                    <div class="answer-header">
                        <span class="answer-badge">📝 관리자 답변</span>
                        <span class="answer-date">${formatDate(inquiry.replied_at || inquiry.updated_at)}</span>
                    </div>
                    <div class="answer-content">
                        ${formatReply(inquiry.admin_reply)}
                    </div>
                </div>
            ` : ''}

            ${isAdmin && inquiry.status === 'pending' ? `
                <div class="admin-actions" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                    <button class="btn-reply" data-inquiry-id="${inquiry.id}">답변하기</button>
                </div>
            ` : ''}
        </div>
    `).join('');
    if (isAdmin) {
        document.querySelectorAll('.btn-reply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const inquiryId = e.target.dataset.inquiryId;
                if (inquiryId) {
                    showReplyModal(parseInt(inquiryId));
                }
            });
        });
    }
}
// ==================== 답변 모달 표시 ====================
function showReplyModal(inquiryId) {
    var _a, _b;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; background: white; padding: 40px; border: 3px solid #000; box-shadow: 8px 8px 0 #000;">
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">답변 작성</h2>
            <form id="replyForm">
                <textarea id="replyContent" class="form-textarea" rows="10" placeholder="답변 내용을 입력하세요" required style="width: 100%; padding: 16px; border: 2px solid #000; font-size: 14px; line-height: 1.6;"></textarea>
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button type="button" class="btn-cancel" id="modalCancelBtn" style="flex: 1; padding: 14px; border: 2px solid #000; background: white; font-weight: 600; cursor: pointer;">취소</button>
                    <button type="submit" class="btn-submit" style="flex: 1; padding: 14px; border: 2px solid #000; background: #000; color: white; font-weight: 600; cursor: pointer;">답변 등록</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    (_a = modal.querySelector('#modalCancelBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        modal.remove();
    });
    (_b = modal.querySelector('#replyForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const replyContent = document.getElementById('replyContent').value;
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/inquiries/admin/${inquiryId}/reply`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ admin_reply: replyContent })
            });
            if (response.ok) {
                alert('답변이 등록되었습니다.');
                modal.remove();
                yield loadInquiries();
            }
            else {
                const error = yield response.json();
                alert(error.detail || '답변 등록에 실패했습니다.');
            }
        }
        catch (error) {
            console.error('답변 등록 오류:', error);
            alert('답변 등록 중 오류가 발생했습니다.');
        }
    }));
    modal.addEventListener('click', (e) => {
        if (e.target === modal)
            modal.remove();
    });
}
// ==================== 페이지네이션 렌더링 ====================
function renderPagination(total, currentPage, limit) {
    const adminSection = document.querySelector('.admin-inquiry-section');
    const isAdminVisible = adminSection && adminSection.style.display !== 'none';
    const paginationContainer = isAdminVisible
        ? document.querySelector('.admin-inquiry-section .pagination')
        : document.querySelector('.user-inquiry-section .pagination');
    if (!paginationContainer) {
        console.error('pagination을 찾을 수 없습니다.');
        return;
    }
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    let paginationHTML = `
        <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">이전</button>
    `;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
        `;
    }
    paginationHTML += `
        <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">다음</button>
    `;
    paginationContainer.innerHTML = paginationHTML;
    paginationContainer.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = parseInt(e.target.dataset.page || '1');
            loadInquiries(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}
// ==================== 로그인 필요 메시지 ====================
function showLoginRequired() {
    const inquiryList = document.querySelector('.user-inquiry-section .inquiry-list');
    if (!inquiryList)
        return;
    inquiryList.innerHTML = `
        <div class="login-required" style="text-align: center; padding: 60px 20px;">
            <p style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">로그인이 필요한 서비스입니다</p>
            <p style="color: #666; margin-bottom: 24px;">문의 내역을 확인하려면 로그인해주세요.</p>
            <a href="/login.html" class="btn-submit" style="display: inline-block; padding: 14px 32px; background: #000; color: white; text-decoration: none; border: 2px solid #000; font-weight: 600;">로그인하기</a>
        </div>
    `;
}
// ==================== 공지사항 목록 로드 ====================
function loadNotices() {
    return __awaiter(this, arguments, void 0, function* (page = 1) {
        try {
            const user = yield getCurrentUser();
            const limit = 10;
            const skip = (page - 1) * limit;
            let url = (user === null || user === void 0 ? void 0 : user.is_admin)
                ? `${API_BASE_URL}/api/v1/notices/admin/all?skip=${skip}&limit=${limit}`
                : `${API_BASE_URL}/api/v1/notices?skip=${skip}&limit=${limit}`;
            const response = yield fetch(url, {
                headers: user ? getAuthHeaders() : { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const data = yield response.json();
                renderNotices(data.notices, (user === null || user === void 0 ? void 0 : user.is_admin) || false);
                renderNoticePagination(data.total, page, limit);
            }
        }
        catch (error) {
            console.error('공지사항 로드 오류:', error);
        }
    });
}
// ==================== 공지사항 렌더링 ====================
function renderNotices(notices, isAdmin) {
    const noticeList = document.querySelector('.notice-list');
    if (!noticeList)
        return;
    if (notices.length === 0) {
        noticeList.innerHTML = `
            <div class="empty-state">
                <p style="text-align: center; padding: 60px 20px; color: #666;">등록된 공지사항이 없습니다.</p>
            </div>
        `;
        return;
    }
    noticeList.innerHTML = notices.map(notice => `
        <div class="notice-item" data-notice-id="${notice.id}" style="cursor: pointer;">
            <span class="notice-badge ${notice.type}">${getNoticeTypeLabel(notice.type)}</span>
            <h3 class="notice-title">${escapeHtml(notice.title)}</h3>
            <span class="notice-date">${formatDate(notice.created_at)}</span>
            ${!notice.is_published ? '<span class="notice-unpublished" style="margin-left: 8px; padding: 2px 8px; background: #ccc; border-radius: 4px; font-size: 12px;">비공개</span>' : ''}
            ${isAdmin ? `
                <div class="notice-admin-actions" style="margin-top: 12px; display: flex; gap: 8px;">
                    <button class="btn-edit-notice" data-notice-id="${notice.id}" style="padding: 6px 12px; background: #4A90E2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">수정</button>
                    <button class="btn-delete-notice" data-notice-id="${notice.id}" style="padding: 6px 12px; background: #E74C3C; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">삭제</button>
                </div>
            ` : ''}
        </div>
    `).join('');
    if (isAdmin) {
        document.querySelectorAll('.btn-edit-notice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const noticeId = e.target.dataset.noticeId;
                if (noticeId)
                    showNoticeEditModal(parseInt(noticeId));
            });
        });
        document.querySelectorAll('.btn-delete-notice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const noticeId = e.target.dataset.noticeId;
                if (noticeId)
                    deleteNotice(parseInt(noticeId));
            });
        });
    }
    document.querySelectorAll('.notice-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('button'))
                return;
            const noticeId = item.dataset.noticeId;
            if (noticeId) {
                // 상세 페이지로 이동
                window.location.href = `/notice-detail.html?id=${noticeId}`;
            }
        });
    });
}
// ==================== 공지사항 작성 모달 ====================
function showNoticeCreateModal() {
    var _a, _b;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; background: white; padding: 40px; border: 3px solid #000; box-shadow: 8px 8px 0 #000;">
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">📢 공지사항 작성</h2>
            <form id="noticeCreateForm">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">유형</label>
                    <select id="noticeType" required style="width: 100%; padding: 12px; border: 2px solid #000; font-size: 14px;">
                        <option value="important">중요</option>
                        <option value="notice" selected>일반</option>
                        <option value="update">업데이트</option>
                        <option value="event">이벤트</option>
                        <option value="maintenance">점검</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">제목</label>
                    <input type="text" id="noticeTitle" required placeholder="공지사항 제목" style="width: 100%; padding: 12px; border: 2px solid #000; font-size: 14px;">
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">내용</label>
                    <textarea id="noticeContent" required rows="10" placeholder="공지사항 내용을 입력하세요" style="width: 100%; padding: 12px; border: 2px solid #000; font-size: 14px; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="noticePublished" checked style="width: 18px; height: 18px;">
                        <span style="font-weight: 600;">즉시 게시</span>
                    </label>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button type="button" class="btn-cancel" id="modalCancelBtn" style="flex: 1; padding: 14px; border: 2px solid #000; background: white; font-weight: 600; cursor: pointer;">취소</button>
                    <button type="submit" class="btn-submit" style="flex: 1; padding: 14px; border: 2px solid #000; background: #000; color: white; font-weight: 600; cursor: pointer;">작성 완료</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    (_a = modal.querySelector('#modalCancelBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => modal.remove());
    (_b = modal.querySelector('#noticeCreateForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const type = document.getElementById('noticeType').value;
        const title = document.getElementById('noticeTitle').value;
        const content = document.getElementById('noticeContent').value;
        const is_published = document.getElementById('noticePublished').checked;
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/notices/admin`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ type, title, content, is_published })
            });
            if (response.ok) {
                alert('공지사항이 작성되었습니다.');
                modal.remove();
                yield loadNotices();
            }
            else {
                const error = yield response.json();
                alert(error.detail || '공지사항 작성에 실패했습니다.');
            }
        }
        catch (error) {
            console.error('공지사항 작성 오류:', error);
            alert('공지사항 작성 중 오류가 발생했습니다.');
        }
    }));
    modal.addEventListener('click', (e) => {
        if (e.target === modal)
            modal.remove();
    });
}
// ==================== 공지사항 수정 모달 ====================
function showNoticeEditModal(noticeId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/notices/admin/${noticeId}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                alert('공지사항을 불러올 수 없습니다.');
                return;
            }
            const notice = yield response.json();
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; background: white; padding: 40px; border: 3px solid #000; box-shadow: 8px 8px 0 #000;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">✏️ 공지사항 수정</h2>
                <form id="noticeEditForm">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">유형</label>
                        <select id="noticeType" required style="width: 100%; padding: 12px; border: 2px solid #000; font-size: 14px;">
                            <option value="important" ${notice.type === 'important' ? 'selected' : ''}>중요</option>
                            <option value="notice" ${notice.type === 'notice' ? 'selected' : ''}>일반</option>
                            <option value="update" ${notice.type === 'update' ? 'selected' : ''}>업데이트</option>
                            <option value="event" ${notice.type === 'event' ? 'selected' : ''}>이벤트</option>
                            <option value="maintenance" ${notice.type === 'maintenance' ? 'selected' : ''}>점검</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">제목</label>
                        <input type="text" id="noticeTitle" required value="${escapeHtml(notice.title)}" style="width: 100%; padding: 12px; border: 2px solid #000; font-size: 14px;">
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">내용</label>
                        <textarea id="noticeContent" required rows="10" style="width: 100%; padding: 12px; border: 2px solid #000; font-size: 14px; line-height: 1.6;">${escapeHtml(notice.content)}</textarea>
                    </div>
                    <div class="form-group" style="margin-bottom: 24px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="noticePublished" ${notice.is_published ? 'checked' : ''} style="width: 18px; height: 18px;">
                            <span style="font-weight: 600;">게시 상태</span>
                        </label>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button type="button" class="btn-cancel" id="modalCancelBtn" style="flex: 1; padding: 14px; border: 2px solid #000; background: white; font-weight: 600; cursor: pointer;">취소</button>
                        <button type="submit" class="btn-submit" style="flex: 1; padding: 14px; border: 2px solid #000; background: #000; color: white; font-weight: 600; cursor: pointer;">수정 완료</button>
                    </div>
                </form>
            </div>
        `;
            document.body.appendChild(modal);
            (_a = modal.querySelector('#modalCancelBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => modal.remove());
            (_b = modal.querySelector('#noticeEditForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const type = document.getElementById('noticeType').value;
                const title = document.getElementById('noticeTitle').value;
                const content = document.getElementById('noticeContent').value;
                const is_published = document.getElementById('noticePublished').checked;
                try {
                    const response = yield fetch(`${API_BASE_URL}/api/v1/notices/admin/${noticeId}`, {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ type, title, content, is_published })
                    });
                    if (response.ok) {
                        alert('공지사항이 수정되었습니다.');
                        modal.remove();
                        yield loadNotices();
                    }
                    else {
                        const error = yield response.json();
                        alert(error.detail || '공지사항 수정에 실패했습니다.');
                    }
                }
                catch (error) {
                    console.error('공지사항 수정 오류:', error);
                    alert('공지사항 수정 중 오류가 발생했습니다.');
                }
            }));
            modal.addEventListener('click', (e) => {
                if (e.target === modal)
                    modal.remove();
            });
        }
        catch (error) {
            console.error('공지사항 수정 모달 오류:', error);
            alert('공지사항을 불러오는 중 오류가 발생했습니다.');
        }
    });
}
// ==================== 공지사항 삭제 ====================
function deleteNotice(noticeId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?'))
            return;
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/notices/admin/${noticeId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                alert('공지사항이 삭제되었습니다.');
                yield loadNotices();
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
    });
}
// ==================== 공지사항 상세보기 ====================
function showNoticeDetail(noticeId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield fetch(`${API_BASE_URL}/api/v1/notices/${noticeId}`);
            if (!response.ok) {
                alert('공지사항을 불러올 수 없습니다.');
                return;
            }
            const notice = yield response.json();
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; background: white; padding: 40px; border: 3px solid #000; box-shadow: 8px 8px 0 #000;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px;">
                    <div>
                        <span class="notice-badge ${notice.type}" style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; margin-bottom: 12px;">${getNoticeTypeLabel(notice.type)}</span>
                        <h2 style="font-size: 24px; font-weight: 700; margin: 0;">${escapeHtml(notice.title)}</h2>
                        <p style="color: #666; font-size: 14px; margin-top: 8px;">${formatDate(notice.created_at)} | 조회 ${notice.view_count}</p>
                    </div>
                </div>
                <div style="border-top: 2px solid #eee; padding-top: 24px; line-height: 1.8; white-space: pre-wrap;">
                    ${escapeHtml(notice.content)}
                </div>
                <button class="btn-submit" id="closeModalBtn" style="width: 100%; padding: 14px; border: 2px solid #000; background: #000; color: white; font-weight: 600; cursor: pointer; margin-top: 24px;">닫기</button>
            </div>
        `;
            document.body.appendChild(modal);
            (_a = modal.querySelector('#closeModalBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => modal.remove());
            modal.addEventListener('click', (e) => {
                if (e.target === modal)
                    modal.remove();
            });
        }
        catch (error) {
            console.error('공지사항 상세 조회 오류:', error);
            alert('공지사항을 불러오는 중 오류가 발생했습니다.');
        }
    });
}
// ==================== 공지사항 페이지네이션 ====================
function renderNoticePagination(total, currentPage, limit) {
    const paginationContainer = document.querySelector('#notice .pagination');
    if (!paginationContainer)
        return;
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    let paginationHTML = `
        <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">이전</button>
    `;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
        `;
    }
    paginationHTML += `
        <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">다음</button>
    `;
    paginationContainer.innerHTML = paginationHTML;
    paginationContainer.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = parseInt(e.target.dataset.page || '1');
            loadNotices(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}
// ==================== 공지사항 초기화 ====================
function initNotices() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getCurrentUser();
        if (user === null || user === void 0 ? void 0 : user.is_admin) {
            const noticeContent = document.querySelector('#notice');
            if (noticeContent) {
                const titleElement = noticeContent.querySelector('.section-title');
                if (titleElement && titleElement.parentElement) {
                    titleElement.parentElement.style.position = 'relative';
                    const createButton = document.createElement('button');
                    createButton.className = 'btn-create-notice';
                    createButton.textContent = '+ 공지사항 작성';
                    createButton.style.cssText = 'position: absolute; top: 0; right: 0; padding: 12px 24px; background: #4A90E2; color: white; border: 2px solid #000; border-radius: 4px; font-weight: 600; cursor: pointer; box-shadow: 4px 4px 0 #000;';
                    titleElement.parentElement.appendChild(createButton);
                    createButton.addEventListener('click', showNoticeCreateModal);
                }
            }
        }
        yield loadNotices();
        console.log('✅ 공지사항 초기화 완료');
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
function getCategoryLabel(category) {
    const labels = {
        'ai': 'AI 기능',
        'purchase': '도서 구매',
        'sns': '문장 SNS',
        'account': '계정',
        'bug': '오류 신고',
        'suggestion': '서비스 개선',
        'etc': '기타'
    };
    return labels[category] || category;
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
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function formatReply(reply) {
    return reply
        .split('\n')
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('');
}
// ==================== 빠른 메뉴 ====================
function initQuickMenu() {
    const quickItems = document.querySelectorAll('.quick-item');
    quickItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetTab = document.querySelector(`[data-tab="${targetId}"]`);
                if (targetTab) {
                    targetTab.dispatchEvent(new Event('click'));
                    setTimeout(() => {
                        const targetContent = document.getElementById(targetId);
                        targetContent === null || targetContent === void 0 ? void 0 : targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    });
    console.log('✅ 빠른 메뉴 초기화 완료');
}
// ==================== URL 해시 처리 ====================
function handleURLHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetTab = document.querySelector(`[data-tab="${hash}"]`);
        if (targetTab) {
            setTimeout(() => {
                targetTab.dispatchEvent(new Event('click'));
                const targetContent = document.getElementById(hash);
                targetContent === null || targetContent === void 0 ? void 0 : targetContent.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    console.log('✅ URL 해시 처리 완료');
}
// ==================== 메인 초기화 ====================
function initCS() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log('🎬 ChaekMate CS 초기화 시작...');
        initSearch();
        initCSSearch();
        initTabs();
        initFAQCategories();
        initFAQAccordion();
        initInquiryForm();
        initNotices();
        initQuickMenu();
        initStatusFilters();
        handleURLHash();
        const currentTab = (_a = document.querySelector('.cs-tab.active')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-tab');
        if (currentTab === 'inquiry') {
            yield loadInquiries();
        }
        else if (currentTab === 'notice') {
            yield loadNotices();
        }
        console.log('✨ ChaekMate CS 초기화 완료!');
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCS);
}
else {
    initCS();
}
export { initCS };
