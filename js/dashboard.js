// dashboard.js - مدیریت پنل کاربری

class DashboardManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.userAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        this.paymentResult = JSON.parse(localStorage.getItem('paymentResult')) || null;
        
        this.init();
    }
    
    init() {
        if (!this.currentUser) {
            this.redirectToLogin();
            return;
        }
        
        this.setupEventListeners();
        this.loadUserProfile();
        this.showDashboard();
        this.checkPaymentResult();
        this.loadRecentOrders();
        this.loadWishlist();
        this.loadAddresses();
        this.setupChart(); // اگر chart.js اضافه شده باشد
    }
    
    setupEventListeners() {
        // منوی داشبورد
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showSection(target);
                
                // آپدیت منوی فعال
                document.querySelectorAll('nav a').forEach(l => {
                    l.classList.remove('active-menu');
                    l.classList.add('hover:bg-gray-100');
                });
                e.target.classList.add('active-menu');
                e.target.classList.remove('hover:bg-gray-100');
            });
        });
        
        // خروج از حساب
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // ویرایش پروفایل
        document.querySelector('button[onclick="editProfile()"]')?.addEventListener('click', () => {
            this.editProfile();
        });
        
        // فیلتر سفارشات
        document.getElementById('orderFilter')?.addEventListener('change', (e) => {
            this.filterOrders(e.target.value);
        });
        
        // جستجوی سفارشات
        document.getElementById('searchOrders')?.addEventListener('input', (e) => {
            this.searchOrders(e.target.value);
        });
        
        // دکمه افزودن آدرس جدید
        document.getElementById('addAddressBtn')?.addEventListener('click', () => {
            this.showAddAddressForm();
        });
        
        // دکمه‌های حذف آدرس
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-address')) {
                const id = e.target.dataset.id;
                this.deleteAddress(id);
            }
            
            if (e.target.classList.contains('edit-address')) {
                const id = e.target.dataset.id;
                this.editAddress(id);
            }
            
            if (e.target.classList.contains('set-default-address')) {
                const id = e.target.dataset.id;
                this.setDefaultAddress(id);
            }
            
            if (e.target.classList.contains('remove-wishlist')) {
                const id = e.target.dataset.id;
                this.removeFromWishlist(id);
            }
            
            if (e.target.classList.contains('move-to-cart')) {
                const id = e.target.dataset.id;
                this.moveToCart(id);
            }
            
            if (e.target.classList.contains('order-details')) {
                const id = e.target.dataset.id;
                this.showOrderDetails(id);
            }
            
            if (e.target.classList.contains('cancel-order')) {
                const id = e.target.dataset.id;
                this.cancelOrder(id);
            }
            
            if (e.target.classList.contains('track-order')) {
                const id = e.target.dataset.id;
                this.trackOrder(id);
            }
        });
        
        // ذخیره تنظیمات
        document.getElementById('saveSettings')?.addEventListener('click', () => {
            this.saveSettings();
        });
        
        // تغییر پسورد
        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.changePassword();
        });
        
        // حذف حساب
        document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
            this.deleteAccount();
        });
    }
    
    loadUserProfile() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = 
                this.currentUser.name || 'کاربر مهمان';
            document.getElementById('userEmail').textContent = 
                this.currentUser.email || 'email@example.com';
            
            // آپدیت آمار
            this.updateStats();
        }
    }
    
    updateStats() {
        // سفارشات فعال
        const activeOrders = this.orders.filter(order => 
            ['pending', 'processing', 'shipped'].includes(order.status)
        ).length;
        document.getElementById('activeOrders').textContent = activeOrders;
        
        // تعداد علاقه‌مندی‌ها
        document.getElementById('wishlistCount').textContent = this.wishlist.length;
        
        // امتیاز کاربر (بر اساس خریدها)
        const userRating = this.calculateUserRating();
        document.getElementById('userRating').textContent = userRating.toFixed(1);
    }
    
    calculateUserRating() {
        // محاسبه امتیاز بر اساس تعداد خرید و رضایت
        const completedOrders = this.orders.filter(order => 
            order.status === 'delivered'
        ).length;
        
        // امتیاز پایه + امتیاز بر اساس تعداد خرید
        let rating = 4.0;
        if (completedOrders > 10) rating = 4.8;
        else if (completedOrders > 5) rating = 4.5;
        else if (completedOrders > 2) rating = 4.2;
        
        return rating;
    }
    
    showSection(sectionId) {
        // مخفی کردن تمام بخش‌ها
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // نمایش بخش انتخاب شده
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            
            // بارگذاری داده‌های بخش
            switch(sectionId) {
                case 'orders':
                    this.loadOrders();
                    break;
                case 'addresses':
                    this.loadAddresses();
                    break;
                case 'wishlist':
                    this.loadWishlist();
                    break;
                case 'settings':
                    this.loadSettings();
                    break;
            }
        }
    }
    
    showDashboard() {
        this.showSection('dashboard');
    }
    
    loadRecentOrders() {
        const recentOrdersContainer = document.getElementById('recentOrders');
        if (!recentOrdersContainer) return;
        
        const recentOrders = this.orders.slice(0, 3); // 3 سفارش آخر
        
        if (recentOrders.length === 0) {
            recentOrdersContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-shopping-bag text-3xl mb-4"></i>
                    <p>هنوز سفارشی ثبت نکرده‌اید</p>
                    <a href="products.html" class="text-blue-600 hover:underline mt-2 inline-block">
                        شروع خرید
                    </a>
                </div>
            `;
            return;
        }
        
        recentOrdersContainer.innerHTML = recentOrders.map(order => `
            <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-semibold">${order.id}</span>
                    <span class="text-sm text-gray-600">${order.date}</span>
                </div>
                <div class="flex justify-between items-center mb-3">
                    <span class="px-2 py-1 text-xs rounded-full ${this.getStatusClass(order.status)}">
                        ${this.getStatusText(order.status)}
                    </span>
                    <span class="font-bold">${this.formatPrice(order.total)}</span>
                </div>
                <div class="flex justify-between">
                    <button class="order-details text-blue-600 text-sm hover:underline" data-id="${order.id}">
                        جزئیات
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="cancel-order text-red-600 text-sm hover:underline" data-id="${order.id}">
                            لغو سفارش
                        </button>
                    ` : ''}
                    ${['processing', 'shipped'].includes(order.status) ? `
                        <button class="track-order text-green-600 text-sm hover:underline" data-id="${order.id}">
                            پیگیری
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    loadOrders() {
        const ordersContainer = document.getElementById('ordersContent');
        if (!ordersContainer) return;
        
        if (this.orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold mb-2">هنوز سفارشی ندارید</h3>
                    <p class="text-gray-600 mb-6">اولین خرید خود را تجربه کنید</p>
                    <a href="products.html" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
                        مشاهده محصولات
                    </a>
                </div>
            `;
            return;
        }
        
        // ایجاد جدول سفارشات
        ordersContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <!-- هدر جدول -->
                <div class="p-6 border-b">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 class="text-lg font-semibold">سفارشات شما (${this.orders.length})</h3>
                        <div class="flex gap-4">
                            <div class="relative">
                                <input type="text" id="searchOrders" 
                                       placeholder="جستجوی سفارش..." 
                                       class="border rounded-lg px-4 py-2 pl-10 w-full">
                                <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                            </div>
                            <select id="orderFilter" class="border rounded-lg px-4 py-2">
                                <option value="all">همه سفارشات</option>
                                <option value="pending">در انتظار پرداخت</option>
                                <option value="processing">در حال پردازش</option>
                                <option value="shipped">ارسال شده</option>
                                <option value="delivered">تحویل داده شده</option>
                                <option value="cancelled">لغو شده</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- جدول -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-right p-4">شماره سفارش</th>
                                <th class="text-right p-4">تاریخ</th>
                                <th class="text-right p-4">مبلغ</th>
                                <th class="text-right p-4">وضعیت</th>
                                <th class="text-right p-4">عملیات</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTableBody">
                            ${this.orders.map(order => `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-4 font-semibold">${order.id}</td>
                                    <td class="p-4">${order.date}</td>
                                    <td class="p-4">${this.formatPrice(order.total)}</td>
                                    <td class="p-4">
                                        <span class="px-3 py-1 rounded-full text-xs ${this.getStatusClass(order.status)}">
                                            ${this.getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td class="p-4">
                                        <div class="flex gap-2">
                                            <button class="order-details text-blue-600 hover:underline text-sm" 
                                                    data-id="${order.id}">
                                                جزئیات
                                            </button>
                                            ${order.status === 'pending' ? `
                                                <button class="cancel-order text-red-600 hover:underline text-sm" 
                                                        data-id="${order.id}">
                                                    لغو
                                                </button>
                                            ` : ''}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- صفحه‌بندی -->
                <div class="p-4 border-t flex justify-between items-center">
                    <div class="text-gray-600">
                        نمایش ${this.orders.length} از ${this.orders.length} سفارش
                    </div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 border rounded disabled:opacity-50" disabled>
                            قبلی
                        </button>
                        <button class="px-3 py-1 border rounded bg-black text-white">
                            1
                        </button>
                        <button class="px-3 py-1 border rounded">
                            بعدی
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    loadWishlist() {
        const wishlistContainer = document.getElementById('wishlistContent');
        if (!wishlistContainer) return;
        
        if (this.wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-heart text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold mb-2">لیست علاقه‌مندی‌های شما خالی است</h3>
                    <p class="text-gray-600 mb-6">محصولات مورد علاقه خود را اینجا ذخیره کنید</p>
                    <a href="products.html" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
                        مشاهده محصولات
                    </a>
                </div>
            `;
            return;
        }
        
        wishlistContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${this.wishlist.map(item => `
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div class="relative">
                            <img src="${item.image}" alt="${item.name}" 
                                 class="w-full h-48 object-cover">
                            <button class="remove-wishlist absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50" 
                                    data-id="${item.id}"
                                    title="حذف از علاقه‌مندی‌ها">
                                <i class="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                        <div class="p-4">
                            <h4 class="font-semibold mb-2">${item.name}</h4>
                            <p class="text-gray-600 text-sm mb-3">${item.description || ''}</p>
                            <div class="flex justify-between items-center">
                                <span class="font-bold">${this.formatPrice(item.price)}</span>
                                <button class="move-to-cart bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm"
                                        data-id="${item.id}">
                                    افزودن به سبد خرید
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    loadAddresses() {
        const addressesContainer = document.getElementById('addressesContent');
        if (!addressesContainer) return;
        
        if (this.userAddresses.length === 0) {
            addressesContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-map-marker-alt text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold mb-2">هیچ آدرسی ثبت نکرده‌اید</h3>
                    <p class="text-gray-600 mb-6">برای دریافت سفارشات، آدرس خود را اضافه کنید</p>
                    <button id="addAddressBtn" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
                        افزودن آدرس جدید
                    </button>
                </div>
            `;
            return;
        }
        
        addressesContainer.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">آدرس‌های شما</h3>
                    <button id="addAddressBtn" class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن آدرس جدید
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${this.userAddresses.map(address => `
                        <div class="bg-white border rounded-lg p-6 hover:border-gray-400 transition-colors ${address.isDefault ? 'border-2 border-blue-500' : ''}">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h4 class="font-semibold">${address.title}</h4>
                                    ${address.isDefault ? `
                                        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                                            آدرس پیش‌فرض
                                        </span>
                                    ` : ''}
                                </div>
                                <div class="flex gap-2">
                                    <button class="edit-address text-blue-600 hover:text-blue-800" 
                                            data-id="${address.id}"
                                            title="ویرایش">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="delete-address text-red-600 hover:text-red-800" 
                                            data-id="${address.id}"
                                            title="حذف">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="text-gray-600 space-y-1 mb-4">
                                <p>${address.fullName}</p>
                                <p>${address.phone}</p>
                                <p>${address.province}، ${address.city}</p>
                                <p>${address.address}</p>
                                <p>کد پستی: ${address.postalCode}</p>
                            </div>
                            
                            ${!address.isDefault ? `
                                <button class="set-default-address text-sm text-blue-600 hover:text-blue-800"
                                        data-id="${address.id}">
                                    تنظیم به عنوان پیش‌فرض
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    loadSettings() {
        const settingsContainer = document.getElementById('settingsContent');
        if (!settingsContainer) return;
        
        settingsContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-6">تنظیمات حساب کاربری</h3>
                
                <!-- اطلاعات شخصی -->
                <div class="mb-8">
                    <h4 class="font-semibold mb-4">اطلاعات شخصی</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">نام</label>
                            <input type="text" id="firstName" 
                                   value="${this.currentUser.name?.split(' ')[0] || ''}"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">نام خانوادگی</label>
                            <input type="text" id="lastName" 
                                   value="${this.currentUser.name?.split(' ')[1] || ''}"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-2">ایمیل</label>
                            <input type="email" id="email" 
                                   value="${this.currentUser.email || ''}"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">شماره موبایل</label>
                            <input type="tel" id="phone" 
                                   value="${this.currentUser.phone || ''}"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">تاریخ تولد</label>
                            <input type="date" id="birthDate" 
                                   value="${this.currentUser.birthDate || ''}"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                    </div>
                </div>
                
                <!-- تنظیمات اعلان‌ها -->
                <div class="mb-8">
                    <h4 class="font-semibold mb-4">تنظیمات اعلان‌ها</h4>
                    <div class="space-y-3">
                        <label class="flex items-center">
                            <input type="checkbox" id="emailNotifications" 
                                   ${this.currentUser.notifications?.email ? 'checked' : ''}
                                   class="ml-3">
                            <span>اعلان‌های ایمیلی</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="smsNotifications" 
                                   ${this.currentUser.notifications?.sms ? 'checked' : ''}
                                   class="ml-3">
                            <span>اعلان‌های پیامکی</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="promotionalEmails" 
                                   ${this.currentUser.notifications?.promotional ? 'checked' : ''}
                                   class="ml-3">
                            <span>ایمیل‌های تبلیغاتی</span>
                        </label>
                    </div>
                </div>
                
                <!-- تغییر رمز عبور -->
                <div class="mb-8">
                    <h4 class="font-semibold mb-4">تغییر رمز عبور</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">رمز عبور فعلی</label>
                            <input type="password" id="currentPassword" 
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">رمز عبور جدید</label>
                            <input type="password" id="newPassword" 
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">تکرار رمز عبور جدید</label>
                            <input type="password" id="confirmPassword" 
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <button id="changePasswordBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            تغییر رمز عبور
                        </button>
                    </div>
                </div>
                
                <!-- دکمه‌های اقدام -->
                <div class="flex gap-4 pt-6 border-t">
                    <button id="saveSettings" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
                        ذخیره تغییرات
                    </button>
                    <button id="deleteAccountBtn" class="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50">
                        حذف حساب کاربری
                    </button>
                </div>
            </div>
        `;
    }
    
    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <!-- هدر -->
                    <div class="p-6 border-b flex justify-between items-center">
                        <h3 class="text-xl font-bold">جزئیات سفارش ${order.id}</h3>
                        <button class="text-2xl text-gray-500 hover:text-black" onclick="this.closest('.fixed').remove()">
                            &times;
                        </button>
                    </div>
                    
                    <!-- محتوا -->
                    <div class="p-6 space-y-6">
                        <!-- اطلاعات سفارش -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="font-semibold mb-3">اطلاعات سفارش</h4>
                                <div class="space-y-2 text-gray-600">
                                    <p>تاریخ سفارش: ${order.date}</p>
                                    <p>وضعیت: <span class="${this.getStatusClass(order.status)} px-2 py-1 rounded-full text-xs">
                                        ${this.getStatusText(order.status)}
                                    </span></p>
                                    <p>روش پرداخت: ${order.paymentMethod || 'آنلاین'}</p>
                                    <p>روش ارسال: ${order.shipping?.text || 'پست پیشتاز'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="font-semibold mb-3">اطلاعات مشتری</h4>
                                <div class="space-y-2 text-gray-600">
                                    <p>${order.customer?.name || 'نامشخص'}</p>
                                    <p>${order.customer?.phone || 'شماره تماس نامشخص'}</p>
                                    <p>${order.customer?.email || 'ایمیل نامشخص'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- آدرس ارسال -->
                        <div>
                            <h4 class="font-semibold mb-3">آدرس ارسال</h4>
                            <div class="bg-gray-50 p-4 rounded-lg text-gray-600">
                                ${order.customer?.address || 'آدرس نامشخص'}
                            </div>
                        </div>
                        
                        <!-- محصولات -->
                        <div>
                            <h4 class="font-semibold mb-3">محصولات سفارش</h4>
                            <div class="space-y-4">
                                ${order.items?.map(item => `
                                    <div class="flex items-center border-b pb-4">
                                        <img src="${item.image}" 
                                             alt="${item.name}" 
                                             class="w-16 h-16 object-cover rounded">
                                        <div class="flex-grow mr-4">
                                            <h5 class="font-semibold">${item.name}</h5>
                                            <p class="text-gray-600 text-sm">${item.category || ''}</p>
                                        </div>
                                        <div class="text-left">
                                            <p class="font-semibold">${this.formatPrice(item.price)}</p>
                                            <p class="text-gray-600 text-sm">${item.quantity} عدد</p>
                                        </div>
                                    </div>
                                `).join('') || 'هیچ محصولی یافت نشد'}
                            </div>
                        </div>
                        
                        <!-- جمع‌بندی مالی -->
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>جمع کل کالاها</span>
                                    <span>${this.formatPrice(order.subtotal || 0)}</span>
                                </div>
                                ${order.discount?.amount > 0 ? `
                                    <div class="flex justify-between text-green-600">
                                        <span>تخفیف (${order.discount?.code})</span>
                                        <span>-${this.formatPrice(order.discount?.amount || 0)}</span>
                                    </div>
                                ` : ''}
                                <div class="flex justify-between">
                                    <span>هزینه ارسال</span>
                                    <span>${this.formatPrice(order.shipping?.cost || 0)}</span>
                                </div>
                                <div class="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                                    <span>مبلغ قابل پرداخت</span>
                                    <span>${this.formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- دکمه‌های اقدام -->
                        <div class="flex gap-3 pt-4 border-t">
                            ${order.status === 'pending' ? `
                                <button class="cancel-order bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                                        data-id="${order.id}">
                                    لغو سفارش
                                </button>
                            ` : ''}
                            ${order.status === 'shipped' ? `
                                <button class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                        onclick="alert('کد رهگیری: TRACK${order.id}')">
                                    کد رهگیری
                                </button>
                            ` : ''}
                            <button class="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
                                    onclick="window.print()">
                                چاپ فاکتور
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
    }
    
    cancelOrder(orderId) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟')) {
            return;
        }
        
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            this.orders[orderIndex].status = 'cancelled';
            this.orders[orderIndex].cancelledAt = new Date().toLocaleString('fa-IR');
            localStorage.setItem('orders', JSON.stringify(this.orders));
            
            this.showToast('سفارش با موفقیت لغو شد', 'success');
            this.loadRecentOrders();
            this.loadOrders();
            this.updateStats();
        }
    }
    
    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        
        this.showToast('از لیست علاقه‌مندی‌ها حذف شد', 'success');
        this.loadWishlist();
        this.updateStats();
    }
    
    moveToCart(productId) {
        const product = this.wishlist.find(item => item.id === productId);
        if (!product) return;
        
        // اضافه کردن به سبد خرید
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // حذف از علاقه‌مندی‌ها
        this.removeFromWishlist(productId);
        
        this.showToast('به سبد خرید اضافه شد', 'success');
    }
    
    showAddAddressForm() {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl max-w-md w-full">
                    <div class="p-6 border-b flex justify-between items-center">
                        <h3 class="text-xl font-bold">افزودن آدرس جدید</h3>
                        <button class="text-2xl text-gray-500 hover:text-black" onclick="this.closest('.fixed').remove()">
                            &times;
                        </button>
                    </div>
                    
                    <form id="addAddressForm" class="p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">عنوان آدرس *</label>
                            <input type="text" name="title" required 
                                   placeholder="مثال: خانه، محل کار"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">نام و نام خانوادگی *</label>
                            <input type="text" name="fullName" required 
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">شماره موبایل *</label>
                            <input type="tel" name="phone" required pattern="09[0-9]{9}"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">استان *</label>
                                <select name="province" required class="w-full border rounded-lg px-4 py-2">
                                    <option value="">انتخاب کنید</option>
                                    <option value="tehran">تهران</option>
                                    <option value="alborz">البرز</option>
                                    <option value="esfahan">اصفهان</option>
                                    <option value="khorasan">خراسان</option>
                                    <!-- سایر استان‌ها -->
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">شهر *</label>
                                <select name="city" required class="w-full border rounded-lg px-4 py-2">
                                    <option value="">انتخاب کنید</option>
                                    <option value="tehran">تهران</option>
                                    <option value="karaj">کرج</option>
                                    <option value="esfahan">اصفهان</option>
                                    <option value="mashhad">مشهد</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">آدرس کامل *</label>
                            <textarea name="address" required rows="3" 
                                      class="w-full border rounded-lg px-4 py-2"
                                      placeholder="خیابان، پلاک، واحد"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">کد پستی *</label>
                            <input type="text" name="postalCode" required pattern="[0-9]{10}"
                                   class="w-full border rounded-lg px-4 py-2">
                        </div>
                        
                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" name="isDefault" class="ml-3">
                                <span>تنظیم به عنوان آدرس پیش‌فرض</span>
                            </label>
                        </div>
                        
                        <div class="flex gap-3 pt-4">
                            <button type="submit" class="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                                ذخیره آدرس
                            </button>
                            <button type="button" class="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                                    onclick="this.closest('.fixed').remove()">
                                انصراف
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // مدیریت فرم
        document.getElementById('addAddressForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewAddress(new FormData(e.target));
            modalContainer.remove();
        });
    }
    
    saveNewAddress(formData) {
        const address = {
            id: 'ADDR-' + Date.now(),
            title: formData.get('title'),
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            province: formData.get('province'),
            city: formData.get('city'),
            address: formData.get('address'),
            postalCode: formData.get('postalCode'),
            isDefault: formData.get('isDefault') === 'on'
        };
        
        if (address.isDefault) {
            this.userAddresses.forEach(addr => addr.isDefault = false);
        }
        
        this.userAddresses.push(address);
        localStorage.setItem('userAddresses', JSON.stringify(this.userAddresses));
        
        this.showToast('آدرس جدید با موفقیت ذخیره شد', 'success');
        this.loadAddresses();
    }
    
    deleteAddress(addressId) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟')) {
            return;
        }
        
        this.userAddresses = this.userAddresses.filter(addr => addr.id !== addressId);
        localStorage.setItem('userAddresses', JSON.stringify(this.userAddresses));
        
        this.showToast('آدرس با موفقیت حذف شد', 'success');
        this.loadAddresses();
    }
    
    editAddress(addressId) {
        // مشابه showAddAddressForm اما با داده‌های موجود
        // برای اختصار، کد مشابه قرار می‌دهیم
        this.showAddAddressForm();
    }
    
    setDefaultAddress(addressId) {
        this.userAddresses.forEach(addr => {
            addr.isDefault = addr.id === addressId;
        });
        
        localStorage.setItem('userAddresses', JSON.stringify(this.userAddresses));
        this.showToast('آدرس پیش‌فرض تغییر کرد', 'success');
        this.loadAddresses();
    }
    
    saveSettings() {
        const settings = {
            name: document.getElementById('firstName')?.value + ' ' + document.getElementById('lastName')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            birthDate: document.getElementById('birthDate')?.value,
            notifications: {
                email: document.getElementById('emailNotifications')?.checked,
                sms: document.getElementById('smsNotifications')?.checked,
                promotional: document.getElementById('promotionalEmails')?.checked
            }
        };
        
        this.currentUser = { ...this.currentUser, ...settings };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.loadUserProfile();
        this.showToast('تنظیمات با موفقیت ذخیره شد', 'success');
    }
    
    changePassword() {
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showToast('لطفا تمام فیلدها را پر کنید', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showToast('رمز عبور جدید و تکرار آن مطابقت ندارند', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showToast('رمز عبور جدید باید حداقل ۶ کاراکتر باشد', 'error');
            return;
        }
        
        // در حالت واقعی، اینجا باید با سرور چک شود
        this.showToast('رمز عبور با موفقیت تغییر کرد', 'success');
        
        // پاک کردن فیلدها
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }
    
    deleteAccount() {
        if (!confirm('آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عمل غیرقابل بازگشت است.')) {
            return;
        }
        
        // حذف اطلاعات کاربر
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userAddresses');
        localStorage.removeItem('wishlist');
        // سفارشات را حذف نمی‌کنیم چون ممکن است برای گزارش‌گیری نیاز باشد
        
        this.showToast('حساب کاربری شما حذف شد', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    checkPaymentResult() {
        if (this.paymentResult) {
            if (this.paymentResult.status === 'success') {
                this.showToast('پرداخت شما با موفقیت انجام شد', 'success');
                
                // آپدیت وضعیت سفارش
                const order = this.orders.find(o => o.id === this.paymentResult.orderId);
                if (order) {
                    order.paymentStatus = 'paid';
                    order.status = 'processing';
                    localStorage.setItem('orders', JSON.stringify(this.orders));
                }
            } else {
                this.showToast('پرداخت ناموفق بود', 'error');
            }
            
            // پاک کردن نتیجه پرداخت
            localStorage.removeItem('paymentResult');
        }
    }
    
    filterOrders(status) {
        const tableBody = document.getElementById('ordersTableBody');
        if (!tableBody) return;
        
        const filteredOrders = status === 'all' 
            ? this.orders 
            : this.orders.filter(order => order.status === status);
        
        tableBody.innerHTML = filteredOrders.map(order => `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-semibold">${order.id}</td>
                <td class="p-4">${order.date}</td>
                <td class="p-4">${this.formatPrice(order.total)}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs ${this.getStatusClass(order.status)}">
                        ${this.getStatusText(order.status)}
                    </span>
                </td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button class="order-details text-blue-600 hover:underline text-sm" 
                                data-id="${order.id}">
                            جزئیات
                        </button>
                        ${order.status === 'pending' ? `
                            <button class="cancel-order text-red-600 hover:underline text-sm" 
                                    data-id="${order.id}">
                                لغو
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    searchOrders(query) {
        const filteredOrders = this.orders.filter(order => 
            order.id.toLowerCase().includes(query.toLowerCase()) ||
            order.date.includes(query) ||
            order.customer?.name?.toLowerCase().includes(query.toLowerCase())
        );
        
        const tableBody = document.getElementById('ordersTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = filteredOrders.map(order => `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-semibold">${order.id}</td>
                <td class="p-4">${order.date}</td>
                <td class="p-4">${this.formatPrice(order.total)}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs ${this.getStatusClass(order.status)}">
                        ${this.getStatusText(order.status)}
                    </span>
                </td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button class="order-details text-blue-600 hover:underline text-sm" 
                                data-id="${order.id}">
                            جزئیات
                        </button>
                        ${order.status === 'pending' ? `
                            <button class="cancel-order text-red-600 hover:underline text-sm" 
                                    data-id="${order.id}">
                                لغو
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    setupChart() {
        // اگر chart.js موجود باشد، نمودار فعالیت‌ها را رسم می‌کند
        if (typeof Chart !== 'undefined') {
            const ctx = document.getElementById('activityChart')?.getContext('2d');
            if (!ctx) return;
            
            const ordersByMonth = this.getOrdersByMonth();
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
                    datasets: [{
                        label: 'تعداد سفارشات',
                        data: ordersByMonth,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }
    }
    
    getOrdersByMonth() {
        // شبیه‌سازی داده‌های سفارش بر اساس ماه
        return [3, 5, 2, 8, 4, 6]; // داده‌های نمونه
    }
    
    getStatusClass(status) {
        const classes = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }
    
    getStatusText(status) {
        const texts = {
            'pending': 'در انتظار پرداخت',
            'processing': 'در حال پردازش',
            'shipped': 'ارسال شده',
            'delivered': 'تحویل داده شده',
            'cancelled': 'لغو شده'
        };
        return texts[status] || 'نامشخص';
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        toast.textContent = message;
        toast.style.transform = 'translateY(-100px)';
        
        document.body.appendChild(toast);
        
        // انیمیشن نمایش
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        // حذف خودکار
        setTimeout(() => {
            toast.style.transform = 'translateY(-100px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    redirectToLogin() {
        this.showToast('لطفا ابتدا وارد حساب کاربری خود شوید', 'error');
        setTimeout(() => {
            window.location.href = 'index.html#login';
        }, 1500);
    }
    
    logout() {
        if (confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟')) {
            localStorage.removeItem('currentUser');
            this.showToast('با موفقیت خارج شدید', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
}

// راه‌اندازی وقتی DOM آماده شد
document.addEventListener('DOMContentLoaded', () => {
    const dashboardManager = new DashboardManager();
    
    // اضافه کردن استایل‌های اضافی
    const style = document.createElement('style');
    style.textContent = `
        .active-menu {
            background-color: #f3f4f6;
            color: #000;
        }
        
        .dashboard-section {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .order-status {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .shadow-hover {
            transition: box-shadow 0.3s ease;
        }
        
        .shadow-hover:hover {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .address-card {
            transition: all 0.3s ease;
        }
        
        .address-card:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
});

// توابع سراسری برای استفاده در onclick
window.editProfile = function() {
    const dashboard = document.querySelector('main').__dashboard;
    if (dashboard) dashboard.editProfile();
};

window.DashboardManager = DashboardManager;