// 
        let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "SCRIPT CREATE PANEL JASTEB",
        category: "script",
        price: 10000,
        qris: "https://files.catbox.moe/jibvsz.jpg",
        features: ["Bisa Create sepuasnya", "Bisa Open Jasteb", "Open Marga", "Bisa Open Founder", "Bisa Open Team Ress", "Bisa di Jual Kembali", "Dll"],
        highlight: "",
        files: [
            {
                name: "Murbug-Telegram-Premium.zip",
                size: 18500, // 18.5 KB
                type: "application/zip"
            }
        ]
    },
    {
        id: 2,
        name: "SC CREATE PANEL JASTEB 4 TAMPILAN",
        category: "script",
        price: 30000,
        qris: "https://files.catbox.moe/jibvsz.jpg",
        features: ["Bisa Create Panel 4 Tampilan", "Tampilan webp", "tampilan Atur Ress", "Tampilan Atur Menit", "Bisa Open Marga", "Dll"],
        highlight: "POPULAR",
        files: [
            {
                name: "SC-REXUS-Premium.zip",
                size: 24500, // 24.5 KB
                type: "application/zip"
            }
        ]
    },
    {
        id: 3,
        name: "SCRIPT CREATE PANEL WEBP 3 TAMPILAN",
        category: "script",
        price: 28000,
        qris: "https://files.catbox.moe/jibvsz.jpg",
        features: ["Bisa Create Panel 3 Tampilan", "bisa create sepuasnya", "tampilan Atur Ress", "Tampilan Atur Menit", "Bisa Open Marga", "Dll"],
        highlight: "",
        files: [
            {
                name: "Reseller-Panel-Access.zip",
                size: 15800, // 15.8 KB
                type: "application/zip"
            }
        ]
    },
    {
        id: 3,
        name: "SCRIPT ADDCURL",
        category: "script",
        price: 10000,
        qris: "https://files.catbox.moe/jibvsz.jpg",
        features: ["Script ini khusus konek ke Webp", "Bisa Jual Kembali", "Bisa Open Jasteb", "Bisa Jual Ress", "Bisa Open Marga", "Dll"],
        highlight: "",
        files: [
            {
                name: "Reseller-Panel-Access.zip",
                size: 15800, // 15.8 KB
                type: "application/zip"
            }
        ]
    },
    {
        id: 3,
        name: "SCRIPT ADDCURL HAPUS APII",
        category: "script",
        price: 20000,
        qris: "https://files.catbox.moe/jibvsz.jpg",
        features: ["Script ini sama seperti di atas", "Jika kalian Tidak Senang Sama Buyer panel kalian bisa di hapus api", "Bisa Open Jasteb", "Bisa Jual Ress", "Bisa Open Marga", "Dll"],
        highlight: "",
        files: [
            {
                name: "Reseller-Panel-Access.zip",
                size: 2000, // 15.8 KB
                type: "application/zip"
            }
        ]
    },
    {
        id: 3,
        name: "SCRIPT ADDCURLXAUTORESS",
        category: "script",
        price: 15000,
        qris: "https://files.catbox.moe/jibvsz.jpg",
        features: ["Script Ini bisa langsung konekin untuk nebar ress", "Bisa Tap Tap Ress Jika Kalian tidak mau Nebar", "Script ini Spesial", "Script Ini Bisa Di Jual Kembali", "Bisa Open Marga", "Dll"],
        highlight: "",
        files: [
            {
                name: "Reseller-Panel-Access.zip",
                size: 15800, // 15.8 KB
                type: "application/zip"
            }
        ]
    }
];

// Data pengguna
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: 1,
        name: "RamzzNotDev",
        username: "ramzz",
        email: "admin@digitalshop.com",
        password: "ramzz1",
        isAdmin: true
    },
    {
        id: 2,
        name: "User Demo",
        username: "demo",
        email: "user@demo.com",
        password: "demo123",
        isAdmin: false
    }
];

// Data pesanan
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Data file
let productFiles = JSON.parse(localStorage.getItem('productFiles')) || {};

