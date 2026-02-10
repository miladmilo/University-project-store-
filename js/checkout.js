// checkout.js - مدیریت کامل صفحه پرداخت

class CheckoutManager {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        this.shippingCost = 50000; // هزینه پیش‌فرض پیک موتوری
        this.discount = 0;
        this.discountCode = '';
        this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        
        this.init();
    }
    
    init() {
        this.loadOrderSummary();
        this.setupEventListeners();
        this.loadUserInfo();
        this.updateOrderSummary();
    }
    
    setupEventListeners() {
        // فرم پرداخت
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processCheckout();
        });
        
        // تغییر روش ارسال
        document.querySelectorAll('input[name="shipping"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updateShippingCost(e.target.value);
            });
        });
        
        // اعمال کد تخفیف
        document.getElementById('applyDiscount').addEventListener('click', () => {
            this.applyDiscountCode();
        });
        
        // کلید Enter در فیلد کد تخفیف
        document.getElementById('discountCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyDiscountCode();
            }
        });
        
        // ذخیره اطلاعات کاربر هنگام تغییر
        this.setupAutoSave();
    }
    
    setupAutoSave() {
        // ذخیره خودکار اطلاعات فرم
        const form = document.getElementById('checkoutForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveUserInfo();
            });
            
            input.addEventListener('blur', () => {
                this.saveUserInfo();
            });
        });
    }
    
    loadUserInfo() {
        if (this.userInfo) {
            // پر کردن فرم با اطلاعات ذخیره شده
            Object.keys(this.userInfo).forEach(key => {
                const element = document.querySelector(`[name="${key}"]`);
                if (element) {
                    element.value = this.userInfo[key];
                }
            });
        }
    }
    
    saveUserInfo() {
        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        localStorage.setItem('userInfo', JSON.stringify(data));
        this.userInfo = data;
    }
    
    loadOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        
        if (this.cartItems.length === 0) {
            orderSummary.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-shopping-cart text-4xl mb-4"></i>
                    <p>سبد خرید شما خالی است</p>
                    <a href="products.html" class="text-blue-600 hover:underline mt-2 inline-block">
                        بازگشت به فروشگاه
                    </a>
                </div>
            `;
            return;
        }
        
        let itemsHTML = '';
        let itemsTotal = 0;
        
        this.cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            itemsTotal += itemTotal;
            
            itemsHTML += `
                <div class="flex items-center border-b py-4">
                    <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-grow mr-4">
                        <h4 class="font-semibold text-sm">${item.name}</h4>
                        <p class="text-gray-600 text-xs">${this.formatPrice(item.price)} × ${item.quantity}</p>
                    </div>
                    <div class="font-bold">${this.formatPrice(itemTotal)}</div>
                </div>
            `;
        });
        
        orderSummary.innerHTML = itemsHTML;
        
        // به‌روزرسانی قیمت‌ها
        document.getElementById('itemsTotal').textContent = this.formatPrice(itemsTotal);
        this.calculateTotal(itemsTotal);
    }
    
    updateShippingCost(method) {
        switch(method) {
            case 'express':
                this.shippingCost = 50000; // پیک موتوری
                break;
            case 'standard':
                this.shippingCost = 30000; // پست پیشتاز
                break;
            default:
                this.shippingCost = 0;
        }
        
        document.getElementById('shippingFee').textContent = this.formatPrice(this.shippingCost);
        this.updateOrderTotal();
    }
    
    applyDiscountCode() {
        const codeInput = document.getElementById('discountCode');
        const code = codeInput.value.trim().toUpperCase();
        const messageEl = document.getElementById('discountMessage');
        
        // کدهای تخفیف نمونه
        const discountCodes = {
            'NIKE10': 0.1, // 10% تخفیف
            'WELCOME20': 0.2, // 20% تخفیف
            'SPORT15': 0.15 // 15% تخفیف
        };
        
        if (!code) {
            this.showDiscountMessage('لطفا کد تخفیف را وارد کنید', 'error');
            return;
        }
        
        if (discountCodes[code]) {
            this.discount = discountCodes[code];
            this.discountCode = code;
            const discountAmount = this.calculateDiscount();
            
            this.showDiscountMessage(`کد تخفیف ${code} با موفقیت اعمال شد! ${(this.discount * 100)}% تخفیف`, 'success');
            codeInput.value = '';
            
            // نمایش تخفیف در خلاصه سفارش
            this.addDiscountToSummary(discountAmount);
            
        } else {
            this.showDiscountMessage('کد تخفیف معتبر نیست', 'error');
            this.discount = 0;
            this.discountCode = '';
            this.removeDiscountFromSummary();
        }
        
        this.updateOrderTotal();
    }
    
    calculateDiscount() {
        const itemsTotal = this.getItemsTotal();
        return Math.floor(itemsTotal * this.discount);
    }
    
    addDiscountToSummary(discountAmount) {
        // حذف تخفیف قبلی اگر وجود دارد
        this.removeDiscountFromSummary();
        
        const summary = document.querySelector('.order-summary-details');
        if (summary) {
            const discountElement = document.createElement('div');
            discountElement.className = 'flex justify-between text-green-600';
            discountElement.id = 'discountElement';
            discountElement.innerHTML = `
                <span>تخفیف (${this.discountCode})</span>
                <span>-${this.formatPrice(discountAmount)}</span>
            `;
            
            // اضافه کردن تخفیف قبل از مبلغ قابل پرداخت
            const totalElement = summary.querySelector('.order-total');
            if (totalElement) {
                totalElement.parentNode.insertBefore(discountElement, totalElement);
            }
        }
    }
    
    removeDiscountFromSummary() {
        const discountElement = document.getElementById('discountElement');
        if (discountElement) {
            discountElement.remove();
        }
    }
    
    showDiscountMessage(message, type) {
        const messageEl = document.getElementById('discountMessage');
        messageEl.textContent = message;
        messageEl.className = `text-sm mt-2 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`;
        messageEl.classList.remove('hidden');
        
        // پنهان کردن پیام بعد از 5 ثانیه
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
    }
    
    getItemsTotal() {
        return this.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    calculateTotal(itemsTotal) {
        this.updateOrderTotal();
    }
    
    updateOrderTotal() {
        const itemsTotal = this.getItemsTotal();
        const discountAmount = this.calculateDiscount();
        const total = itemsTotal + this.shippingCost - discountAmount;
        
        document.getElementById('orderTotal').textContent = this.formatPrice(total);
    }
    
    updateOrderSummary() {
        const itemsTotal = this.getItemsTotal();
        document.getElementById('itemsTotal').textContent = this.formatPrice(itemsTotal);
        document.getElementById('shippingFee').textContent = this.formatPrice(this.shippingCost);
        this.updateOrderTotal();
    }
    
    processCheckout() {
        // اعتبارسنجی فرم
        if (!this.validateForm()) {
            return;
        }
        
        // ذخیره اطلاعات نهایی
        this.saveUserInfo();
        
        // ایجاد سفارش
        const order = this.createOrder();
        
        // ذخیره سفارش
        this.saveOrder(order);
        
        // خالی کردن سبد خرید
        localStorage.removeItem('cart');
        
        // نمایش پیام موفقیت
        this.showSuccessMessage(order);
        
        // هدایت به صفحه پرداخت (در حالت واقعی)
        setTimeout(() => {
            this.redirectToPayment(order);
        }, 2000);
    }
    
    validateForm() {
        const form = document.getElementById('checkoutForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                
                // نمایش خطا
                let errorMessage = field.parentNode.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('p');
                    errorMessage.className = 'error-message text-red-500 text-sm mt-1';
                    errorMessage.textContent = 'این فیلد الزامی است';
                    field.parentNode.appendChild(errorMessage);
                }
            } else {
                field.classList.remove('border-red-500');
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
                
                // اعتبارسنجی خاص
                if (field.type === 'tel') {
                    const pattern = /^09[0-9]{9}$/;
                    if (!pattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('border-red-500');
                        const errorMessage = field.parentNode.querySelector('.error-message') || 
                                            document.createElement('p');
                        errorMessage.className = 'error-message text-red-500 text-sm mt-1';
                        errorMessage.textContent = 'شماره موبایل معتبر نیست';
                        field.parentNode.appendChild(errorMessage);
                    }
                }
                
                if (field.type === 'email' && field.value) {
                    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!pattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('border-red-500');
                        const errorMessage = field.parentNode.querySelector('.error-message') || 
                                            document.createElement('p');
                        errorMessage.className = 'error-message text-red-500 text-sm mt-1';
                        errorMessage.textContent = 'ایمیل معتبر نیست';
                        field.parentNode.appendChild(errorMessage);
                    }
                }
            }
        });
        
        if (!isValid) {
            this.showToast('لطفا تمام فیلدهای الزامی را پر کنید', 'error');
        }
        
        return isValid;
    }
    
    createOrder() {
        const itemsTotal = this.getItemsTotal();
        const discountAmount = this.calculateDiscount();
        const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
        const shippingText = shippingMethod === 'express' ? 'پیک موتوری' : 'پست پیشتاز';
        
        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleString('EN-IR'),
            items: [...this.cartItems],
            shipping: {
                method: shippingMethod,
                cost: this.shippingCost,
                text: shippingText
            },
            discount: {
                code: this.discountCode,
                amount: discountAmount,
                percentage: this.discount * 100
            },
            subtotal: itemsTotal,
            total: itemsTotal + this.shippingCost - discountAmount,
            customer: this.userInfo,
            status: 'pending', // pending, processing, shipped, delivered, cancelled
            paymentStatus: 'unpaid' // unpaid, paid, failed
        };
        
        return order;
    }
    
    saveOrder(order) {
        // دریافت سفارشات قبلی
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // ذخیره برای نمایش در داشبورد
        localStorage.setItem('lastOrder', JSON.stringify(order));
    }
    
    showSuccessMessage(order) {
        // ایجاد مودال موفقیت
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check text-green-600 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">سفارش شما ثبت شد!</h3>
                        <p class="text-gray-600 mb-4">شماره سفارش: <span class="font-bold">${order.id}</span></p>
                        
                        <div class="text-left bg-gray-50 p-4 rounded-lg mb-6">
                            <div class="flex justify-between mb-2">
                                <span>مبلغ سفارش:</span>
                                <span class="font-bold">${this.formatPrice(order.total)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>روش ارسال:</span>
                                <span>${order.shipping.text}</span>
                            </div>
                        </div>
                        
                        <p class="text-sm text-gray-500 mb-6">
                            جزئیات سفارش به ایمیل شما ارسال شد.
                            <br>
                            برای پرداخت روی دکمه زیر کلیک کنید.
                        </p>
                        
                        <div class="flex space-x-3">
                            <button id="goToPayment" class="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                                پرداخت آنلاین
                            </button>
                            <button id="closeSuccessModal" class="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                                بعدا پرداخت میکنم
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // اضافه کردن مودال به DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // رویدادهای مودال
        document.getElementById('goToPayment').addEventListener('click', () => {
            this.redirectToPayment(order);
        });
        
        document.getElementById('closeSuccessModal').addEventListener('click', () => {
            modalContainer.remove();
            window.location.href = 'dashboard.html#orders';
        });
        
        // بستن مودال با کلیک بیرون
        modalContainer.querySelector('.fixed').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modalContainer.remove();
                window.location.href = 'dashboard.html#orders';
            }
        });
    }
    
    redirectToPayment(order) {
        // در اینجا معمولا به درگاه پرداخت هدایت می‌شوید
        // برای نمونه، یک صفحه شبیه‌سازی پرداخت
        
        const paymentPage = `
            <!DOCTYPE html>
            <html lang="fa">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>درگاه پرداخت | Nike Store</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-100">
                <div class="min-h-screen flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                        <div class="text-center mb-8">
                            <h1 class="text-2xl font-bold mb-2">درگاه پرداخت امن</h1>
                            <p class="text-gray-600">شماره سفارش: ${order.id}</p>
                        </div>
                        
                        <div class="bg-gray-50 p-6 rounded-lg mb-6">
                            <div class="flex justify-between mb-4">
                                <span>مبلغ قابل پرداخت:</span>
                                <span class="font-bold text-lg">${this.formatPrice(order.total)}</span>
                            </div>
                            <div class="text-sm text-gray-500">
                                انتقال به درگاه بانک...
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <button onclick="processPayment('success')" 
                                    class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                                پرداخت موفق
                            </button>
                            <button onclick="processPayment('failed')" 
                                    class="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
                                پرداخت ناموفق
                            </button>
                        </div>
                    </div>
                </div>
                
                <script>
                function processPayment(status) {
                    const result = {
                        orderId: '${order.id}',
                        status: status,
                        date: new Date().toISOString(),
                        refId: status === 'success' ? 'REF' + Date.now() : null
                    };
                    
                    localStorage.setItem('paymentResult', JSON.stringify(result));
                    
                    if (status === 'success') {
                        window.location.href = 'dashboard.html?payment=success';
                    } else {
                        window.location.href = 'dashboard.html?payment=failed';
                    }
                }
                </script>
            </body>
            </html>
        `;
        
        // باز کردن در صفحه جدید
        const paymentWindow = window.open('', '_blank');
        paymentWindow.document.write(paymentPage);
        paymentWindow.document.close();
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('EN-IR').format(price) + ' tomans';
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // حذف خودکار
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// راه‌اندازی وقتی DOM آماده شد
document.addEventListener('DOMContentLoaded', () => {
    const checkoutManager = new CheckoutManager();
    
    // اضافه کردن استایل‌های اضافی
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .order-summary-details > div {
            margin-bottom: 0.75rem;
        }
        
        .order-total {
            border-top: 2px solid #e5e7eb;
            padding-top: 1rem;
            margin-top: 1rem;
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            ring: 2px;
            ring-color: #3b82f6;
        }
        
        .border-red-500 {
            border-color: #ef4444;
        }
    `;
    document.head.appendChild(style);
});

// توابع کمکی برای استفاده در جاهای دیگر
window.CheckoutManager = CheckoutManager;