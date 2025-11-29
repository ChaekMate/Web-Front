/**
 * ChaekMate Cart TypeScript
 * 장바구니 기능 관리
 */

console.log('🛒 ChaekMate Cart 로드 완료!');

// 장바구니 아이템 인터페이스
interface CartItem {
    id: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
    image: string;
}

// 전역 상태
let cartItems: CartItem[] = [];

// ==================== 초기 데이터 로드 ====================
function loadCartData(): void {
    // TODO: localStorage 또는 API에서 데이터 가져오기
    // 현재는 HTML에 있는 데이터 사용
    updateCartDisplay();
}

// ==================== 장바구니 표시 업데이트 ====================
function updateCartDisplay(): void {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cartItemElements = document.querySelectorAll('.cart-item');

    if (cartItemElements.length === 0) {
        cartContent?.setAttribute('style', 'display: none;');
        emptyCart?.setAttribute('style', 'display: block;');
    } else {
        cartContent?.setAttribute('style', 'display: block;');
        emptyCart?.setAttribute('style', 'display: none;');
    }

    updateSummary();
}

// ==================== 전체 선택 ====================
function initSelectAll(): void {
    const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
    const itemCheckboxes = document.querySelectorAll('.item-checkbox') as NodeListOf<HTMLInputElement>;

    selectAllCheckbox?.addEventListener('change', () => {
        const isChecked = selectAllCheckbox.checked;
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateSelectedCount();
        updateSummary();
    });

    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectAllState();
            updateSelectedCount();
            updateSummary();
        });
    });

    console.log('✅ 전체 선택 초기화 완료');
}

// ==================== 전체 선택 상태 업데이트 ====================
function updateSelectAllState(): void {
    const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
    const itemCheckboxes = document.querySelectorAll('.item-checkbox') as NodeListOf<HTMLInputElement>;
    
    const allChecked = Array.from(itemCheckboxes).every(checkbox => checkbox.checked);
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
    }
}

// ==================== 선택 개수 업데이트 ====================
function updateSelectedCount(): void {
    const itemCheckboxes = document.querySelectorAll('.item-checkbox') as NodeListOf<HTMLInputElement>;
    const selectedCount = Array.from(itemCheckboxes).filter(checkbox => checkbox.checked).length;
    const totalCount = itemCheckboxes.length;

    const selectedCountElement = document.getElementById('selectedCount');
    const totalCountElement = document.getElementById('totalCount');

    if (selectedCountElement) {
        selectedCountElement.textContent = selectedCount.toString();
    }
    if (totalCountElement) {
        totalCountElement.textContent = totalCount.toString();
    }
}

// ==================== 수량 조절 ====================
function initQuantityControls(): void {
    const cartItemElements = document.querySelectorAll('.cart-item');

    cartItemElements.forEach(item => {
        const minusBtn = item.querySelector('.qty-btn.minus');
        const plusBtn = item.querySelector('.qty-btn.plus');
        const qtyInput = item.querySelector('.qty-input') as HTMLInputElement;

        minusBtn?.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            if (currentValue > 1) {
                qtyInput.value = (currentValue - 1).toString();
                updateItemTotal(item as HTMLElement);
                updateSummary();
            }
        });

        plusBtn?.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            if (currentValue < 99) {
                qtyInput.value = (currentValue + 1).toString();
                updateItemTotal(item as HTMLElement);
                updateSummary();
            }
        });

        qtyInput?.addEventListener('change', () => {
            let value = parseInt(qtyInput.value);
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 99) {
                value = 99;
            }
            qtyInput.value = value.toString();
            updateItemTotal(item as HTMLElement);
            updateSummary();
        });
    });

    console.log('✅ 수량 조절 초기화 완료');
}

// ==================== 아이템 총액 업데이트 ====================
function updateItemTotal(itemElement: HTMLElement): void {
    const price = parseInt(itemElement.getAttribute('data-price') || '0');
    const qtyInput = itemElement.querySelector('.qty-input') as HTMLInputElement;
    const quantity = parseInt(qtyInput.value);
    const total = price * quantity;

    const totalPriceElement = itemElement.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = total.toLocaleString() + '원';
    }
}

// ==================== 아이템 삭제 ====================
function initItemDelete(): void {
    const deleteButtons = document.querySelectorAll('.item-delete');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.cart-item');
            const title = item?.querySelector('.item-title')?.textContent;

            if (confirm(`"${title}"을(를) 장바구니에서 삭제하시겠습니까?`)) {
                item?.remove();
                updateCartDisplay();
                updateSelectedCount();
                console.log('삭제:', title);
                // TODO: API 호출
            }
        });
    });

    console.log('✅ 아이템 삭제 초기화 완료');
}