// Status aplikasi
let currentOrder = null;
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let editingProductId = null;
let selectedProductId = null;
let selectedFile = null;
let paymentProofFile = null;
let currentProofOrder = null;

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Set tema
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Simpan data ke localStorage jika belum ada
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    if (!localStorage.getItem('productFiles')) {
        localStorage.setItem('productFiles', JSON.stringify(productFiles));
    }
    
    // Render produk di halaman utama
    if (document.getElementById('product-grid')) {
        renderProducts();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Periksa status login
    checkLoginStatus();
    
    // Jika di halaman dashboard, render dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        renderDashboard();
    }
});

// Fungsi untuk merender produk di halaman utama
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        productCard.setAttribute('data-name', product.name.toLowerCase());
        
        let highlightHtml = '';
        if (product.highlight) {
            highlightHtml = `<span class="highlight">${product.highlight}</span>`;
        }
        
        let featuresHtml = '';
        product.features.forEach(feature => {
            featuresHtml += `<li><i class="fas fa-check-circle"></i> ${feature}</li>`;
        });
        
        // Cek apakah user sudah login untuk mengaktifkan tombol order
        const isLoggedIn = currentUser !== null;
        const buttonHtml = isLoggedIn ? 
            `<button class="order-button" data-id="${product.id}" data-product="${product.name}" data-price="${product.price}" data-qris="${product.qris}">
                <i class="fas fa-shopping-cart"></i> Beli Sekarang
            </button>` :
            `<button class="order-button" onclick="showLoginModal()"><i class="fas fa-lock"></i> Login untuk Membeli</button>`;
        
        productCard.innerHTML = `
            ${highlightHtml}
            <div class="product-header">
                <h3>${product.name}</h3>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
            </div>
            <div class="product-body">
                <ul class="product-features">
                    ${featuresHtml}
                </ul>
            </div>
            <div class="product-footer">
                ${buttonHtml}
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Setup event listeners untuk tombol order
    setupOrderButtons();
    
    // Setup event listeners untuk kategori
    setupCategoryButtons();
}

// Fungsi untuk setup event listeners
function setupEventListeners() {
    // Toggle menu hamburger
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            }
        });
    }
    
    // Tombol login di menu
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    
    // Tombol daftar di menu
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
    
    // Tombol logout di navigasi
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    // Submit login
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', function() {
            loginUser();
        });
    }
    
    // Submit register
    const registerSubmitBtn = document.getElementById('register-submit-btn');
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', function() {
            registerUser();
        });
    }
    
    // Tombol tutup modal
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePaymentModal);
    }
    
    // Tombol batalkan pembayaran
    const cancelPaymentBtn = document.getElementById('cancel-payment');
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', closePaymentModal);
    }
    
    // Tombol konfirmasi pembayaran
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', confirmPayment);
    }
    
    // Pencarian produk
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Toggle tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Klik di luar modal untuk menutup
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('payment-modal');
        if (modal && e.target === modal) {
            closePaymentModal();
        }
        
        // Tutup menu hamburger jika diklik di luarnya
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu && e.target !== hamburger && !hamburger.contains(e.target) && e.target !== navMenu && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Tutup menu hamburger saat item menu diklik
    document.querySelectorAll('.nav-link').forEach(item => {
        item.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// Fungsi untuk setup tombol kategori
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update tampilan tombol kategori
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter produk
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Fungsi untuk setup tombol order
function setupOrderButtons() {
    const orderButtons = document.querySelectorAll('.order-button:not(:disabled)');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = this.getAttribute('data-product');
            const price = parseInt(this.getAttribute('data-price'));
            const qrisUrl = this.getAttribute('data-qris');
            
            openPaymentModal(product, price, qrisUrl);
        });
    });
}

// Fungsi untuk login user
function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showNotification('Harap isi username dan password', 'error');
        return;
    }
    
    // Cari user berdasarkan username atau email
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (user) {
        currentUser = {
            id: user.id,
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIAfterLogin();
        
        showNotification('Login berhasil!', 'success');
        
        // Redirect ke halaman utama setelah login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showNotification('Username atau password salah', 'error');
    }
    
    // Reset form
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

// Fungsi untuk register user
function registerUser() {
    // Validasi form
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    if (!name || !email || !username || !password) {
        showNotification('Harap isi semua field', 'error');
        return;
    }
    
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Format email tidak valid', 'error');
        return;
    }
    
    // Cek apakah username atau email sudah terdaftar
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
        showNotification('Username atau email sudah terdaftar', 'error');
        return;
    }
    
    // Tambahkan user baru
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newUserId,
        name: name,
        username: username,
        email: email,
        password: password,
        isAdmin: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login setelah register
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        isAdmin: newUser.isAdmin
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIAfterLogin();
    
    showNotification('Pendaftaran berhasil! Anda sudah login.', 'success');
    
    // Redirect ke halaman utama setelah register
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
    
    // Reset form
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
}

// Fungsi untuk logout user
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIAfterLogout();
    showNotification('Logout berhasil!', 'success');
    
    // Redirect ke halaman utama setelah logout
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Fungsi untuk update UI setelah login
function updateUIAfterLogin() {
    const authButtons = document.getElementById('auth-buttons');
    const userNav = document.getElementById('user-nav');
    
    if (currentUser && authButtons && userNav) {
        authButtons.style.display = 'none';
        userNav.style.display = 'flex';
    }
}

// Fungsi untuk update UI setelah logout
function updateUIAfterLogout() {
    const authButtons = document.getElementById('auth-buttons');
    const userNav = document.getElementById('user-nav');
    
    if (authButtons && userNav) {
        authButtons.style.display = 'flex';
        userNav.style.display = 'none';
    }
}

// Fungsi untuk merender dashboard
function renderDashboard() {
    if (!currentUser) {
        // Redirect ke halaman login jika belum login
        window.location.href = 'login.html';
        return;
    }
    
    // Update judul dashboard
    const dashboardTitle = document.getElementById('dashboard-title');
    const dashboardContentTitle = document.getElementById('dashboard-content-title');
    
    if (dashboardTitle) {
        dashboardTitle.textContent = currentUser.isAdmin ? 'Dashboard Admin' : 'Dashboard Member';
    }
    
    if (dashboardContentTitle) {
        dashboardContentTitle.textContent = currentUser.isAdmin ? 'Semua Pesanan' : 'Pesanan Saya';
    }
    
    // Tampilkan section admin jika user adalah admin
    const adminOrdersSection = document.getElementById('admin-orders-section');
    const fileManagementSection = document.getElementById('file-management-section');
    const userManagementSection = document.getElementById('user-management-section');
    const productManagementSection = document.getElementById('product-management-section');
    
    if (adminOrdersSection) {
        adminOrdersSection.style.display = currentUser.isAdmin ? 'block' : 'none';
    }
    
    if (fileManagementSection) {
        fileManagementSection.style.display = currentUser.isAdmin ? 'block' : 'none';
    }
    
    if (userManagementSection) {
        userManagementSection.style.display = currentUser.isAdmin ? 'block' : 'none';
    }
    
    if (productManagementSection) {
        productManagementSection.style.display = currentUser.isAdmin ? 'block' : 'none';
    }
    
    // Render statistik
    renderDashboardStats();
    
    // Render daftar pesanan
    renderOrders();
    
    // Render daftar pesanan untuk admin
    if (currentUser.isAdmin) {
        renderAdminOrders();
        renderUserTable();
        renderProductTable();
        renderProductSelect();
        renderProductFiles();
    }
}

// Fungsi untuk merender statistik dashboard
function renderDashboardStats() {
    const dashboardStats = document.getElementById('dashboard-stats');
    if (!dashboardStats) return;
    
    let statsHtml = '';
    
    if (currentUser.isAdmin) {
        // Statistik untuk admin
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const totalRevenue = orders.filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + order.price, 0);
        
        statsHtml = `
            <div class="stat-card">
                <i class="fas fa-shopping-cart"></i>
                <h3>Total Pesanan</h3>
                <div class="stat-value">${totalOrders}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <h3>Menunggu Verifikasi</h3>
                <div class="stat-value">${pendingOrders}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-check-circle"></i>
                <h3>Pesanan Selesai</h3>
                <div class="stat-value">${completedOrders}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-money-bill-wave"></i>
                <h3>Total Pendapatan</h3>
                <div class="stat-value">Rp ${totalRevenue.toLocaleString('id-ID')}</div>
            </div>
        `;
    } else {
        // Statistik untuk member
        const userOrders = orders.filter(o => o.userId === currentUser.id);
        const totalOrders = userOrders.length;
        const pendingOrders = userOrders.filter(o => o.status === 'pending').length;
        const completedOrders = userOrders.filter(o => o.status === 'completed').length;
        
        statsHtml = `
            <div class="stat-card">
                <i class="fas fa-shopping-cart"></i>
                <h3>Total Pesanan</h3>
                <div class="stat-value">${totalOrders}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <h3>Menunggu Verifikasi</h3>
                <div class="stat-value">${pendingOrders}</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-check-circle"></i>
                <h3>Pesanan Selesai</h3>
                <div class="stat-value">${completedOrders}</div>
            </div>
        `;
    }
    
    dashboardStats.innerHTML = statsHtml;
}

// Fungsi untuk merender daftar pesanan
function renderOrders() {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;
    
    let userOrders = currentUser.isAdmin ? orders : orders.filter(o => o.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        orderList.innerHTML = `
            <div class="no-orders" style="text-align: center; padding: 2rem;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Tidak ada pesanan</p>
            </div>
        `;
        return;
    }
    
    // Urutkan pesanan berdasarkan tanggal (yang terbaru pertama)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    let ordersHtml = '';
    userOrders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const statusClass = `order-status status-${order.status}`;
        let statusText = '';
        
        switch(order.status) {
            case 'pending':
                statusText = 'Menunggu Verifikasi';
                break;
            case 'completed':
                statusText = 'Selesai';
                break;
            case 'cancelled':
                statusText = 'Dibatalkan';
                break;
            default:
                statusText = order.status;
        }
        
        // Tombol download hanya muncul jika status completed dan ada file
        const downloadButton = order.status === 'completed' && productFiles[order.productId] && productFiles[order.productId].length > 0 ? 
            `<button class="order-action action-download" data-order-id="${order.id}" data-product-id="${order.productId}" data-product-name="${order.productName}">
                <i class="fas fa-download"></i> Download
            </button>` : '';
        
        ordersHtml += `
            <li class="order-item">
                <div class="order-info">
                    <h4><i class="fas fa-box"></i> ${order.productName}</h4>
                    <p>Rp ${order.price.toLocaleString('id-ID')} • ${orderDate}</p>
                    <p>Status: <span class="${statusClass}">${statusText}</span></p>
                </div>
                <div class="order-actions">
                    ${downloadButton}
                </div>
            </li>
        `;
    });
    
    orderList.innerHTML = ordersHtml;
    
    // Setup event listeners untuk tombol aksi
    setupOrderActionButtons();
}

// Fungsi untuk merender daftar pesanan admin
function renderAdminOrders() {
    const adminOrderList = document.getElementById('admin-order-list');
    if (!adminOrderList) return;
    
    // Ambil hanya pesanan yang menunggu verifikasi
    const pendingOrders = orders.filter(o => o.status === 'pending');
    
    if (pendingOrders.length === 0) {
        adminOrderList.innerHTML = `
            <div class="no-orders" style="text-align: center; padding: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Tidak ada pesanan yang menunggu verifikasi</p>
            </div>
        `;
        return;
    }
    
    // Urutkan pesanan berdasarkan tanggal (yang terbaru pertama)
    pendingOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    let ordersHtml = '';
    pendingOrders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        ordersHtml += `
            <li class="order-item">
                <div class="order-info">
                    <h4><i class="fas fa-box"></i> ${order.productName}</h4>
                    <p>Rp ${order.price.toLocaleString('id-ID')} • ${orderDate}</p>
                    <p>Customer: ${order.customerName} (${order.customerWA})</p>
                </div>
                <div class="order-actions">
                    <button class="order-action action-view" data-order-id="${order.id}">
                        <i class="fas fa-eye"></i> Lihat Bukti
                    </button>
                </div>
            </li>
        `;
    });
    
    adminOrderList.innerHTML = ordersHtml;
    
    // Setup event listeners untuk tombol aksi
    setupAdminOrderActionButtons();
}

// Fungsi untuk merender select produk
function renderProductSelect() {
    const fileProductSelect = document.getElementById('file-product');
    if (!fileProductSelect) return;
    
    let options = '<option value="">-- Pilih Produk --</option>';
    
    products.forEach(product => {
        options += `<option value="${product.id}">${product.name}</option>`;
    });
    
    fileProductSelect.innerHTML = options;
}

// Fungsi untuk merender daftar file produk
function renderProductFiles() {
    const productFileList = document.getElementById('product-file-list');
    if (!productFileList) return;
    
    if (!selectedProductId) {
        productFileList.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-file" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Pilih produk untuk melihat file</p>
            </div>
        `;
        return;
    }
    
    const files = productFiles[selectedProductId] || [];
    
    if (files.length === 0) {
        productFileList.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-file" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Tidak ada file untuk produk ini</p>
            </div>
        `;
        return;
    }
    
    let filesHtml = '';
    files.forEach((file, index) => {
        filesHtml += `
            <li class="file-item">
                <div class="file-info">
                    <i class="fas fa-file-archive file-icon"></i>
                    <span class="file-name">${file.name}</span>
                </div>
                <div class="file-actions">
                    <button class="order-action action-view" data-product-id="${selectedProductId}" data-file-index="${index}">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="order-action action-reject" data-product-id="${selectedProductId}" data-file-index="${index}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </li>
        `;
    });
    
    productFileList.innerHTML = filesHtml;
    
    // Setup event listeners untuk tombol aksi file
    setupFileActionButtons();
}

// Fungsi untuk merender tabel pengguna
function renderUserTable() {
    const userTableContainer = document.getElementById('user-table-container');
    if (!userTableContainer) return;
    
    if (users.length === 0) {
        userTableContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary;">Tidak ada pengguna</p>
            </div>
        `;
        return;
    }
    
    let userTableHtml = `
        <table class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        userTableHtml += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="user-role ${user.isAdmin ? 'role-admin' : 'role-user'}">${user.isAdmin ? 'Admin' : 'User'}</span></td>
            </tr>
        `;
    });
    
    userTableHtml += `
            </tbody>
        </table>
    `;
    
    userTableContainer.innerHTML = userTableHtml;
}

