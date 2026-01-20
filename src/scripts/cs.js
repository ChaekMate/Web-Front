/**
 * ChaekMate Customer Service TypeScript
 * 고객센터 페이지 기능 관리
 */
console.log('📞 ChaekMate CS 로드 완료!');
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
            // FAQ 필터링
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
}
// ==================== 탭 전환 ====================
function initTabs() {
    const tabs = document.querySelectorAll('.cs-tab');
    const contents = document.querySelectorAll('.cs-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 모든 탭 비활성화
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            // 클릭한 탭 활성화
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId || '');
            targetContent === null || targetContent === void 0 ? void 0 : targetContent.classList.add('active');
            console.log('탭 전환:', targetId);
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
            // 모든 카테고리 비활성화
            categories.forEach(c => c.classList.remove('active'));
            // 클릭한 카테고리 활성화
            category.classList.add('active');
            const selectedCategory = category.getAttribute('data-category');
            console.log('카테고리 필터:', selectedCategory);
            // FAQ 아이템 필터링
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
            // 이미 열려있으면 닫기
            if (faqItem === null || faqItem === void 0 ? void 0 : faqItem.classList.contains('active')) {
                faqItem.classList.remove('active');
            }
            else {
                // 다른 항목들 닫기
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                // 클릭한 항목 열기
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
    inquiryForm === null || inquiryForm === void 0 ? void 0 : inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('inquiryCategory').value;
        const title = document.getElementById('inquiryTitle').value;
        const content = document.getElementById('inquiryContent').value;
        const email = document.getElementById('inquiryEmail').value;
        console.log('문의 제출:', { category, title, content, email });
        // TODO: API 호출
        alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
        // 폼 초기화
        inquiryForm.reset();
    });
    cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', () => {
        if (confirm('작성 중인 내용을 취소하시겠습니까?')) {
            inquiryForm.reset();
        }
    });
    console.log('✅ 문의 폼 초기화 완료');
}
// ==================== 내 문의 상세보기 ====================
function initMyInquiries() {
    const detailBtns = document.querySelectorAll('.inquiry-detail-btn');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            var _a;
            const item = btn.closest('.inquiry-item');
            const title = (_a = item === null || item === void 0 ? void 0 : item.querySelector('.inquiry-title')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('문의 상세:', title);
            alert('문의 상세 페이지는 준비 중입니다.');
            // TODO: 상세 페이지로 이동
        });
    });
    console.log('✅ 내 문의 초기화 완료');
}
// ==================== 공지사항 클릭 ====================
function initNotices() {
    const noticeItems = document.querySelectorAll('.notice-item');
    noticeItems.forEach(item => {
        item.addEventListener('click', () => {
            var _a;
            const title = (_a = item.querySelector('.notice-title')) === null || _a === void 0 ? void 0 : _a.textContent;
            console.log('공지사항:', title);
            alert('공지사항 상세 페이지는 준비 중입니다.');
            // TODO: 상세 페이지로 이동
        });
    });
    console.log('✅ 공지사항 초기화 완료');
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
                // 탭 전환
                const targetTab = document.querySelector(`[data-tab="${targetId}"]`);
                if (targetTab) {
                    targetTab.dispatchEvent(new Event('click'));
                    // 스크롤
                    const targetContent = document.getElementById(targetId);
                    targetContent === null || targetContent === void 0 ? void 0 : targetContent.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    console.log('✅ 빠른 메뉴 초기화 완료');
}
// ==================== 페이지네이션 ====================
function initPagination() {
    const pageNums = document.querySelectorAll('.page-num');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    pageNums.forEach(pageNum => {
        pageNum.addEventListener('click', () => {
            // 모든 페이지 번호 비활성화
            pageNums.forEach(p => p.classList.remove('active'));
            // 클릭한 페이지 활성화
            pageNum.classList.add('active');
            const page = pageNum.textContent;
            console.log('페이지 이동:', page);
            // TODO: 페이지 데이터 로드
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener('click', () => {
        console.log('이전 페이지');
        // TODO: 이전 페이지 로드
    });
    nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener('click', () => {
        console.log('다음 페이지');
        // TODO: 다음 페이지 로드
    });
    console.log('✅ 페이지네이션 초기화 완료');
}
// ==================== URL 해시 처리 ====================
function handleURLHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        // 탭 전환
        const targetTab = document.querySelector(`[data-tab="${hash}"]`);
        if (targetTab) {
            setTimeout(() => {
                targetTab.dispatchEvent(new Event('click'));
                // 스크롤
                const targetContent = document.getElementById(hash);
                targetContent === null || targetContent === void 0 ? void 0 : targetContent.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    console.log('✅ URL 해시 처리 완료');
}
// ==================== 메인 초기화 ====================
function initCS() {
    console.log('🎬 ChaekMate CS 초기화 시작...');
    initSearch();
    initCSSearch();
    initTabs();
    initFAQCategories();
    initFAQAccordion();
    initInquiryForm();
    initMyInquiries();
    initNotices();
    initQuickMenu();
    initPagination();
    handleURLHash();
    console.log('✨ ChaekMate CS 초기화 완료!');
}
// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCS);
}
else {
    initCS();
}
export { initCS };
