// init-login.js - تست و رفع اشکال لاگین
function setupLoginTest() {
    console.log('🔧 راه‌اندازی تست لاگین...');
    
    // بررسی localStorage
    console.log('📁 بررسی localStorage:');
    console.log('   users:', localStorage.getItem('users'));
    console.log('   currentUser:', localStorage.getItem('currentUser'));
    
    // ایجاد کاربر تست اگر وجود ندارد
    if (!localStorage.getItem('users')) {
        console.log('👤 ایجاد کاربر تست...');
        
        const testUsers = [
            {
                id: 1,
                email: "admin@nike.com",
                password: "admin123",
                name: "مدیر سیستم",
                role: "admin",
                status: "active"
            },
            {
                id: 2,
                email: "user@test.com",
                password: "user123",
                name: "کاربر تست",
                role: "customer",
                status: "active"
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(testUsers));
        console.log('✅ کاربران تست ایجاد شدند');
        console.log('   ایمیل: admin@nike.com');
        console.log('   رمز: admin123');
        console.log('   یا');
        console.log('   ایمیل: user@test.com');
        console.log('   رمز: user123');
    }
    
    // اضافه کردن دکمه تست در صفحه
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const testButton = document.createElement('button');
        testButton.id = 'loginTestBtn';
        testButton.innerHTML = '🛠️ تست لاگین';
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #667eea;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
        `;
        
        testButton.onclick = function() {
            console.clear();
            console.log('🧪 شروع تست لاگین...');
            
            // لاگین با کاربر تست
            const users = JSON.parse(localStorage.getItem('users'));
            if (users && users[0]) {
                const authManager = window.AuthManager;
                if (authManager) {
                    authManager.login(users[0]);
                } else {
                    console.error('AuthManager موجود نیست');
                }
            }
        };
        
        document.body.appendChild(testButton);
    }
}

// اجرای تست
document.addEventListener('DOMContentLoaded', setupLoginTest);