// Fungsi untuk merender tabel produk
function renderProductTable() {
    const productTableContainer = document.getElementById('product-table-container');
    if (!productTableContainer) return;
    
    if (products.length === 0) {
        productTableContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Tidak ada produk</p>
            </div>
        `;
        return;
    }
    
    let productTableHtml = `
        <table class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Harga</th>
                    <th>Kategori</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    products.forEach(product => {
        productTableHtml += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>Rp ${product.price.toLocaleString('id-ID')}</td>
                <td>${product.category}</td>
                <td>
                    <button class="order-action action-view" data-product-id="${product.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="order-action action-reject" data-product-id="${product.id}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    });
    
    productTableHtml += `
        </tbody>
    </table>
    `;
    
    productTableContainer.innerHTML = productTableHtml;
    
    // Setup event listeners untuk tombol aksi
    setupProductActionButtons();
}

// Fungsi untuk setup tombol aksi pesanan
function setupOrderActionButtons() {
    const downloadButtons = document.querySelectorAll('.action-download');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const productName = this.getAttribute('data-product-name');
            showDownloadModal(productId, productName);
        });
    });
}

// Fungsi untuk setup tombol aksi pesanan admin
function setupAdminOrderActionButtons() {
    const viewButtons = document.querySelectorAll('.action-view[data-order-id]');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            viewOrderProof(orderId);
        });
    });
}

