// data.js - ساختار داده‌های مورد نیاز برای سایت فروشگاهی

const AppData = {
    // ==================== کاربران (Users) ====================
    users: [
        {
            id: 1,
            email: "admin@nike.com",
            password: "admin123", // در واقعیت باید هش شود
            name: "مدیر سیستم",
            phone: "09123456789",
            role: "admin",
            avatar: "img/avatars/admin.jpg",
            createdAt: "2024-01-15T10:30:00Z",
            lastLogin: "2024-03-20T14:25:00Z",
            status: "active",
            permissions: [
                "manage_products",
                "manage_orders",
                "manage_users",
                "view_reports"
            ],
            preferences: {
                language: "fa",
                theme: "light",
                emailNotifications: true,
                smsNotifications: false,
                newsletter: true
            },
            address: {
                province: "تهران",
                city: "تهران",
                postalCode: "1234567890",
                fullAddress: "خیابان انقلاب، پلاک 123، واحد 4"
            }
        },
        {
            id: 2,
            email: "ali.mohammadi@email.com",
            password: "ali123456",
            name: "علی محمدی",
            phone: "09123456780",
            role: "customer",
            avatar: "img/avatars/user1.jpg",
            createdAt: "2024-02-10T08:15:00Z",
            lastLogin: "2024-03-21T09:45:00Z",
            status: "active",
            birthDate: "1375-05-15",
            gender: "male",
            occupation: "دانشجو",
            preferences: {
                language: "fa",
                theme: "dark",
                emailNotifications: true,
                smsNotifications: true,
                newsletter: true,
                sizeChart: {
                    shoe: 42,
                    shirt: "L",
                    pants: "M"
                }
            },
            socialAccounts: {
                instagram: "@ali.mohammadi",
                twitter: "@ali_moh"
            },
            loyaltyPoints: 1250,
            membershipLevel: "gold",
            totalSpent: 12500000,
            addresses: [
                {
                    id: 1,
                    title: "خانه",
                    fullName: "علی محمدی",
                    phone: "09123456780",
                    province: "تهران",
                    city: "تهران",
                    postalCode: "1234567890",
                    address: "خیابان انقلاب، پلاک 123، واحد 4",
                    isDefault: true
                },
                {
                    id: 2,
                    title: "محل کار",
                    fullName: "علی محمدی",
                    phone: "09123456780",
                    province: "البرز",
                    city: "کرج",
                    postalCode: "9876543210",
                    address: "میدان آزادی، برج تجاری، طبقه 5",
                    isDefault: false
                }
            ],
            paymentMethods: [
                {
                    id: 1,
                    type: "card",
                    cardNumber: "6037-****-****-1234",
                    bank: "ملی",
                    ownerName: "علی محمدی",
                    isDefault: true
                }
            ]
        },
        {
            id: 3,
            email: "sara.ahmadi@email.com",
            password: "sara123456",
            name: "سارا احمدی",
            phone: "09351234567",
            role: "customer",
            avatar: "img/avatars/user2.jpg",
            createdAt: "2024-03-01T11:20:00Z",
            lastLogin: "2024-03-20T16:30:00Z",
            status: "active",
            birthDate: "1378-08-22",
            gender: "female",
            occupation: "طراح",
            preferences: {
                language: "fa",
                theme: "light",
                emailNotifications: true,
                smsNotifications: false,
                newsletter: false,
                sizeChart: {
                    shoe: 38,
                    shirt: "M",
                    pants: "S"
                }
            },
            loyaltyPoints: 350,
            membershipLevel: "silver",
            totalSpent: 3500000,
            addresses: [
                {
                    id: 1,
                    title: "منزل",
                    fullName: "سارا احمدی",
                    phone: "09351234567",
                    province: "اصفهان",
                    city: "اصفهان",
                    postalCode: "4567890123",
                    address: "خیابان چهارباغ، کوچه هنر، پلاک 45",
                    isDefault: true
                }
            ]
        },
        {
            id: 4,
            email: "guest@example.com",
            password: "",
            name: "کاربر مهمان",
            role: "guest",
            status: "active",
            createdAt: "2024-03-15T12:00:00Z"
        }
    ],

    // ==================== محصولات (Products) ====================
    products: [
        {
            id: 1,
            sku: "NK-AM270-BLK",
            name: "Nike Air Max 270",
            description: "کفش دویدن با تکنولوژی Air Max برای حداکثر راحتی و عملکرد",
            longDescription: "کفش Nike Air Max 270 با طراحی مدرن و کفی Air Max که اولین بار در این مدل معرفی شده است. این کفش برای دویدن روزمره طراحی شده و با ترکیبی از سبکی و استحکام، تجربه‌ای بی‌نظیر ارائه می‌دهد.",
            category: "running",
            subcategory: "men",
            price: 3200000,
            oldPrice: 3800000,
            discount: 15,
            colors: [
                {
                    name: "black",
                    code: "#000000",
                    images: [
                        "img/products/airmax/black-1.jpg",
                        "img/products/airmax/black-2.jpg",
                        "img/products/airmax/black-3.jpg"
                    ],
                    stock: 15
                },
                {
                    name: "سفید",
                    code: "#FFFFFF",
                    images: [
                        "img/products/airmax/white-1.jpg",
                        "img/products/airmax/white-2.jpg"
                    ],
                    stock: 8
                }
            ],
            sizes: [
                { size: 38, stock: 5 },
                { size: 39, stock: 7 },
                { size: 40, stock: 10 },
                { size: 41, stock: 12 },
                { size: 42, stock: 8 },
                { size: 43, stock: 6 },
                { size: 44, stock: 4 }
            ],
            features: [
                "کفی Air Max برای جذب ضربه",
                "رویه مشبک برای تهویه عالی",
                "کف لاستیکی با دوام",
                "سبک وزن (280 گرم)",
                "قابلیت شستشو"
            ],
            specifications: {
                weight: "280g",
                material: "مش Breathable، لاستیک",
                origin: "ویتنام",
                warranty: "6 ماه گارانتی ساخت"
            },
            rating: 4.5,
            reviews: 128,
            soldCount: 450,
            isFeatured: true,
            isNew: true,
            isOnSale: true,
            tags: ["دویدن", "اسپرت", "Air Max", "پرطرفدار"],
            createdAt: "2024-01-10T00:00:00Z",
            updatedAt: "2024-03-15T00:00:00Z"
        },
        {
            id: 2,
            sku: "NK-JD1-RED",
            name: "Nike Jordan 1",
            description: "کفش اسطوره‌ای بسکتبال با طراحی کلاسیک",
            category: "basketball",
            subcategory: "men",
            price: 4500000,
            colors: [
                {
                    name: "قرمز",
                    code: "#DC2626",
                    images: ["img/products/jordan/red-1.jpg"],
                    stock: 3
                }
            ],
            sizes: [
                { size: 40, stock: 2 },
                { size: 42, stock: 1 }
            ],
            rating: 4.8,
            reviews: 89,
            isFeatured: true,
            tags: ["بسکتبال", "Jordan", "کلاسیک"]
        }
        // ... محصولات بیشتر
    ],

    // ==================== سفارشات (Orders) ====================
    orders: [
        {
            id: "ORD-20240321-001",
            userId: 2,
            date: "2024-03-21T14:30:00Z",
            status: "delivered",
            items: [
                {
                    productId: 1,
                    name: "Nike Air Max 270",
                    color: "black",
                    size: 42,
                    quantity: 1,
                    price: 3200000,
                    image: "img/products/airmax/black-1.jpg"
                },
                {
                    productId: 3,
                    name: "Nike T-Shirt",
                    color: "سفید",
                    size: "L",
                    quantity: 2,
                    price: 450000,
                    image: "img/products/tshirt.jpg"
                }
            ],
            shipping: {
                method: "express",
                cost: 50000,
                trackingNumber: "TRK123456789",
                estimatedDelivery: "2024-03-22",
                actualDelivery: "2024-03-22T16:45:00Z"
            },
            payment: {
                method: "online",
                status: "paid",
                transactionId: "TRX987654321",
                amount: 3700000,
                date: "2024-03-21T14:32:00Z"
            },
            address: {
                fullName: "علی محمدی",
                phone: "09123456780",
                province: "تهران",
                city: "تهران",
                postalCode: "1234567890",
                address: "خیابان انقلاب، پلاک 123، واحد 4"
            },
            subtotal: 4100000,
            discount: 400000,
            shippingCost: 50000,
            total: 3750000,
            notes: "لطفا قبل از تحویل تماس بگیرید"
        }
    ],

    // ==================== سبد خرید (Cart) ====================
    carts: [
        {
            userId: 2,
            items: [
                {
                    productId: 1,
                    name: "Nike Air Max 270",
                    color: "black",
                    size: 42,
                    quantity: 1,
                    price: 3200000,
                    image: "img/products/airmax/black-1.jpg",
                    addedAt: "2024-03-21T10:15:00Z"
                }
            ],
            lastUpdated: "2024-03-21T10:15:00Z"
        }
    ],

    // ==================== علاقه‌مندی‌ها (Wishlist) ====================
    wishlists: [
        {
            userId: 2,
            items: [
                {
                    productId: 2,
                    name: "Nike Jordan 1",
                    price: 4500000,
                    image: "img/products/jordan/red-1.jpg",
                    addedAt: "2024-03-20T15:30:00Z"
                }
            ]
        }
    ],

    // ==================== نظرات (Reviews) ====================
    reviews: [
        {
            id: 1,
            productId: 1,
            userId: 2,
            rating: 5,
            title: "کفش فوق‌العاده!",
            comment: "بسیار راحت و سبک. برای دویدن عالیه.",
            pros: ["راحت", "سبک", "کیفیت ساخت خوب"],
            cons: ["قیمت بالایی دارد"],
            verifiedPurchase: true,
            helpful: 24,
            notHelpful: 2,
            createdAt: "2024-02-15T09:20:00Z"
        }
    ],

    // ==================== دسته‌بندی‌ها (Categories) ====================
    categories: [
        {
            id: 1,
            name: "کفش دویدن",
            slug: "running",
            image: "img/categories/running.jpg",
            subcategories: ["مردانه", "زنانه", "کودک"],
            productCount: 45
        },
        {
            id: 2,
            name: "بسکتبال",
            slug: "basketball",
            image: "img/categories/basketball.jpg",
            productCount: 23
        }
    ],

    // ==================== کوپن‌ها (Coupons) ====================
    coupons: [
        {
            code: "NIKE10",
            discount: 10,
            type: "percentage", // percentage یا fixed
            minPurchase: 1000000,
            maxDiscount: 500000,
            validFrom: "2024-01-01",
            validTo: "2024-12-31",
            usageLimit: 1000,
            usedCount: 245,
            isActive: true
        },
        {
            code: "WELCOME20",
            discount: 20,
            type: "percentage",
            minPurchase: 0,
            validFrom: "2024-01-01",
            validTo: "2024-12-31",
            usageLimit: 100,
            usedCount: 45,
            isActive: true,
            forNewUsers: true
        }
    ],

    // ==================== تنظیمات سایت (Settings) ====================
    settings: {
        siteName: "Nike Store",
        currency: "تومان",
        currencySymbol: "﷼",
        taxRate: 9,
        shippingMethods: [
            {
                id: 1,
                name: "پیک موتوری",
                cost: 50000,
                estimatedDays: "1-2",
                description: "تحویل در تهران و حومه"
            },
            {
                id: 2,
                name: "پست پیشتاز",
                cost: 30000,
                estimatedDays: "3-5",
                description: "تحویل به سراسر کشور"
            }
        ],
        contactInfo: {
            phone: "021-12345678",
            email: "info@nike-store.com",
            address: "تهران، خیابان ولیعصر",
            workingHours: "9:00 تا 21:00",
            socialMedia: {
                instagram: "@nikestore",
                telegram: "@nikestore",
                twitter: "@nikestore"
            }
        }
    },

    // ==================== متدهای کمکی ====================
    methods: {
        // ذخیره در localStorage
        saveToLocalStorage() {
            Object.keys(this).forEach(key => {
                if (key !== 'methods') {
                    localStorage.setItem(key, JSON.stringify(this[key]));
                }
            });
        },

        // بارگذاری از localStorage
        loadFromLocalStorage() {
            Object.keys(this).forEach(key => {
                if (key !== 'methods') {
                    const data = localStorage.getItem(key);
                    if (data) {
                        this[key] = JSON.parse(data);
                    }
                }
            });
        },

        // ایجاد کاربر جدید
        createUser(userData) {
            const newUser = {
                id: this.users.length + 1,
                ...userData,
                createdAt: new Date().toISOString(),
                status: "active",
                role: userData.role || "customer",
                loyaltyPoints: 0,
                totalSpent: 0,
                membershipLevel: "bronze"
            };
            
            this.users.push(newUser);
            this.saveToLocalStorage();
            return newUser;
        },

        // یافتن کاربر با ایمیل
        findUserByEmail(email) {
            return this.users.find(user => user.email === email);
        },

        // یافتن کاربر با ID
        findUserById(id) {
            return this.users.find(user => user.id === id);
        },

        // ایجاد سفارش جدید
        createOrder(orderData) {
            const order = {
                id: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                date: new Date().toISOString(),
                status: "pending",
                ...orderData
            };
            
            this.orders.push(order);
            this.saveToLocalStorage();
            return order;
        },

        // اضافه کردن به سبد خرید
        addToCart(userId, product) {
            let userCart = this.carts.find(cart => cart.userId === userId);
            
            if (!userCart) {
                userCart = {
                    userId,
                    items: [],
                    lastUpdated: new Date().toISOString()
                };
                this.carts.push(userCart);
            }
            
            // بررسی وجود محصول در سبد
            const existingItem = userCart.items.find(item => 
                item.productId === product.productId && 
                item.color === product.color && 
                item.size === product.size
            );
            
            if (existingItem) {
                existingItem.quantity += product.quantity;
            } else {
                userCart.items.push({
                    ...product,
                    addedAt: new Date().toISOString()
                });
            }
            
            userCart.lastUpdated = new Date().toISOString();
            this.saveToLocalStorage();
        },

        // اعتبارسنجی کوپن
        validateCoupon(code, userId) {
            const coupon = this.coupons.find(c => c.code === code && c.isActive);
            
            if (!coupon) {
                return { valid: false, message: "کد تخفیف معتبر نیست" };
            }
            
            // بررسی تاریخ انقضا
            const now = new Date();
            const validFrom = new Date(coupon.validFrom);
            const validTo = new Date(coupon.validTo);
            
            if (now < validFrom || now > validTo) {
                return { valid: false, message: "کد تخفیف منقضی شده است" };
            }
            
            // بررسی سقف استفاده
            if (coupon.usedCount >= coupon.usageLimit) {
                return { valid: false, message: "سقف استفاده از این کد تخفیف به پایان رسیده است" };
            }
            
            // بررسی کاربران جدید
            if (coupon.forNewUsers) {
                const user = this.findUserById(userId);
                const userOrders = this.orders.filter(order => order.userId === userId);
                if (userOrders.length > 0) {
                    return { valid: false, message: "این کد فقط برای اولین خرید قابل استفاده است" };
                }
            }
            
            return { 
                valid: true, 
                coupon,
                message: "کد تخفیف معتبر است" 
            };
        },

        // محاسبه امتیاز وفاداری
        calculateLoyaltyPoints(amount) {
            // هر 1000 تومان = 1 امتیاز
            return Math.floor(amount / 1000);
        },

        // آپدیت سطح عضویت
        updateMembershipLevel(userId) {
            const user = this.findUserById(userId);
            if (!user) return;
            
            const totalSpent = user.totalSpent;
            
            if (totalSpent >= 10000000) {
                user.membershipLevel = "platinum";
            } else if (totalSpent >= 5000000) {
                user.membershipLevel = "gold";
            } else if (totalSpent >= 2000000) {
                user.membershipLevel = "silver";
            } else {
                user.membershipLevel = "bronze";
            }
            
            this.saveToLocalStorage();
        },

        // دریافت آدرس پیش‌فرض کاربر
        getDefaultAddress(userId) {
            const user = this.findUserById(userId);
            if (!user || !user.addresses) return null;
            
            return user.addresses.find(addr => addr.isDefault) || user.addresses[0];
        },

        // فرمت قیمت
        formatPrice(price) {
            return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
        },

        // تولید داده‌های نمونه (برای توسعه)
        generateSampleData() {
            // فقط اگر داده‌ای در localStorage نیست
            if (!localStorage.getItem('users')) {
                this.saveToLocalStorage();
                console.log('داده‌های نمونه ایجاد شدند');
            }
        }
    }
};

