//  - مدیریت صفحه سبد خرید
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.coupon = null;
        this.shippingCost = 0;
        this.init();
    }
    
    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateSummary();
    }
    
    setupEventListeners() {
        // دکمه به‌روزرسانی سبد خرید
        const updateBtn = document.getElementById('updateCartBtn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.updateCartQuantities();
            });
        }
        
        // دکمه پاک کردن سبد خرید
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }
        
        // اعمال کد تخفیف
        const couponBtn = document.getElementById('applyCouponBtn');
        if (couponBtn) {
            couponBtn.addEventListener('click', () => {
                this.applyCoupon();
            });
        }
        
        // تغییر روش ارسال
        const shippingSelect = document.getElementById('shippingMethod');
        if (shippingSelect) {
            shippingSelect.addEventListener('change', (e) => {
                this.shippingCost = parseInt(e.target.value);
                this.updateSummary();
            });
        }
        
        // Enter برای کد تخفیف
        const couponInput = document.getElementById('couponCode');
        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyCoupon();
                }
            });
        }
    }
    
    loadCart() {
        const cartItemsList = document.getElementById('cartItemsList');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        
        if (this.cart.length === 0) {
            if (cartItemsList) cartItemsList.innerHTML = '';
            if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
            this.updateSummary();
            this.disableCheckout();
            return;
        }
        
        if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
        
        // رندر آیتم‌های سبد خرید
        let itemsHTML = '';
        
        this.cart.forEach((item, index) => {
            const itemTotal = (item.price || 0) * (item.quantity || 1);
            
            itemsHTML += `
                <div class="cart-item bg-gray-50 rounded-lg p-4 lg:p-6" data-index="${index}">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
                        <!-- تصویر محصول -->
                        <div class=" lg:w-1/5">
                            <img src="${item.image || 'https://via.placeholder.com/300x300/EFEFEF/666666?text=No+Image'}" 
                                 alt="${item.name}" 
                                 class="w-full h-full lg:h-32 object-cover rounded-lg">
                        </div>
                        
                        <!-- اطلاعات محصول -->
                        <div class="lg:w-2/5 flex-grow">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-semibold text-lg mb-2">${item.name}</h4>
                                    <div class="text-gray-600 text-sm space-y-1">
                                        ${item.size ? `<div> size: ${item.size}</div>` : ''}
                                        ${item.category ? `<div>category : ${item.category}</div>` : ''}
                                    </div>
                                </div>
                                <button class="remove-item text-red-500 hover:text-red-700 text-lg lg:hidden"
                                        data-index="${index}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <!-- موبایل: قیمت و تعداد -->
                            <div class="lg:hidden flex justify-between items-center mt-4">
                                <div class="text-lg font-bold">${this.formatPrice(item.price || 0)}</div>
                                <div class="flex items-center space-x-3">
                                    <div class="flex items-center border rounded-lg">
                                        <button class="decrease-qty w-8 h-8 hover:bg-gray-100" data-index="${index}">-</button>
                                        <input type="number" 
                                               value="${item.quantity || 1}" 
                                               min="1" 
                                               max="10"
                                               class="quantity-input w-12 text-center border-x bg-transparent"
                                               data-index="${index}">
                                        <button class="increase-qty w-8 h-8 hover:bg-gray-100" data-index="${index}">+</button>
                                    </div>
                                    <div class="font-bold">${this.formatPrice(itemTotal)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- دسکتاپ: قیمت -->
                        <div class="hidden lg:block lg:w-1/5 text-center">
                            <div class="text-lg font-bold">${this.formatPrice(item.price || 0)}</div>
                        </div>
                        
                        <!-- دسکتاپ: تعداد -->
                        <div class="hidden lg:block lg:w-1/5">
                            <div class="flex items-center justify-center">
                                <div class="flex items-center border rounded-lg">
                                    <button class="decrease-qty w-8 h-8 hover:bg-gray-100" data-index="${index}">-</button>
                                    <input type="number" 
                                           value="${item.quantity || 1}" 
                                           min="1" 
                                           max="10"
                                           class="quantity-input w-12 text-center border-x bg-transparent focus:outline-none"
                                           data-index="${index}">
                                    <button class="increase-qty w-8 h-8 hover:bg-gray-100" data-index="${index}">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- دسکتاپ: جمع -->
                        <div class="hidden lg:block lg:w-1/5 text-center">
                            <div class="text-lg font-bold">${this.formatPrice(itemTotal)}</div>
                        </div>
                        
                        <!-- دسکتاپ: حذف -->
                        <div class="hidden lg:block lg:w-1/12 text-center">
                            <button class="remove-item text-red-500 hover:text-red-700 text-lg"
                                    data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- دکمه‌های موبایل -->
                    <div class="lg:hidden flex justify-between mt-4 pt-4 border-t">
                        <button class="move-to-wishlist text-blue-600 hover:text-blue-800 text-sm"
                                data-index="${index}">
                            <i class="far fa-heart ml-1"></i>
                            انتقال به علاقه‌مندی‌ها
                        </button>
                        <button class="remove-item text-red-500 hover:text-red-700 text-sm"
                                data-index="${index}">
                            <i class="fas fa-trash ml-1"></i>
                            حذف
                        </button>
                    </div>
                </div>
            `;
        });
        
        if (cartItemsList) {
            cartItemsList.innerHTML = itemsHTML;
            this.attachItemEvents();
        }
        
        this.updateSummary();
        this.enableCheckout();
        this.updateHeaderCartCount();
    }
    
    attachItemEvents() {
        // حذف آیتم
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                this.removeItem(index);
            });
        });
        
        // افزایش تعداد
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                this.updateQuantity(index, 1);
            });
        });
        
        // کاهش تعداد
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                this.updateQuantity(index, -1);
            });
        });
        
        // تغییر مقدار دستی
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity >= 1 && newQuantity <= 10) {
                    this.cart[index].quantity = newQuantity;
                    this.saveCart();
                    this.loadCart();
                } else {
                    e.target.value = this.cart[index].quantity;
                }
            });
        });
        
        // انتقال به علاقه‌مندی‌ها
        document.querySelectorAll('.move-to-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                this.moveToWishlist(index);
            });
        });
    }
    
    updateQuantity(index, change) {
        if (this.cart[index]) {
            this.cart[index].quantity = (this.cart[index].quantity || 1) + change;
            
            if (this.cart[index].quantity < 1) {
                this.cart[index].quantity = 1;
            }
            
            if (this.cart[index].quantity > 10) {
                this.cart[index].quantity = 10;
            }
            
            this.saveCart();
            this.loadCart();
        }
    }
    
    removeItem(index) {
        if (confirm('آیا مطمئن هستید که می‌خواهید این محصول را از سبد خرید حذف کنید؟')) {
            this.cart.splice(index, 1);
            this.saveCart();
            this.loadCart();
            this.showNotification('محصول از سبد خرید حذف شد', 'success');
        }
    }
    
    moveToWishlist(index) {
        const item = this.cart[index];
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (!wishlist.some(w => w.id === item.id)) {
            wishlist.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                category: item.category
            });
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            this.cart.splice(index, 1);
            this.saveCart();
            
            this.loadCart();
            this.updateWishlistCount();
            this.showNotification('محصول به علاقه‌مندی‌ها انتقال یافت', 'success');
        } else {
            this.showNotification('این محصول قبلاً در علاقه‌مندی‌ها وجود دارد', 'info');
        }
    }
    
    updateCartQuantities() {
        const inputs = document.querySelectorAll('.quantity-input');
        let hasChanges = false;
        
        inputs.forEach(input => {
            const index = parseInt(input.dataset.index);
            const newQuantity = parseInt(input.value);
            const oldQuantity = this.cart[index]?.quantity;
            
            if (this.cart[index] && newQuantity !== oldQuantity && newQuantity >= 1 && newQuantity <= 10) {
                this.cart[index].quantity = newQuantity;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.saveCart();
            this.loadCart();
            this.showNotification('سبد خرید به‌روزرسانی شد', 'success');
        }
    }
    
    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('سبد خرید شما خالی است', 'info');
            return;
        }
        
        if (confirm('آیا مطمئن هستید که می‌خواهید همه محصولات را از سبد خرید حذف کنید؟')) {
            this.cart = [];
            this.saveCart();
            this.loadCart();
            this.showNotification('سبد خرید پاک شد', 'success');
        }
    }
    
    applyCoupon() {
        const codeInput = document.getElementById('couponCode');
        const messageEl = document.getElementById('couponMessage');
        const code = codeInput?.value.trim().toUpperCase();
        
        if (!code) {
            this.showCouponMessage('لطفا کد تخفیف را وارد کنید', 'error');
            return;
        }
        
        // کوپن‌های نمونه
        const coupons = [
            { code: 'NIKEWELCOME', discount: 15, type: 'percentage', maxDiscount: 100000, isActive: true },
            { code: 'SUMMER2024', discount: 20000, type: 'fixed', isActive: true }
        ];
        
        const coupon = coupons.find(c => c.code === code && c.isActive);
        
        if (!coupon) {
            this.showCouponMessage('کد تخفیف معتبر نیست', 'error');
            this.coupon = null;
            return;
        }
        
        // اعتبارسنجی موفق
        this.coupon = coupon;
        if (codeInput) codeInput.value = '';
        this.showCouponMessage(`کد تخفیف ${coupon.discount}${coupon.type === 'percentage' ? '%' : ' تومان'} اعمال شد`, 'success');
        this.updateSummary();
    }
    
    showCouponMessage(message, type) {
        const messageEl = document.getElementById('couponMessage');
        if (!messageEl) return;
        
        messageEl.textContent = message;
        messageEl.className = `text-sm ${type === 'success' ? 'text-green-600' : 'text-red-600'}`;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
    }
    
    updateSummary() {
        // محاسبه جمع جزء
        const subtotal = this.cart.reduce((sum, item) => {
            return sum + (item.price || 0) * (item.quantity || 1);
        }, 0);
        
        // محاسبه تخفیف
        let discount = 0;
        if (this.coupon) {
            if (this.coupon.type === 'percentage') {
                discount = subtotal * (this.coupon.discount / 100);
                if (this.coupon.maxDiscount && discount > this.coupon.maxDiscount) {
                    discount = this.coupon.maxDiscount;
                }
            } else {
                discount = this.coupon.discount;
            }
        }
        
        // محاسبه جمع کل
        const total = subtotal - discount + this.shippingCost;
        
        // آپدیت UI
        const subtotalEl = document.getElementById('cartSubtotal');
        const discountEl = document.getElementById('cartDiscount');
        const totalEl = document.getElementById('cartTotal');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
        if (discountEl) discountEl.textContent = this.formatPrice(discount);
        if (totalEl) totalEl.textContent = this.formatPrice(total);
    }
    
    updateHeaderCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCount = document.getElementById('cartCount');
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('hidden', totalItems === 0);
        }
    }
    
    updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const wishlistCount = document.getElementById('wishlistCount');
        
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
            wishlistCount.classList.toggle('hidden', wishlist.length === 0);
        }
    }
    
    disableCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.querySelector('button').disabled = true;
        }
    }
    
    enableCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn && this.cart.length > 0) {
            checkoutBtn.querySelector('button').disabled = false;
        }
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateHeaderCartCount();
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('EN-IR').format(price) + ' Tomans';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        notification.style.transform = 'translateX(-100%)';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// راه‌اندازی خودکار
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cartManager = new CartManager();
    });
} else {
    window.cartManager = new CartManager();
}