// Fungsi untuk setup tombol aksi produk
function setupProductActionButtons() {
    const editButtons = document.querySelectorAll('.action-view[data-product-id]');
    const deleteButtons = document.querySelectorAll('.action-reject[data-product-id]');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            editProduct(productId);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            deleteProduct(productId);
        });
    });
}

// Fungsi untuk setup tombol aksi file
function setupFileActionButtons() {
    const downloadButtons = document.querySelectorAll('.action-view[data-file-index]');
    const deleteButtons = document.querySelectorAll('.action-reject[data-file-index]');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const fileIndex = parseInt(this.getAttribute('data-file-index'));
            downloadProductFile(productId, fileIndex);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const fileIndex = parseInt(this.getAttribute('data-file-index'));
            deleteProductFile(productId, fileIndex);
        });
    });
}

// Fungsi untuk melihat bukti pembayaran
function viewOrderProof(orderId) {
    const order = orders.find(o => o.id === orderId);
    
    if (order && order.proof) {
        currentProofOrder = order;
        
        // Tampilkan gambar bukti pembayaran
        document.getElementById('proof-modal-image').src = order.proof;
        
        // Isi detail pesanan
        const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('proof-modal-details').innerHTML = `
            <p><strong>Produk:</strong> <span>${order.productName}</span></p>
            <p><strong>Harga:</strong> <span>Rp ${order.price.toLocaleString('id-ID')}</span></p>
            <p><strong>Tanggal:</strong> <span>${orderDate}</span></p>
            <p><strong>Customer:</strong> <span>${order.customerName}</span></p>
            <p><strong>WhatsApp:</strong> <span>${order.customerWA}</span></p>
        `;
        
        // Tampilkan modal
        showModal(document.getElementById('proof-modal'));
    } else {
        showNotification('Bukti pembayaran tidak ditemukan', 'error');
    }
}

