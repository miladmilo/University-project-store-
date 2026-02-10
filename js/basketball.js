
const products = [
    {
        id: 1,
        name: "LAL KIT",
        category: "running",
        price: 3200000,
        image: "src/img/basketball/LAL+MNK+DF+SWGMN+JSY+ICN+22.avif",
        sizes: [38, 39, 40, 41, 42, 43],
        rating: 5,
        description: "Official shirt"
    },
    {
        id: 2,
        name: "Nike MIL",
        category: "basketball",
        price: 2500000,
        image: "src/img/basketball/MIL+MNK+DF+SWGMN+JSY+CE+25.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 3,
        name: "Nike SABRINA",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/SABRINA+3+EP (1).avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 4,
        name: "Nike FLARE",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/NIKE+S.T.+FLARE+EP (1).avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 5,
        name: "Nike SWGMN",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/LAL+MNK+DF+SWGMN+SHORT+ICN+18.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 6,
        name: "Nike SABRINA",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/SABRINA+3+EP (2).avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 7,
        name: "Nike FLARE",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/NIKE+S.T.+FLARE+EP (2).avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 8,
        name: "Nike SABRINA",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/SABRINA+3+EP.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 9,
        name: "Nike MNK",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/SAS+MNK+DF+SWGMN+JSY+ICN+22.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 10,
        name: "Nike JORDAN",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/JORDAN+TATUM+4+PF.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 11,
        name: "Nike SWGMN",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/CHA+MNK+DF+SWGMN+JSY+ICN+22.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 12,
        name: "Nike JORDAN",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/GSW+MNK+DF+SWGMN+JSY+ASC+22.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 5,
        description: "sport"
    },
    {
        id: 13,
        name: "Nike JORDAN",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/AIR+JORDAN+40+PF (2).avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4.8,
        description: "sport"
    },
    {
        id: 14,
        name: "Nike JORDAN",
        category: "basketball",
        price: 4500000,
        image: "src/img/basketball/AIR+JORDAN+40+PF.avif",
        sizes: [40, 41, 42, 43, 44],
        rating: 4,
        description: "sport"
    },

    // 10 محصول دیگر اضافه کنید
];

class ProductManager {
    constructor() {
        this.filteredProducts = [...products];
        this.currentFilters = {
            categories: ['running', 'basketball', 'lifestyle', 'training'],
            priceRange: '0-500000',
            sizes: []
        };
        this.init();
    }
    
    init() {
        this.renderProducts();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // فیلتر دسته‌بندی
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateCategoryFilter());
        });
        
        // فیلتر قیمت
        document.querySelectorAll('.price-filter').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentFilters.priceRange = e.target.value;
                this.filterProducts();
            });
        });
        
        // فیلتر سایز
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                this.toggleSizeFilter(size);
                e.target.classList.toggle('bg-black');
                e.target.classList.toggle('text-white');
            });
        });
        
        // مرتب‌سازی
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });
        
        // اعمال فیلترها
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.filterProducts();
        });
        
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });
    }
    
    updateCategoryFilter() {
        const checkedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(cb => cb.value);
        this.currentFilters.categories = checkedCategories;
    }
    
    toggleSizeFilter(size) {
        const index = this.currentFilters.sizes.indexOf(size);
        if (index === -1) {
            this.currentFilters.sizes.push(size);
        } else {
            this.currentFilters.sizes.splice(index, 1);
        }
    }
    
    filterProducts() {
        this.filteredProducts = products.filter(product => {
            // فیلتر دسته‌بندی
            if (!this.currentFilters.categories.includes(product.category)) {
                return false;
            }
            
            // فیلتر قیمت
            const [min, max] = this.currentFilters.priceRange.split('-').map(Number);
            if (product.price < min || (max && product.price > max)) {
                return false;
            }
            
            // فیلتر سایز
            if (this.currentFilters.sizes.length > 0) {
                const hasSize = this.currentFilters.sizes.some(size => 
                    product.sizes.includes(parseInt(size))
                );
                if (!hasSize) return false;
            }
            
            return true;
        });
        
        this.renderProducts();
    }
    
    sortProducts(criteria) {
        switch(criteria) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default: // newest
                this.filteredProducts.sort((a, b) => b.id - a.id);
        }
        this.renderProducts();
    }
    
    clearFilters() {
        document.querySelectorAll('.category-filter').forEach(cb => cb.checked = true);
        document.querySelectorAll('.price-filter')[0].checked = true;
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('bg-black', 'text-white');
        });
        
        this.currentFilters = {
            categories: ['running', 'basketball', 'lifestyle', 'training'],
            priceRange: '0-500000',
            sizes: []
        };
        
        this.filteredProducts = [...products];
        this.renderProducts();
    }
    
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const count = document.getElementById('productCount');
        
        count.textContent = this.filteredProducts.length;
        
        grid.innerHTML = this.filteredProducts.map(product => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="relative">
                    <img src="${product.image}" class="w-full h-80 object-cover" alt="${product.name}">
                    <button class="wishlist-btn absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50" data-id="${product.id}">
                        <i class="far fa-heart text-gray-600"></i>
                    </button>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg">${product.name}</h3>
                        <span class="text-lg font-bold">${this.formatPrice(product.price)}</span>
                    </div>
                    <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                    <div class="flex items-center mb-4">
                        <div class="text-yellow-400 mr-2">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                        </div>
                        <span class="text-gray-600 text-sm">(${product.rating})</span>
                    </div>
                    <div class="flex space-x-2 mb-4">
                        ${product.sizes.map(size => `
                            <span class="text-xs border px-2 py-1 rounded">${size}</span>
                        `).join('')}
                    </div>
                    <button class="add-to-cart w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors" 
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image}"
                            data-category="${product.category}">
                       Add to cart
                    </button>
                </div>
            </div>
        `).join('');
        
        // اضافه کردن event listener برای دکمه‌های افزودن به سبد خرید
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseInt(e.target.dataset.price),
                    image: e.target.dataset.image,
                    category: e.target.dataset.category
                };
                cart.addItem(product);
            });
        });
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-IR').format(price) + ' ' + 'T';
    }
}

// راه‌اندازی مدیر محصولات
const productManager = new ProductManager();
// در صفحات محصولات

// در هر صفحه
const cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log(`تعداد محصولات: ${cart.length}`);



