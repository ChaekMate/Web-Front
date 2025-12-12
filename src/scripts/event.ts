/**
 * ChaekMate Event TypeScript
 * 이벤트 페이지 기능 관리
 */

console.log('🎉 ChaekMate Event 로드 완료!');

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
        if (e.key === 'Enter') handleSearch();
    });
}

function initTabs(): void {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const eventCards = document.querySelectorAll('.event-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            eventCards.forEach(card => {
                const status = card.getAttribute('data-status');
                if (tab === 'all' || tab === status) {
                    (card as HTMLElement).style.display = 'block';
                } else {
                    (card as HTMLElement).style.display = 'none';
                }
            });

            console.log('탭 변경:', tab);
        });
    });
}

function initEventClick(): void {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('이벤트 클릭');
            // TODO: 이벤트 상세 페이지로 이동
        });
    });
}

function initEvent(): void {
    console.log('🎬 ChaekMate Event 초기화 시작...');
    initSearch();
    initTabs();
    initEventClick();
    console.log('✨ ChaekMate Event 초기화 완료!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvent);
} else {
    initEvent();
}

export { initEvent };