// Fungsi untuk menyetujui pembayaran
function approvePayment() {
    if (currentProofOrder) {
        // Update status pesanan
        const orderIndex = orders.findIndex(o => o.id === currentProofOrder.id);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'completed';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Perbarui tampilan
            renderOrders();
            renderAdminOrders();
            renderDashboardStats();
            
            showNotification('Pembayaran berhasil disetujui!', 'success');
            hideModal(document.getElementById('proof-modal'));
        }
    }
}

// Fungsi untuk menolak pembayaran
function rejectPayment() {
    if (currentProofOrder) {
        // Update status pesanan
        const orderIndex = orders.findIndex(o => o.id === currentProofOrder.id);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Perbarui tampilan
            renderOrders();
            renderAdminOrders();
            renderDashboardStats();
            
            showNotification('Pembayaran ditolak!', 'success');
            hideModal(document.getElementById('proof-modal'));
        }
    }
}

// Fungsi untuk edit produk
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        editingProductId = productId;
        document.getElementById('product-modal-title').textContent = 'Edit Produk';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-features').value = product.features.join(', ');
        document.getElementById('product-qris').value = product.qris;
        document.getElementById('product-highlight').value = product.highlight || '';
        
        showModal(document.getElementById('product-modal'));
    }
}

// Fungsi untuk menghapus produk
function deleteProduct(productId) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            localStorage.setItem('products', JSON.stringify(products));
            
            // Perbarui tampilan
            renderProductTable();
            renderProducts();
            renderProductSelect();
            
            showNotification('Produk berhasil dihapus', 'success');
        }
    }
}