// ==================== 선택 삭제 ====================
function initDeleteSelected(): void {
    const deleteSelectedBtn = document.getElementById('deleteSelected');

    deleteSelectedBtn?.addEventListener('click', () => {
        const checkedItems = document.querySelectorAll('.item-checkbox:checked');
        
        if (checkedItems.length === 0) {
            alert('삭제할 상품을 선택해주세요.');
            return;
        }

        if (confirm(`선택한 ${checkedItems.length}개 상품을 삭제하시겠습니까?`)) {
            checkedItems.forEach(checkbox => {
                const item = checkbox.closest('.cart-item');
                item?.remove();
            });
            updateCartDisplay();
            updateSelectedCount();
            console.log('선택 삭제:', checkedItems.length);
            // TODO: API 호출
        }
    });

    console.log('✅ 선택 삭제 초기화 완료');
}

// ==================== 주문 요약 업데이트 ====================
function updateSummary(): void {
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    let productTotal = 0;

    checkedItems.forEach(checkbox => {
        const item = checkbox.closest('.cart-item') as HTMLElement;
        const price = parseInt(item.getAttribute('data-price') || '0');
        const qtyInput = item.querySelector('.qty-input') as HTMLInputElement;
        const quantity = parseInt(qtyInput.value);
        productTotal += price * quantity;
    });

    // 배송비 계산 (30,000원 이상 무료)
    const shippingFee = productTotal >= 30000 ? 0 : 3000;
    const discount: number = 0; // TODO: 할인 로직
    const finalTotal = productTotal + shippingFee - discount;

    // UI 업데이트
    const productTotalElement = document.getElementById('productTotal');
    const shippingFeeElement = document.getElementById('shippingFee');
    const discountElement = document.getElementById('discount');
    const finalTotalElement = document.getElementById('finalTotal');

    if (productTotalElement) {
        productTotalElement.textContent = productTotal.toLocaleString() + '원';
    }
    if (shippingFeeElement) {
        shippingFeeElement.textContent = shippingFee === 0 ? '무료' : shippingFee.toLocaleString() + '원';
    }
    if (discountElement) {
        discountElement.textContent = discount === 0 ? '-0원' : '-' + discount.toLocaleString() + '원';
    }
    if (finalTotalElement) {
        finalTotalElement.textContent = finalTotal.toLocaleString() + '원';
    }
}

// ==================== 주문하기 ====================
function initOrder(): void {
    const orderBtn = document.getElementById('orderBtn');

    orderBtn?.addEventListener('click', () => {
        const checkedItems = document.querySelectorAll('.item-checkbox:checked');

        if (checkedItems.length === 0) {
            alert('주문할 상품을 선택해주세요.');
            return;
        }

        const finalTotal = document.getElementById('finalTotal')?.textContent;
        console.log('주문하기:', checkedItems.length, '개 상품, 총', finalTotal);
        alert('주문 기능은 준비 중입니다.');
        // TODO: 주문 페이지로 이동
    });

    console.log('✅ 주문하기 초기화 완료');
}

// ==================== 검색 기능 ====================
function initSearch(): void {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    searchBtn?.addEventListener('click', () => {
        const keyword = searchInput?.value.trim();
        if (keyword) {
            console.log('검색:', keyword);
            // TODO: 검색 페이지로 이동
        }
    });

    searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            searchBtn?.dispatchEvent(new Event('click'));
        }
    });

    console.log('✅ 검색 기능 초기화 완료');
}

// ==================== 추천 상품 장바구니 담기 ====================
function initRecommendedItems(): void {
    const addCartButtons = document.querySelectorAll('.btn-add-cart');

    addCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.recommended-item');
            const title = item?.querySelector('h3')?.textContent;

            console.log('장바구니 담기:', title);
            alert(`"${title}"이(가) 장바구니에 담겼습니다.`);
            // TODO: 장바구니에 아이템 추가 로직
            // 페이지 새로고침 또는 동적 추가
        });
    });

    console.log('✅ 추천 상품 초기화 완료');
}

// ==================== 메인 초기화 ====================
function initCart(): void {
    console.log('🎬 ChaekMate Cart 초기화 시작...');

    loadCartData();
    initSelectAll();
    initQuantityControls();
    initItemDelete();
    initDeleteSelected();
    initOrder();
    initSearch();
    initRecommendedItems();
    updateSelectedCount();

    console.log('✨ ChaekMate Cart 초기화 완료!');
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}

export { initCart };