/**
 * ChaekMate Event Detail TypeScript
 * 이벤트 상세 페이지 기능 관리
 */

console.log('🎉 ChaekMate Event Detail 로드 완료!');

interface EventData {
    id: string;
    title: string;
    period: string;
    description: string;
    status: 'ongoing' | 'upcoming' | 'ended';
    image: string;
    howTo: string[];
    notice: string[];
}

// 이벤트 더미 데이터
const eventDataMap: Record<string, EventData> = {
    '1': {
        id: '1',
        title: '신규회원 가입 시 즉시 1,000원 적립!',
        period: '2025.01.01 ~ 2025.12.31',
        description: '지금 가입하고 첫 구매 시 사용 가능한 적립금을 받으세요',
        status: 'ongoing',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23000' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='20'%3E신규회원 혜택%3C/text%3E%3C/svg%3E",
        howTo: [
            'ChaekMate 회원가입을 완료하세요',
            '가입 즉시 1,000원 적립금이 자동 지급됩니다',
            '첫 구매 시 적립금을 사용할 수 있습니다'
        ],
        notice: [
            '회원가입 시 자동으로 적립금이 지급됩니다',
            '적립금은 3만원 이상 구매 시 사용 가능합니다',
            '적립금 유효기간은 지급일로부터 1년입니다'
        ]
    },
    '2': {
        id: '2',
        title: '매일 출석체크로 최대 150원 적립',
        period: '2025.01.01 ~ 2025.12.31',
        description: '매일 방문하고 포인트를 쌓아보세요',
        status: 'ongoing',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23000' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='20'%3E출석체크%3C/text%3E%3C/svg%3E",
        howTo: [
            '마이페이지의 출석체크 메뉴를 클릭하세요',
            '매일 1회 출석체크가 가능합니다',
            '연속 출석 시 추가 보너스 포인트를 받을 수 있습니다'
        ],
        notice: [
            '하루 1회만 출석체크가 가능합니다',
            '출석체크 시간은 00:00 ~ 23:59입니다',
            '연속 출석 7일 달성 시 보너스 50원 추가 지급'
        ]
    },
    '3': {
        id: '3',
        title: '베스트 리뷰 이벤트',
        period: '2025.01.01 ~ 2025.01.31',
        description: '이달의 베스트 리뷰 작성자에게 5만원 상품권 증정',
        status: 'ongoing',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23000' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='20'%3E베스트리뷰%3C/text%3E%3C/svg%3E",
        howTo: [
            '구매한 도서에 대한 리뷰를 작성하세요',
            '사진과 함께 100자 이상의 리뷰를 남겨주세요',
            '매월 말일에 베스트 리뷰를 선정합니다'
        ],
        notice: [
            '구매 확정 후 작성한 리뷰만 참여 가능합니다',
            '당첨자는 다음 달 첫째 주에 개별 연락드립니다',
            '부적절한 내용의 리뷰는 선정에서 제외됩니다'
        ]
    },
    '4': {
        id: '4',
        title: '3만원 이상 구매 시 무료배송',
        period: '상시 진행',
        description: '전 도서 3만원 이상 구매 시 배송비 무료',
        status: 'ongoing',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23000' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='20'%3E무료배송%3C/text%3E%3C/svg%3E",
        howTo: [
            '장바구니에 도서를 담으세요',
            '총 금액이 3만원 이상이 되도록 선택하세요',
            '결제 시 배송비가 자동으로 면제됩니다'
        ],
        notice: [
            '도서 금액 기준 3만원 이상 시 무료배송이 적용됩니다',
            '제주/도서산간 지역은 추가 배송비가 발생할 수 있습니다',
            '해외배송은 별도 요금이 부과됩니다'
        ]
    },
    '5': {
        id: '5',
        title: '설 연휴 특가 할인',
        period: '2025.01.25 ~ 2025.02.02',
        description: '전 도서 최대 30% 할인',
        status: 'upcoming',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23666' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='20'%3E설 특가%3C/text%3E%3C/svg%3E",
        howTo: [
            '이벤트 기간 동안 사이트를 방문하세요',
            '원하는 도서를 선택하고 장바구니에 담으세요',
            '결제 시 자동으로 할인이 적용됩니다'
        ],
        notice: [
            '이벤트 기간: 2025.01.25 ~ 2025.02.02',
            '일부 도서는 할인 제외될 수 있습니다',
            '다른 할인 쿠폰과 중복 사용 불가'
        ]
    },
    '6': {
        id: '6',
        title: '2024 연말결산 세일',
        period: '2024.12.20 ~ 2024.12.31',
        description: '전 도서 20% 할인 (종료)',
        status: 'ended',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23999' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='20'%3E연말결산%3C/text%3E%3C/svg%3E",
        howTo: [
            '이벤트가 종료되었습니다'
        ],
        notice: [
            '이 이벤트는 이미 종료되었습니다',
            '다음 이벤트를 기대해주세요'
        ]
    }
};

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