// Fungsi untuk mengunggah file produk
function uploadProductFile() {
    if (!selectedProductId) {
        showNotification('Pilih produk terlebih dahulu', 'error');
        return;
    }
    
    if (!selectedFile) {
        showNotification('Pilih file terlebih dahulu', 'error');
        return;
    }
    
    // Tampilkan progress bar
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (uploadProgress && progressFill && progressText) {
        uploadProgress.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
    }
    
    // Simulasi proses upload
    let progress = 0;
    const interval = setInterval(function() {
        progress += 5;
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Simpan file
            if (!productFiles[selectedProductId]) {
                productFiles[selectedProductId] = [];
            }
            
            const fileName = selectedFile.name;
            const fileSize = Math.round(selectedFile.size / 1024); // KB
            
            productFiles[selectedProductId].push({
                name: fileName,
                size: fileSize,
                uploadedAt: new Date().toISOString(),
                url: `https://toko-ramzz-website.vercel.app/files/${fileName}`
            });
            
            localStorage.setItem('productFiles', JSON.stringify(productFiles));
            
            // Reset form
            const productFileUpload = document.getElementById('product-file-upload');
            const uploadedProductFileContainer = document.getElementById('uploaded-product-file-container');
            
            if (productFileUpload && uploadedProductFileContainer) {
                productFileUpload.value = '';
                uploadedProductFileContainer.style.display = 'none';
            }
            
            selectedFile = null;
            
            // Sembunyikan progress bar
            setTimeout(() => {
                if (uploadProgress) {
                    uploadProgress.style.display = 'none';
                }
            }, 1000);
            
            // Perbarui daftar file
            renderProductFiles();
            
            showNotification('File berhasil diunggah', 'success');
        }
    }, 100);
}

