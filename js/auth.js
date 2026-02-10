class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        console.log('🔧 راه‌اندازی سیستم احراز هویت...');
        this.loadCurrentUser();
        this.setupAuthForms();
        this.setupProtectedRoutes();
        this.updateUI();
    }
    
    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            console.log('📁 داده کاربر از localStorage:', userData);
            
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('👤 کاربر لاگین کرده:', this.currentUser.name);
            } else {
                console.log('👤 کاربر مهمان');
            }
        } catch (error) {
            console.error('❌ خطا در بارگذاری کاربر:', error);
            this.currentUser = null;
        }
    }
    
    setupAuthForms() {
        console.log('🔧 تنظیم فرم‌های احراز هویت...');
        
        // فرم ورود
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm' || e.target.classList.contains('login-form')) {
                e.preventDefault();
                console.log('📝 فرم لاگین submit شد');
                this.handleLogin(e.target);
            }
            
            if (e.target.id === 'registerForm' || e.target.classList.contains('register-form')) {
                e.preventDefault();
                console.log('📝 فرم ثبت‌نام submit شد');
                this.handleRegister(e.target);
            }
        });
        
        // دکمه خروج
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                e.preventDefault();
                console.log('🚪 دکمه خروج کلیک شد');
                this.handleLogout();
            }
        });
    }
    
    handleLogin(form) {
        console.log('🔐 پردازش لاگین...');
        
        let email, password;
        
        // یافتن فیلدها با انعطاف بیشتر
        const emailField = form.querySelector('input[type="email"], input[name="email"]');
        const passwordField = form.querySelector('input[type="password"], input[name="password"]');
        
        if (emailField) {
            email = emailField.value.trim();
            console.log('📧 ایمیل وارد شده:', email);
        }
        
        if (passwordField) {
            password = passwordField.value;
            console.log('🔑 طول رمز عبور:', password ? password.length : 0);
        }
        
        // اعتبارسنجی
        if (!email || !password) {
            this.showError('لطفا ایمیل و رمز عبور را وارد کنید');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('ایمیل معتبر نیست');
            return;
        }
        
        if (password.length < 3) {
            this.showError('رمز عبور باید حداقل ۳ کاراکتر باشد');
            return;
        }
        
        // یافتن کاربر
        const users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('👥 تعداد کاربران در سیستم:', users.length);
        
        const user = users.find(u => u.email === email);
        
        if (!user) {
            this.showError('کاربری با این ایمیل یافت نشد');
            return;
        }
        
        console.log('✅ کاربر یافت شد:', user.name);
        
        if (user.password !== password) {
            this.showError('رمز عبور اشتباه است');
            return;
        }
        
        if (user.status && user.status !== 'active') {
            this.showError('حساب کاربری غیرفعال است');
            return;
        }
        
        // ورود موفق
        this.login(user);
    }
    
    handleRegister(form) {
        console.log('📝 پردازش ثبت‌نام...');
        
        let name, email, password, confirmPassword;
        
        // یافتن فیلدها
        const nameField = form.querySelector('input[name="name"]');
        const emailField = form.querySelector('input[type="email"], input[name="email"]');
        const passwordField = form.querySelector('input[type="password"], input[name="password"]');
        const confirmField = form.querySelector('input[name="confirmPassword"]');
        const termsField = form.querySelector('input[name="terms"], input[type="checkbox"]');
        
        if (nameField) name = nameField.value.trim();
        if (emailField) email = emailField.value.trim();
        if (passwordField) password = passwordField.value;
        if (confirmField) confirmPassword = confirmField.value;
        
        // اعتبارسنجی
        const errors = [];

        
        if (!email || !this.validateEmail(email)) {
            errors.push('ایمیل معتبر نیست');
        }
        
        if (!password || password.length < 3) {
            errors.push('رمز عبور باید حداقل ۳ کاراکتر باشد');
        }
        
        if (password !== confirmPassword) {
            errors.push('رمز عبور و تکرار آن مطابقت ندارند');
        }
        
        if (termsField && !termsField.checked) {
            errors.push('لطفا قوانین را بپذیرید');
        }
        
        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
            return;
        }
        
        // بررسی وجود کاربر
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) {
            this.showError('این ایمیل قبلا ثبت شده است');
            return;
        }
        
        // ایجاد کاربر جدید
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, 
            createdAt: new Date().toISOString(),
            status: 'active',
            role: 'customer'
        };
        
        console.log('👤 کاربر جدید ایجاد شد:', newUser);
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // ورود خودکار
        this.login(newUser);
        
        this.showSuccess('ثبت‌نام موفقیت‌آمیز بود!');
    }
    
    login(user) {
        console.log('✅ ورود کاربر:', user.name);
        
        this.currentUser = user;
        
        // حذف اطلاعات حساس قبل از ذخیره
        const safeUser = { ...user };
        delete safeUser.password;
        
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        
        // آپدیت lastLogin
        user.lastLogin = new Date().toISOString();
        this.updateUserInDatabase(user);
        
        // آپدیت UI
        this.updateUI();
        this.showSuccess('ورود موفقیت‌آمیز بود');
        
        // بستن مودال
        this.closeAllModals();
        
        // ریدایرکت
        setTimeout(() => {
            const redirectTo = this.getRedirectUrl() || 'dashboard.html';
            console.log('🔄 ریدایرکت به:', redirectTo);
            window.location.href = redirectTo;
        }, 1500);
    }
    
    updateUserInDatabase(user) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            console.log('💾 اطلاعات کاربر به‌روزرسانی شد');
        }
    }
    
    handleLogout() {
        if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
            console.log('🚪 خروج کاربر:', this.currentUser?.name);
            
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            
            this.updateUI();
            this.showSuccess('با موفقیت خارج شدید');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
    
    updateUI() {
        console.log('🎨 آپدیت رابط کاربری...');
        
        const authElements = document.querySelectorAll('.auth-element');
        const userElements = document.querySelectorAll('.user-element');
        
        if (this.isLoggedIn()) {
            console.log('✅ نمایش رابط کاربری برای کاربر لاگین کرده');
            
            authElements.forEach(el => {
                el.style.display = 'none';
                el.classList.add('hidden');
            });
            
            userElements.forEach(el => {
                el.style.display = '';
                el.classList.remove('hidden');
            });
            
            // آپدیت نام کاربر
            document.querySelectorAll('.user-name').forEach(el => {
                if (this.currentUser?.name) {
                    el.textContent = this.currentUser.name;
                }
            });
            
        } else {
            console.log('👤 نمایش رابط کاربری برای کاربر مهمان');
            
            authElements.forEach(el => {
                el.style.display = '';
                el.classList.remove('hidden');
            });
            
            userElements.forEach(el => {
                el.style.display = 'none';
                el.classList.add('hidden');
            });
        }
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    isLoggedIn() {
        return !!this.currentUser;
    }
    
    getRedirectUrl() {
        return sessionStorage.getItem('redirectAfterLogin');
    }
    
    setRedirectUrl(url) {
        sessionStorage.setItem('redirectAfterLogin', url);
    }
    
    showError(message) {
        console.error('❌ خطا:', message);
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        console.log('✅ موفقیت:', message);
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'info') {
        // حذف نوتیفیکیشن قبلی
        const existing = document.querySelector('.auth-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `auth-notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500' :
            type === 'success' ? 'bg-green-500' :
            'bg-blue-500'
        } text-white transform transition-transform duration-300`;
        notification.textContent = message;
        notification.style.transform = 'translateX(100%)';
        
        document.body.appendChild(notification);
        
        // انیمیشن ورود
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // حذف خودکار
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        document.body.style.overflow = '';
    }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 شروع راه‌اندازی AuthManager...');
    const authManager = new AuthManager();
    window.AuthManager = authManager;
    console.log('✅ AuthManager راه‌اندازی شد');
});