function loadEventDetail(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId || !eventDataMap[eventId]) {
        alert('이벤트를 찾을 수 없습니다.');
        window.location.href = '/event.html';
        return;
    }

    const eventData = eventDataMap[eventId];

    // 제목과 기간
    const titleEl = document.getElementById('eventTitle');
    const periodEl = document.getElementById('eventPeriod');
    const breadcrumbTitleEl = document.getElementById('breadcrumbTitle');
    
    if (titleEl) titleEl.textContent = eventData.title;
    if (periodEl) periodEl.textContent = eventData.period;
    if (breadcrumbTitleEl) breadcrumbTitleEl.textContent = eventData.title;

    // 배지
    const badgeEl = document.getElementById('eventBadge');
    if (badgeEl) {
        badgeEl.className = `event-badge ${eventData.status}`;
        badgeEl.textContent = eventData.status === 'ongoing' ? '진행중' : 
                              eventData.status === 'upcoming' ? '예정' : '종료';
    }

    // 이미지
    const imageEl = document.getElementById('eventImage') as HTMLImageElement;
    if (imageEl) {
        imageEl.src = eventData.image;
        imageEl.alt = eventData.title;
    }

    // 이벤트 내용
    const descriptionEl = document.getElementById('eventDescription');
    if (descriptionEl) {
        descriptionEl.innerHTML = `<p>${eventData.description}</p>`;
    }

    // 참여 방법
    const howToEl = document.getElementById('eventHowTo');
    if (howToEl) {
        const howToList = eventData.howTo.map(item => `<li>${item}</li>`).join('');
        howToEl.innerHTML = `<ul>${howToList}</ul>`;
    }

    // 유의사항
    const noticeEl = document.getElementById('eventNotice');
    if (noticeEl) {
        const noticeList = eventData.notice.map(item => `<li>${item}</li>`).join('');
        noticeEl.innerHTML = `<ul>${noticeList}</ul>`;
    }

    // 참여 버튼
    const btnParticipate = document.getElementById('btnParticipate');
    if (btnParticipate) {
        if (eventData.status === 'ended') {
            btnParticipate.textContent = '종료된 이벤트';
            btnParticipate.classList.add('disabled');
            btnParticipate.setAttribute('disabled', 'true');
        } else if (eventData.status === 'upcoming') {
            btnParticipate.textContent = '곧 시작됩니다';
            btnParticipate.classList.add('disabled');
            btnParticipate.setAttribute('disabled', 'true');
        } else {
            btnParticipate.addEventListener('click', () => {
                alert('현재 개발 중입니다!');
            });
        }
    }

    console.log('이벤트 상세 로드:', eventData);
}

function initEventDetail(): void {
    console.log('🎬 ChaekMate Event Detail 초기화 시작...');
    initSearch();
    loadEventDetail();
    console.log('✨ ChaekMate Event Detail 초기화 완료!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventDetail);
} else {
    initEventDetail();
}

export { initEventDetail };