// Fungsi untuk menghapus file produk
function deleteProductFile(productId, fileIndex) {
    if (confirm('Apakah Anda yakin ingin menghapus file ini?')) {
        productFiles[productId].splice(fileIndex, 1);
        localStorage.setItem('productFiles', JSON.stringify(productFiles));
        
        // Perbarui daftar file
        renderProductFiles();
        
        showNotification('File berhasil dihapus', 'success');
    }
}

// Fungsi untuk menampilkan modal download
function showDownloadModal(productId, productName) {
    const files = productFiles[productId] || [];
    
    if (files.length === 0) {
        showNotification('Tidak ada file untuk produk ini', 'error');
        return;
    }
    
    document.getElementById('download-product-name').textContent = productName;
    
    let filesHtml = '';
    files.forEach((file, index) => {
        filesHtml += `
            <div class="file-item">
                <div class="file-info">
                    <i class="fas fa-file-archive file-icon"></i>
                    <span class="file-name">${file.name} (${file.size} KB)</span>
                </div>
                <div class="file-actions">
                    <button class="order-action action-download" data-product-id="${productId}" data-file-index="${index}">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <a href="${file.url || `https://produk-ramzzhost.vercel.app/files/${file.name}`}" 
                       class="order-action action-view" 
                       target="_blank" 
                       style="text-decoration: none;">
                        <i class="fas fa-external-link-alt"></i> Lihat Detail
                    </a>
                </div>
            </div>
        `;
    });
    
    document.getElementById('download-file-list').innerHTML = filesHtml;
    
    // Setup event listeners untuk tombol download
    const downloadButtons = document.querySelectorAll('#download-file-list .action-download');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const fileIndex = parseInt(this.getAttribute('data-file-index'));
            downloadProductFile(productId, fileIndex);
        });
    });
    
    showModal(document.getElementById('download-modal'));
}

// Fungsi untuk mendownload file produk
function downloadProductFile(productId, fileIndex) {
    const files = productFiles[productId] || [];
    
    if (files.length > fileIndex) {
        const file = files[fileIndex];
        
        // Simulasi download
        showNotification(`Mempersiapkan download ${file.name}`, 'success');
        
        // Gunakan URL eksternal untuk download
        const fileUrl = file.url || `https://produk-ramzzhost.vercel.app/files/${file.name}`;
        
        // Buat link download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.name;
        link.target = '_blank'; // Buka di tab baru
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Tampilkan notifikasi
        setTimeout(() => {
            showNotification('Download dimulai! Jika tidak otomatis, cek tab baru browser Anda.', 'success');
        }, 500);
    } else {
        showNotification('File tidak ditemukan', 'error');
    }
}

// Fungsi untuk menyimpan produk
function saveProduct() {
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const features = document.getElementById('product-features').value.split(',').map(f => f.trim());
    const qris = document.getElementById('product-qris').value;
    const highlight = document.getElementById('product-highlight').value;
    
    if (!name || !price || !category || features.length === 0 || !qris) {
        showNotification('Harap isi semua field yang wajib', 'error');
        return;
    }
    
    if (editingProductId !== null) {
        // Edit produk yang sudah ada
        const productIndex = products.findIndex(p => p.id === editingProductId);
        
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name: name,
                price: price,
                category: category,
                features: features,
                qris: qris,
                highlight: highlight
            };
            
            showNotification('Produk berhasil diperbarui', 'success');
        }
    } else {
        // Tambah produk baru
        const newProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newProductId,
            name: name,
            price: price,
            category: category,
            features: features,
            qris: qris,
            highlight: highlight,
            files: []
        };
        
        products.push(newProduct);
        showNotification('Produk berhasil ditambahkan', 'success');
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    hideModal(document.getElementById('product-modal'));
    resetProductForm();
    
    // Perbarui tampilan
    renderProductTable();
    renderProducts();
    renderProductSelect();
}