// بارگذاری اولیه داده‌ها
AppData.methods.loadFromLocalStorage();

// ایجاد داده‌های نمونه اگر نیاز بود
AppData.methods.generateSampleData();

// صادر کردن برای استفاده در فایل‌های دیگر
window.AppData = AppData;
// data.js - انتهای فایل

// ==================== راه‌اندازی اولیه ====================
(function initData() {
    // فقط اگر داده‌ای وجود ندارد، داده‌های نمونه ایجاد کن
    if (!localStorage.getItem('users') || 
        !localStorage.getItem('products') || 
        !localStorage.getItem('categories')) {
        
        console.log('🔧 ایجاد داده‌های نمونه...');
        AppData.methods.saveToLocalStorage();
        console.log('✅ داده‌های نمونه با موفقیت ایجاد شدند');
        console.log('📊 اطلاعات ایجاد شده:');
        console.log(`   👥 کاربران: ${AppData.users.length} کاربر`);
        console.log(`   🛍️ محصولات: ${AppData.products.length} محصول`);
        console.log(`   📦 دسته‌بندی‌ها: ${AppData.categories.length} دسته`);
        console.log(`   💳 کوپن‌ها: ${AppData.coupons.length} کوپن تخفیف`);
        console.log('👨‍💼 اطلاعات ورود به سیستم:');
        console.log('   مدیر: admin@nike.com / admin123');
        console.log('   کاربر: ali.mohammadi@email.com / ali123456');
    } else {
        console.log('📁 داده‌ها از قبل وجود دارند');
    }
})();
// بررسی لاگین بودن کاربر
if (AuthManager.isLoggedIn()) {
    // کاربر لاگین کرده
    console.log('کاربر:', AuthManager.currentUser.name);
}

// ایجاد سفارش جدید
const newOrder = AppData.methods.createOrder({
    userId: AuthManager.currentUser.id,
    items: cartItems,
    // ... سایر اطلاعات
});
// استفاده از bcrypt یا مشابه
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
// برای ارتباط با سرور
const token = jwt.sign(
    { userId: user.id, role: user.role },
    'secret-key',
    { expiresIn: '24h' }
);
// هرگز به داده‌های کاربر اعتماد نکنید
function validateUserInput(input) {
    // اعتبارسنجی XSS
    // اعتبارسنجی SQL Injection
    // اعتبارسنجی طول و فرمت
}