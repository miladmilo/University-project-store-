// main.js - فایل مدیریت اصلی سایت فروشگاهی

class NikeStore {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.updateCartCount1();
        this.checkAuthStatus();
        this.loadFeaturedProducts();
        this.setupMobileMenu();
        this.setupLoginSystem();
        this.setupSearch();
        this.initializeSliders();
        this.setupScrollAnimations();
        this.setupProductQuickView();
        this.setupNewsletter();
        this.setupBackToTop();
        this.setupLazyLoading();
        this.setupProductFilters();
        this.setupPriceFilters();
        this.setupSorting();
    }
    
    setupEventListeners() {
        // رویدادهای کلیک روی دکمه‌های افزودن به سبد خرید
        document.addEventListener('click', (e) => {
            // دکمه افزودن به سبد خرید
            if (e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const button = e.target.closest('.add-to-cart');
                this.addToCart(button);
            }
            
            // دکمه افزودن به علاقه‌مندی‌ها
            if (e.target.closest('.add-to-wishlist')) {
                e.preventDefault();
                const button = e.target.closest('.add-to-wishlist');
                this.toggleWishlist(button);
            }
            
            // دکمه مشاهده سریع محصول
            if (e.target.closest('.quick-view')) {
                e.preventDefault();
                const button = e.target.closest('.quick-view');
                this.showQuickView(button);
            }
            
            // دکمه اشتراک‌گذاری
            if (e.target.closest('.share-product')) {
                e.preventDefault();
                const button = e.target.closest('.share-product');
                this.shareProduct(button);
            }
        });
        
        // رویدادهای کیبورد
        document.addEventListener('keydown', (e) => {
            // ESC برای بستن مودال‌ها
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl+K برای جستجو
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
        });
        
        // رویدادهای اسکرول
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    setupMobileMenu() {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('overlay');
        let menuOpen = false;
        
        if (!menuBtn || !mobileMenu) return;
        
        function openMenu() {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-50', 'pointer-events-auto');
            menuBtn.innerHTML = '&times;';
            menuOpen = true;
            document.body.style.overflow = 'hidden';
        }
        
        function closeMenu() {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
            overlay.classList.remove('opacity-50', 'pointer-events-auto');
            overlay.classList.add('opacity-0', 'pointer-events-none');
            menuBtn.innerHTML = '&#9776;';
            menuOpen = false;
            document.body.style.overflow = '';
        }
        
        menuBtn.addEventListener('click', () => {
            if (!menuOpen) openMenu();
            else closeMenu();
        });
        
        overlay.addEventListener('click', closeMenu);
        
        // بستن منو با کلیک روی لینک‌ها
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    setupLoginSystem() {
        const signInLink = document.getElementById('signInLink');
        const signInLink2 = document.getElementById('signInLink2');
        const loginModal = document.getElementById('loginModal');
        const loginModal2 = document.getElementById('loginModal2');
        
        if (signInLink && loginModal) {
            this.setupModal(signInLink, loginModal);
        }
        
        if (signInLink2 && loginModal2) {
            this.setupModal(signInLink2, loginModal2);
        }
        
        // مدیریت فرم‌های ورود/ثبت‌نام
        this.setupAuthForms();
    }
    
    setupModal(trigger, modal) {
        const closeBtn = modal.querySelector('.close-modal');
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
            }, 10);
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        // بستن مودال با کلیک بیرون
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // بستن با ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal(modal);
            }
        });
    }
    
    closeModal(modal) {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal);
        });
    }
    
    setupAuthForms() {
        // فرم ورود
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }
        
        // فرم ثبت‌نام
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(registerForm);
            });
        }
        
        // دکمه خروج
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }
    
    handleLogin(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        // اعتبارسنجی ساده
        if (!email || !password) {
            this.showToast('لطفا تمام فیلدها را پر کنید', 'error');
            return;
        }
        
        // در حالت واقعی، اینجا درخواست به سرور ارسال می‌شود
        // برای نمونه، یک کاربر تست ایجاد می‌کنیم
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            this.showToast('ورود موفقیت‌آمیز بود', 'success');
            this.updateAuthUI();
            this.closeModal(form.closest('.modal'));
            
            // ریدایرکت به داشبورد اگر در صفحه اصلی هستیم
            setTimeout(() => {
                if (window.location.pathname.includes('index')) {
                    window.location.href = 'dashboard.html';
                }
            }, 1500);
        } else {
            this.showToast('ایمیل یا رمز عبور اشتباه است', 'error');
        }
    }
    
    handleRegister(form) {
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;
        
        // اعتبارسنجی
        if (!name || !email || !password || !confirmPassword) {
            this.showToast('لطفا تمام فیلدها را پر کنید', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showToast('رمز عبور و تکرار آن مطابقت ندارند', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
            return;
        }
        
        // بررسی وجود کاربر
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) {
            this.showToast('این ایمیل قبلا ثبت شده است', 'error');
            return;
        }
        
        // ایجاد کاربر جدید
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // در حالت واقعی باید هش شود
            createdAt: new Date().toISOString(),
            role: 'customer'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // ورود خودکار
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        this.showToast('ثبت‌نام موفقیت‌آمیز بود', 'success');
        this.updateAuthUI();
        this.closeModal(form.closest('.modal'));
    }
    
    handleLogout() {
        if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            this.updateAuthUI();
            this.showToast('با موفقیت خارج شدید', 'success');
            
            // اگر در داشبورد هستیم، به صفحه اصلی برو
            if (window.location.pathname.includes('dashboard')) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        }
    }
    
    updateAuthUI() {
        const authElements = document.querySelectorAll('.auth-element');
        const userElements = document.querySelectorAll('.user-element');
        
        if (this.currentUser) {
            // کاربر لاگین کرده
            authElements.forEach(el => el.classList.add('hidden'));
            userElements.forEach(el => el.classList.remove('hidden'));
            
            // آپدیت نام کاربر
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = this.currentUser.name;
            });
        } else {
            // کاربر مهمان
            authElements.forEach(el => el.classList.remove('hidden'));
            userElements.forEach(el => el.classList.add('hidden'));
        }
    }
    
    checkAuthStatus() {
        this.updateAuthUI();
    }
    
    addToCart(button) {
        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: parseInt(button.dataset.price),
            image: button.dataset.image,
            category: button.dataset.category,
            size: button.dataset.size || 'M',
            color: button.dataset.color || 'مشکی'
        };
        
        // بررسی وجود محصول در سبد
        const existingItem = this.cart.find(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            product.quantity = 1;
            this.cart.push(product);
        }
        
        // ذخیره در localStorage
        localStorage.setItem('cart', JSON.stringify(this.cart));
        
        // آپدیت UI
        this.updateCartCount();
        this.updateCartCount1();
        this.showNotification('محصول به سبد خرید اضافه شد', 'success');
        
        // انیمیشن اضافه شدن به سبد
        this.animateAddToCart(button);
    }
    
    animateAddToCart(button) {
        const cartIcon = document.querySelector('.cart-icon');
        const cartIcon1 = document.querySelector('.cart-icon');
        const cartIcon2 = document.querySelector('.cart-icon');
        const cartIcon3 = document.querySelector('.cart-icon');
        const cartIcon4 = document.querySelector('.cart-icon');
        const cartIcon5 = document.querySelector('.cart-icon');
        const cartIcon6 = document.querySelector('.cart-icon');
        const cartIcon7 = document.querySelector('.cart-icon');
        const cartIcon8 = document.querySelector('.cart-icon');
        if (!cartIcon , !cartIcon1 , !cartIcon2 , !cartIcon3 , !cartIcon4 , !cartIcon5 , !cartIcon6 , !cartIcon7 , !cartIcon8) return;
        
        // ایجاد عنصر شبیه‌سازی شده
        const clone = button.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '0.7';
        
        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        const cartRect1 = cartIcon1.getBoundingClientRect();
        const cartRect2 = cartIcon2.getBoundingClientRect();
        const cartRect3 = cartIcon3.getBoundingClientRect();
        const cartRect4 = cartIcon4.getBoundingClientRect();
        const cartRect5 = cartIcon5.getBoundingClientRect();
        const cartRect6 = cartIcon6.getBoundingClientRect();
        const cartRect7 = cartIcon7.getBoundingClientRect();
        const cartRect8 = cartIcon8.getBoundingClientRect();
        
        clone.style.left = buttonRect.left + 'px';
        clone.style.top = buttonRect.top + 'px';
        clone.style.width = buttonRect.width + 'px';
        clone.style.height = buttonRect.height + 'px';
        
        document.body.appendChild(clone);
        
        // انیمیشن
        requestAnimationFrame(() => {
            clone.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            clone.style.left = cartRect.left + 'px';
            clone.style.left = cartRect1.left + 'px';
            clone.style.left = cartRect2.left + 'px';
            clone.style.left = cartRect3.left + 'px';
            clone.style.left = cartRect4.left + 'px';
            clone.style.left = cartRect5.left + 'px';
            clone.style.left = cartRect6.left + 'px';
            clone.style.left = cartRect7.left + 'px';
            clone.style.left = cartRect8.left + 'px';
            clone.style.top = cartRect.top + 'px';
            clone.style.top = cartRect1.top + 'px';
            clone.style.top = cartRect2.top + 'px';
            clone.style.top = cartRect3.top + 'px';
            clone.style.top = cartRect4.top + 'px';
            clone.style.top = cartRect5.top + 'px';
            clone.style.top = cartRect6.top + 'px';
            clone.style.top = cartRect7.top + 'px';
            clone.style.top = cartRect8.top + 'px';
            clone.style.width = '10px';
            clone.style.height = '10px';
            clone.style.opacity = '0';
        });
        
        // حذف بعد از انیمیشن
        setTimeout(() => {
            clone.remove();
        }, 500);
    }
    
    toggleWishlist(button) {
        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: parseInt(button.dataset.price),
            image: button.dataset.image,
            category: button.dataset.category
        };
        
        const existingIndex = this.wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            // حذف از علاقه‌مندی‌ها
            this.wishlist.splice(existingIndex, 1);
            button.innerHTML = '<i class="far fa-heart"></i>';
            this.showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
        } else {
            // اضافه به علاقه‌مندی‌ها
            this.wishlist.push(product);
            button.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
            this.showNotification('به علاقه‌مندی‌ها اضافه شد', 'success');
        }
        
        // ذخیره در localStorage
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        
        // آپدیت تعداد علاقه‌مندی‌ها
        this.updateWishlistCount();
    }
    
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) return;
        
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('hidden', totalItems === 0);
    }
    updateCartCount1() {
        const cartCount1 = document.getElementById('cartCount1');
        if (!cartCount1) return;
        
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount1.textContent = totalItems;
        cartCount1.classList.toggle('hidden', totalItems === 0);
    }
    
    updateWishlistCount() {
        const wishlistCount = document.getElementById('wishlistCount');
        if (!wishlistCount) return;
        
        wishlistCount.textContent = this.wishlist.length;
        wishlistCount.classList.toggle('hidden', this.wishlist.length === 0);
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput || !searchResults) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.classList.add('hidden');
                return;
            }
            
            searchTimeout = setTimeout(() => {
                this.performSearch(query, searchResults);
            }, 300);
        });
        
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                searchResults.classList.remove('hidden');
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }
    
    performSearch(query, resultsContainer) {
        // در حالت واقعی، اینجا درخواست به API ارسال می‌شود
        // برای نمونه، داده‌های ثابت استفاده می‌کنیم
        const sampleProducts = [
            { id: 1, name: 'Nike Air Max 270', category: 'کفش دویدن', price: 3200000 },
            { id: 2, name: 'Nike Jordan 1', category: 'کفش بسکتبال', price: 4500000 },
            { id: 3, name: 'Nike Cortez', category: 'کفش اسپرت', price: 1800000 },
            { id: 4, name: 'Nike T-Shirt', category: 'پوشاک', price: 450000 },
            { id: 5, name: 'Nike Hoodie', category: 'پوشاک', price: 850000 }
        ];
        
        const filteredProducts = sampleProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.includes(query)
        );
        
        if (filteredProducts.length === 0) {
            resultsContainer.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    هیچ محصولی یافت نشد
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="py-2">
                    ${filteredProducts.map(product => `
                        <a href="products.html?id=${product.id}" 
                           class="flex items-center p-3 hover:bg-gray-100 transition-colors">
                            <div class="w-10 h-10 bg-gray-200 rounded ml-3"></div>
                            <div class="flex-grow">
                                <div class="font-medium">${product.name}</div>
                                <div class="text-sm text-gray-600">${product.category}</div>
                            </div>
                            <div class="font-bold">${this.formatPrice(product.price)}</div>
                        </a>
                    `).join('')}
                    
                    <div class="p-3 border-t">
                        <a href="products.html?q=${encodeURIComponent(query)}" 
                           class="block text-center text-blue-600 hover:text-blue-800">
                            مشاهده همه نتایج
                        </a>
                    </div>
                </div>
            `;
        }
        
        resultsContainer.classList.remove('hidden');
    }
    
    initializeSliders() {
        // اسلایدر بنر اصلی
        this.initBannerSlider();
        
        // اسلایدر محصولات
        this.initProductSliders();
        
        // اسلایدر برندها
        this.initBrandSlider();
    }
    
    initBannerSlider() {
        const slides = document.querySelectorAll('.banner-slide');
        const dots = document.querySelectorAll('.banner-dot');
        const prevBtn = document.getElementById('prevBanner');
        const nextBtn = document.getElementById('nextBanner');
        
        if (!slides.length) return;
        
        let currentSlide = 0;
        let slideInterval;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                slide.style.opacity = i === index ? '1' : '0';
                slide.style.zIndex = i === index ? '1' : '0';
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        function nextSlide() {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        }
        
        function prevSlide() {
            let prev = currentSlide - 1;
            if (prev < 0) prev = slides.length - 1;
            showSlide(prev);
        }
        
        // رویدادها
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
        
        // اتوپلی
        function startAutoPlay() {
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoPlay() {
            clearInterval(slideInterval);
        }
        
        // شروع اتوپلی
        startAutoPlay();
        
        // توقف هنگام هاور
        const slider = document.querySelector('.banner-slider');
        if (slider) {
            slider.addEventListener('mouseenter', stopAutoPlay);
            slider.addEventListener('mouseleave', startAutoPlay);
        }
        
        // توقف هنگام فوکوس
        slider?.addEventListener('focusin', stopAutoPlay);
        slider?.addEventListener('focusout', startAutoPlay);
    }
    
    initProductSliders() {
        // اسلایدر افقی محصولات
        const sliders = document.querySelectorAll('.horizontal-slider');
        
        sliders.forEach(slider => {
            const container = slider.querySelector('.slider-container');
            const prevBtn = slider.querySelector('.slider-prev');
            const nextBtn = slider.querySelector('.slider-next');
            
            if (!container || !prevBtn || !nextBtn) return;
            
            let scrollPosition = 0;
            const scrollAmount = 300;
            
            prevBtn.addEventListener('click', () => {
                scrollPosition = Math.max(scrollPosition - scrollAmount, 0);
                container.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
            
            nextBtn.addEventListener('click', () => {
                const maxScroll = container.scrollWidth - container.clientWidth;
                scrollPosition = Math.min(scrollPosition + scrollAmount, maxScroll);
                container.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
            
            // آپدیت وضعیت دکمه‌ها
            function updateButtons() {
                scrollPosition = container.scrollLeft;
                const maxScroll = container.scrollWidth - container.clientWidth;
                
                prevBtn.classList.toggle('opacity-50', scrollPosition === 0);
                prevBtn.disabled = scrollPosition === 0;
                
                nextBtn.classList.toggle('opacity-50', scrollPosition >= maxScroll);
                nextBtn.disabled = scrollPosition >= maxScroll;
            }
            
            container.addEventListener('scroll', updateButtons);
            window.addEventListener('resize', updateButtons);
            updateButtons();
        });
    }
    
    initBrandSlider() {
        const brands = [
            { name: 'Nike', logo: 'img/brands/nike.png' },
            { name: 'Jordan', logo: 'img/brands/jordan.png' },
            { name: 'Converse', logo: 'img/brands/converse.png' },
            { name: 'Adidas', logo: 'img/brands/adidas.png' },
            { name: 'Puma', logo: 'img/brands/puma.png' },
            { name: 'Reebok', logo: 'img/brands/reebok.png' },
            { name: 'New Balance', logo: 'img/brands/new-balance.png' },
            { name: 'Under Armour', logo: 'img/brands/under-armour.png' }
        ];
        
        const brandsContainer = document.getElementById('brandsSlider');
        if (!brandsContainer) return;
        
        // دو برابر کردن برندها برای لوپ بی‌نهایت
        const duplicatedBrands = [...brands, ...brands];
        
        brandsContainer.innerHTML = duplicatedBrands.map(brand => `
            <div class="brand-slide flex-shrink-0 w-32 h-32 flex items-center justify-center">
                <img src="${brand.logo}" alt="${brand.name}" class="max-w-full max-h-full opacity-70 hover:opacity-100 transition-opacity">
            </div>
        `).join('');
        
        // انیمیشن اتوماتیک
        let position = 0;
        const speed = 0.5; // پیکسل در فریم
        
        function animate() {
            position -= speed;
            
            if (position <= -brandsContainer.scrollWidth / 2) {
                position = 0;
            }
            
            brandsContainer.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // مشاهده عناصری که باید انیمیشن داشته باشند
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // انیمیشن‌های خاص
        this.setupCounterAnimations();
        this.setupParallaxEffects();
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    setupProductQuickView() {
        // نمونه داده محصولات
        const products = {
            1: {
                id: 1,
                name: 'Nike Air Max 270',
                price: 3200000,
                description: 'کفش دویدن با کفی Air Max برای راحتی بیشتر',
                images: ['img/products/airmax1.jpg', 'img/products/airmax2.jpg', 'img/products/airmax3.jpg'],
                sizes: [38, 39, 40, 41, 42, 43, 44],
                colors: ['مشکی', 'سفید', 'آبی', 'قرمز'],
                category: 'کفش دویدن',
                rating: 4.5,
                reviews: 128
            }
        };
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-view')) {
                const button = e.target.closest('.quick-view');
                const productId = button.dataset.id;
                const product = products[productId];
                
                if (product) {
                    this.showQuickViewModal(product);
                }
            }
        });
    }
    
    showQuickViewModal(product) {
        const modalHTML = `
            <div class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <h3 class="text-2xl font-bold">${product.name}</h3>
                            <button class="close-modal text-3xl text-gray-500 hover:text-black">&times;</button>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- تصاویر محصول -->
                            <div>
                                <div class="mb-4">
                                    <img id="mainImage" src="${product.images[0]}" 
                                         alt="${product.name}" 
                                         class="w-full h-96 object-cover rounded-lg">
                                </div>
                                <div class="flex gap-2">
                                    ${product.images.map((img, index) => `
                                        <button class="thumbnail ${index === 0 ? 'border-2 border-black' : 'border'}" 
                                                onclick="document.getElementById('mainImage').src = '${img}'">
                                            <img src="${img}" alt="تصویر ${index + 1}" 
                                                 class="w-20 h-20 object-cover">
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- اطلاعات محصول -->
                            <div>
                                <div class="mb-4">
                                    <div class="flex items-center mb-2">
                                        <div class="text-yellow-400 text-lg">
                                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                                        </div>
                                        <span class="text-gray-600 mr-2">(${product.reviews} نظر)</span>
                                    </div>
                                    <div class="text-3xl font-bold mb-2">${this.formatPrice(product.price)}</div>
                                    <p class="text-gray-600">${product.description}</p>
                                </div>
                                
                                <!-- سایزها -->
                                <div class="mb-6">
                                    <h4 class="font-semibold mb-3">سایز</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${product.sizes.map(size => `
                                            <button class="size-option border px-4 py-2 rounded hover:border-black ${size === 40 ? 'border-2 border-black' : ''}">
                                                ${size}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <!-- رنگ‌ها -->
                                <div class="mb-6">
                                    <h4 class="font-semibold mb-3">رنگ</h4>
                                    <div class="flex gap-3">
                                        ${product.colors.map((color, index) => `
                                            <button class="color-option w-10 h-10 rounded-full border-2 ${index === 0 ? 'border-black' : 'border-gray-300'}"
                                                    style="background-color: ${this.getColorCode(color)}"
                                                    title="${color}">
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <!-- دکمه‌های اقدام -->
                                <div class="flex gap-3">
                                    <button class="add-to-cart flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                                            data-id="${product.id}"
                                            data-name="${product.name}"
                                            data-price="${product.price}"
                                            data-image="${product.images[0]}"
                                            data-category="${product.category}">
                                        افزودن به سبد خرید
                                    </button>
                                    <button class="add-to-wishlist w-12 border border-gray-300 rounded-lg hover:bg-gray-100"
                                            data-id="${product.id}"
                                            data-name="${product.name}"
                                            data-price="${product.price}"
                                            data-image="${product.images[0]}"
                                            data-category="${product.category}">
                                        <i class="far fa-heart"></i>
                                    </button>
                                </div>
                                
                                <!-- اطلاعات اضافی -->
                                <div class="mt-8 pt-6 border-t">
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span class="text-gray-600">دسته‌بندی:</span>
                                            <span class="font-medium">${product.category}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-600">موجودی:</span>
                                            <span class="font-medium text-green-600">در انبار موجود است</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // مدیریت مودال
        const modal = modalContainer.querySelector('.modal');
        this.setupModal(null, modal);
    }
    
    getColorCode(colorName) {
        const colors = {
            'مشکی': '#000000',
            'سفید': '#FFFFFF',
            'آبی': '#3B82F6',
            'قرمز': '#EF4444',
            'سبز': '#10B981',
            'زرد': '#F59E0B'
        };
        return colors[colorName] || '#CCCCCC';
    }
    
    setupNewsletter() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (!this.validateEmail(email)) {
                this.showToast('لطفا یک ایمیل معتبر وارد کنید', 'error');
                return;
            }
            
            // ذخیره در localStorage
            const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            }
            
            this.showToast('با موفقیت در خبرنامه عضو شدید', 'success');
            newsletterForm.reset();
        });
    }
    
    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.remove('opacity-0', 'invisible');
                backToTop.classList.add('opacity-100', 'visible');
            } else {
                backToTop.classList.remove('opacity-100', 'visible');
                backToTop.classList.add('opacity-0', 'invisible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // مرورگر از lazy loading پشتیبانی می‌کند
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // پلی‌فیل برای مرورگرهای قدیمی
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    setupProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const products = document.querySelectorAll('.product-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // آپدیت دکمه فعال
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                // فیلتر محصولات
                products.forEach(product => {
                    if (filter === 'all' || product.dataset.category === filter) {
                        product.style.display = 'block';
                        setTimeout(() => {
                            product.style.opacity = '1';
                            product.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        product.style.opacity = '0';
                        product.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            product.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    setupPriceFilters() {
        const priceSlider = document.getElementById('priceSlider');
        const priceRange = document.getElementById('priceRange');
        
        if (!priceSlider || !priceRange) return;
        
        const minPrice = 0;
        const maxPrice = 10000000;
        
        priceSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            priceRange.textContent = `تا ${this.formatPrice(value)}`;
            
            // فیلتر محصولات بر اساس قیمت
            this.filterProductsByPrice(value);
        });
    }
    
    filterProductsByPrice(maxPrice) {
        const products = document.querySelectorAll('.product-item');
        
        products.forEach(product => {
            const price = parseInt(product.dataset.price) || 0;
            
            if (price <= maxPrice) {
                product.style.display = 'block';
                setTimeout(() => {
                    product.style.opacity = '1';
                }, 10);
            } else {
                product.style.opacity = '0';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });
    }
    
    setupSorting() {
        const sortSelect = document.getElementById('sortProducts');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            this.sortProducts(sortBy);
        });
    }
    
    sortProducts(sortBy) {
        const productsContainer = document.querySelector('.products-grid');
        if (!productsContainer) return;
        
        const products = Array.from(productsContainer.querySelectorAll('.product-item'));
        
        products.sort((a, b) => {
            const aPrice = parseInt(a.dataset.price) || 0;
            const bPrice = parseInt(b.dataset.price) || 0;
            const aDate = a.dataset.date || '';
            const bDate = b.dataset.date || '';
            const aRating = parseFloat(a.dataset.rating) || 0;
            const bRating = parseFloat(b.dataset.rating) || 0;
            
            switch(sortBy) {
                case 'price-low':
                    return aPrice - bPrice;
                case 'price-high':
                    return bPrice - aPrice;
                case 'newest':
                    return new Date(bDate) - new Date(aDate);
                case 'popular':
                    return bRating - aRating;
                default:
                    return 0;
            }
        });
        
        // مرتب‌سازی مجدد DOM
        products.forEach(product => {
            productsContainer.appendChild(product);
        });
    }
    
    loadFeaturedProducts() {
        const featuredContainer = document.getElementById('featuredProducts');
        if (!featuredContainer) return;
        
        // در حالت واقعی، اینجا داده از API دریافت می‌شود
        const featuredProducts = [
            {
                id: 1,
                name: 'Nike Air Max 270',
                price: 3200000,
                image: 'img/products/airmax-featured.jpg',
                category: 'کفش دویدن',
                rating: 4.5,
                isNew: true
            },
            {
                id: 2,
                name: 'Nike Jordan 1',
                price: 4500000,
                image: 'img/products/jordan-featured.jpg',
                category: 'کفش بسکتبال',
                rating: 4.8,
                isSale: true,
                oldPrice: 5000000
            },
            {
                id: 3,
                name: 'Nike Hoodie',
                price: 850000,
                image: 'img/products/hoodie-featured.jpg',
                category: 'پوشاک',
                rating: 4.2
            },
            {
                id: 4,
                name: 'Nike Backpack',
                price: 650000,
                image: 'img/products/backpack-featured.jpg',
                category: 'اکسسوری',
                rating: 4.6
            }
        ];
        
        featuredContainer.innerHTML = featuredProducts.map(product => `
            <div class="product-item bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                 data-id="${product.id}"
                 data-price="${product.price}"
                 data-category="${product.category}"
                 data-rating="${product.rating}">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                    
                    <!-- Badges -->
                    <div class="absolute top-3 left-3 flex gap-2">
                        ${product.isNew ? `
                            <span class="bg-green-500 text-white text-xs px-2 py-1 rounded">جدید</span>
                        ` : ''}
                        ${product.isSale ? `
                            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded">حراج</span>
                        ` : ''}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="absolute top-3 right-3 flex flex-col gap-2">
                        <button class="add-to-wishlist w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image}"
                                data-category="${product.category}">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="quick-view w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-blue-50"
                                data-id="${product.id}">
                            <i class="far fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-4">
                    <h3 class="font-semibold mb-2">${product.name}</h3>
                    <div class="flex items-center mb-3">
                        <div class="text-yellow-400 text-sm">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                        </div>
                        <span class="text-gray-600 text-sm mr-2">(${product.rating})</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-lg font-bold">${this.formatPrice(product.price)}</span>
                            ${product.oldPrice ? `
                                <span class="text-gray-500 text-sm line-through mr-2">${this.formatPrice(product.oldPrice)}</span>
                            ` : ''}
                        </div>
                        <button class="add-to-cart bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image}"
                                data-category="${product.category}">
                            افزودن
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    shareProduct(button) {
        const productId = button.dataset.id;
        const productName = button.dataset.name;
        const productUrl = `${window.location.origin}/product.html?id=${productId}`;
        
        // بررسی قابلیت اشتراک‌گذاری
        if (navigator.share) {
            navigator.share({
                title: productName,
                text: `محصول ${productName} را ببینید`,
                url: productUrl
            });
        } else {
            // کپی لینک به کلیپ‌بورد
            navigator.clipboard.writeText(productUrl).then(() => {
                this.showToast('لینک محصول کپی شد', 'success');
            });
        }
    }
    
    handleScroll() {
        // اضافه کردن کلاس scrolled به هدر هنگام اسکرول
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        // انیمیشن عناصر هنگام اسکرول
        this.animateOnScroll();
    }
    
    animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in-up');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
    
    showNotification(message, type = 'info') {
        // ایجاد نوتفیکیشن
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
        } text-white`;
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
        }, 3000);
    }
    
    showToast(message, type = 'info') {
        this.showNotification(message, type);
    }
}

// راه‌اندازی وقتی DOM آماده شد
document.addEventListener('DOMContentLoaded', () => {
    const nikeStore = new NikeStore();
    
    // ذخیره instance برای دسترسی از کنسول
    window.nikeStore = nikeStore;
    
    // اضافه کردن استایل‌های انیمیشن
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .fade-in-up.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .scrolled header {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
        }
        
        .brand-slide {
            animation: slide 20s linear infinite;
        }
        
        @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// توابع کمکی global
window.formatPrice = function(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

window.validateEmail = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// پلی‌فیل برای IntersectionObserver
if (!('IntersectionObserver' in window)) {
    // Load polyfill
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}