// Fungsi untuk reset form produk
function resetProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-category').value = 'sc';
    document.getElementById('product-features').value = '';
    document.getElementById('product-qris').value = '';
    document.getElementById('product-highlight').value = '';
    document.getElementById('product-image-upload').value = '';
    document.getElementById('uploaded-file-container').style.display = 'none';
    
    editingProductId = null;
}

// Fungsi untuk memeriksa status login
function checkLoginStatus() {
    if (currentUser) {
        updateUIAfterLogin();
    } else {
        updateUIAfterLogout();
    }
}

// Fungsi untuk mencari produk
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productName = card.getAttribute('data-name');
        if (productName.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Fungsi untuk membuka modal pembayaran
function openPaymentModal(product, price, qrisUrl) {
    currentOrder = {
        product: product,
        price: price,
        qrisUrl: qrisUrl
    };
    
    document.getElementById('modal-product-name').textContent = product;
    document.getElementById('modal-product-price').textContent = formatRupiah(price);
    document.getElementById('qris-image').src = qrisUrl;
    
    // Reset form
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-wa').value = '';
    document.getElementById('payment-proof').value = '';
    document.getElementById('proof-preview').style.display = 'none';
    paymentProofFile = null;
    
    showModal(document.getElementById('payment-modal'));
}

// Fungsi untuk menutup modal pembayaran
function closePaymentModal() {
    hideModal(document.getElementById('payment-modal'));
    currentOrder = null;
}

// Fungsi untuk konfirmasi pembayaran
function confirmPayment() {
    const name = document.getElementById('customer-name').value;
    const waNumber = document.getElementById('customer-wa').value;
    
    if (!name || !waNumber) {
        showNotification('Harap isi nama dan nomor WhatsApp', 'error');
        return;
    }
    
    if (!paymentProofFile) {
        showNotification('Harap unggah bukti pembayaran', 'error');
        return;
    }
    
    // Buat pesanan baru
    const newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const product = products.find(p => p.name === currentOrder.product);
    
    // Simpan bukti pembayaran (dalam implementasi nyata, ini akan diunggah ke server)
    const proofReader = new FileReader();
    proofReader.onload = function(event) {
        const newOrder = {
            id: newOrderId,
            userId: currentUser.id,
            productId: product ? product.id : 0,
            productName: currentOrder.product,
            price: currentOrder.price,
            customerName: name,
            customerWA: waNumber,
            note: "",
            status: 'pending', // Status awal adalah pending menunggu verifikasi admin
            proof: event.target.result, // Simpan sebagai data URL
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Format pesan WhatsApp
        const message = `Halo, saya *${name}* sudah melakukan pembayaran untuk produk:\n\n` +
                        `*Produk:* ${currentOrder.product}\n` +
                        `*Harga:* ${formatRupiah(currentOrder.price)}\n\n` +
                        `Silakan verifikasi pembayaran saya. Terima kasih.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/6283862592489?text=${encodedMessage}`;
        
        // Buka WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Tutup modal
        closePaymentModal();
        
        showNotification('Pembayaran berhasil dikonfirmasi! Menunggu verifikasi admin.', 'success');
    };
    proofReader.readAsDataURL(paymentProofFile);
}

// Format harga ke Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk menampilkan modal dengan animasi
function showModal(modalElement) {
    if (!modalElement) return;
    
    modalElement.style.display = 'flex';
    setTimeout(() => {
        modalElement.classList.add('show');
    }, 10);
}

// Fungsi untuk menyembunyikan modal dengan animasi
function hideModal(modalElement) {
    if (!modalElement) return;
    
    modalElement.classList.remove('show');
    setTimeout(() => {
        modalElement.style.display = 'none';
    }, 300);
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fungsi untuk toggle tema
function toggleTheme() {
    if (currentTheme === 'dark') {
        currentTheme = 'light';
    } else {
        currentTheme = 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Fungsi untuk menampilkan modal login
function showLoginModal() {
    window.location.href = 'login.html';
}

// Animasi scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .feature-card, .hero h1, .hero p').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
