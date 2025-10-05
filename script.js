// Global data storage
let data = {
    transactions: [],
    products: [],
    sales: [],
    invoices: []
};

let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultUser();
    checkAuth();
    initializeAuthForms();
    initializeNavigation();
    initializeForms();
    updateAllDisplays();
    setDefaultDates();
});

// Initialize default user
function initializeDefaultUser() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if default user already exists
    const defaultUserExists = users.find(u => u.email === 'mateo@gmail.com');
    
    if (!defaultUserExists) {
        const defaultUser = {
            id: 1,
            name: 'Mateo',
            email: 'mateo@gmail.com',
            password: '12345n',
            business: 'Mi Negocio',
            createdAt: new Date().toISOString(),
            isDefault: true
        };
        
        users.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        // Update existing user with correct password
        const userIndex = users.findIndex(u => u.email === 'mateo@gmail.com');
        if (userIndex !== -1) {
            users[userIndex].password = '12345n';
            users[userIndex].isDefault = true;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Authentication functions
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showMainApp();
    } else {
        showAuthPage();
    }
}

function showAuthPage() {
    document.getElementById('authPage').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
    loadData();
}

function switchAuth(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (type === 'register') {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    } else {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

function initializeAuthForms() {
    // Login form
    document.getElementById('loginFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });

    // Register form
    document.getElementById('registerFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validaciones
    if (!email) {
        showError('Por favor ingresa tu correo electrónico');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Por favor ingresa un correo electrónico válido');
        return;
    }
    
    if (!password) {
        showError('Por favor ingresa tu contraseña');
        return;
    }
    
    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMainApp();
        showSuccess('¡Bienvenido de vuelta!');
    } else {
        showError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
}

function register() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const business = document.getElementById('registerBusiness').value.trim();
    
    // Validaciones
    if (!name) {
        showError('Por favor ingresa tu nombre completo');
        return;
    }
    
    if (name.length < 2) {
        showError('El nombre debe tener al menos 2 caracteres');
        return;
    }
    
    if (!email) {
        showError('Por favor ingresa tu correo electrónico');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Por favor ingresa un correo electrónico válido');
        return;
    }
    
    if (!password) {
        showError('Por favor ingresa una contraseña');
        return;
    }
    
    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (!confirmPassword) {
        showError('Por favor confirma tu contraseña');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    if (!business) {
        showError('Por favor ingresa el nombre de tu negocio');
        return;
    }
    
    if (business.length < 2) {
        showError('El nombre del negocio debe tener al menos 2 caracteres');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showError('Ya existe una cuenta con este correo electrónico');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        business,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Don't automatically log in, redirect to login instead
    showSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');
    
    // Switch to login form
    setTimeout(() => {
        switchAuth('login');
        // Clear the register form
        document.getElementById('registerFormElement').reset();
        // Pre-fill the login form with the new user's email
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').value = '';
        
        // Show success message for login
        setTimeout(() => {
            showSuccess('Email pre-cargado. Ingresa tu contraseña para continuar.');
        }, 500);
    }, 2000);
}

// Funciones de utilidad para validación
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Crear o actualizar mensaje de error
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.className = 'error-message';
        document.querySelector('.auth-forms').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    // Crear o actualizar mensaje de éxito
    let successDiv = document.getElementById('successMessage');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'successMessage';
        successDiv.className = 'success-message';
        document.querySelector('.auth-forms').appendChild(successDiv);
    }
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}


function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthPage();
    // Clear forms
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
}

// Navigation functionality
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const modules = document.querySelectorAll('.module');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetModule = this.getAttribute('data-module');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target module
            modules.forEach(module => module.classList.remove('active'));
            document.getElementById(targetModule).classList.add('active');
        });
    });

    // Add click handlers to pain point cards
    const painPointCards = document.querySelectorAll('.pain-point-card');
    painPointCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetModule = this.getAttribute('data-module');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-module="${targetModule}"]`).classList.add('active');
            
            // Show target module
            modules.forEach(module => module.classList.remove('active'));
            document.getElementById(targetModule).classList.add('active');
        });
    });
}

// Form initialization
function initializeForms() {
    // Income form
    document.getElementById('incomeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTransaction('income');
    });

    // Expense form
    document.getElementById('expenseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTransaction('expense');
    });

    // Product form
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });

    // Sale form
    document.getElementById('saleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addSale();
    });

    // Invoice form
    document.getElementById('invoiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addInvoice();
    });

    // Modal close functionality
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Data persistence
function saveData() {
    if (currentUser) {
        localStorage.setItem(`bcpFinancialData_${currentUser.id}`, JSON.stringify(data));
    }
}

function loadData() {
    if (currentUser) {
        const savedData = localStorage.getItem(`bcpFinancialData_${currentUser.id}`);
        if (savedData) {
            data = JSON.parse(savedData);
        } else {
            // Initialize empty data for new user
            data = {
                transactions: [],
                products: [],
                sales: [],
                invoices: []
            };
        }
    }
}

// Transaction management
function addTransaction(type) {
    const form = document.getElementById(type === 'income' ? 'incomeForm' : 'expenseForm');
    const formData = new FormData(form);
    
    const transaction = {
        id: Date.now(),
        type: type,
        description: document.getElementById(type === 'income' ? 'incomeDescription' : 'expenseDescription').value,
        amount: parseFloat(document.getElementById(type === 'income' ? 'incomeAmount' : 'expenseAmount').value),
        date: document.getElementById(type === 'income' ? 'incomeDate' : 'expenseDate').value
    };

    data.transactions.push(transaction);
    saveData();
    updateAllDisplays();
    form.reset();
    closeModal(type === 'income' ? 'incomeModal' : 'expenseModal');
}

// Product management
function addProduct() {
    const purchasePrice = parseFloat(document.getElementById('productPurchasePrice').value);
    const salePrice = parseFloat(document.getElementById('productSalePrice').value);
    const margin = salePrice - purchasePrice;
    const marginPercentage = ((margin / purchasePrice) * 100).toFixed(1);

    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        stock: parseInt(document.getElementById('productStock').value),
        purchasePrice: purchasePrice,
        salePrice: salePrice,
        margin: margin,
        marginPercentage: marginPercentage,
        minStock: parseInt(document.getElementById('productMinStock').value),
        lastSale: null
    };

    data.products.push(product);
    saveData();
    updateAllDisplays();
    document.getElementById('productForm').reset();
    closeModal('productModal');
    showSuccess('Producto agregado exitosamente');
}

// Sale management
function addSale() {
    const productId = parseInt(document.getElementById('saleProduct').value);
    const quantity = parseInt(document.getElementById('saleQuantity').value);
    const date = document.getElementById('saleDate').value;

    const product = data.products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock < quantity) {
        showError('No hay suficiente stock disponible');
        return;
    }

    // Update product stock
    product.stock -= quantity;
    product.lastSale = date;

    // Add sale record
    const sale = {
        id: Date.now(),
        productId: productId,
        productName: product.name,
        quantity: quantity,
        price: product.salePrice,
        total: quantity * product.salePrice,
        date: date
    };

    data.sales.push(sale);

    // Add income transaction
    const incomeTransaction = {
        id: Date.now() + 1,
        type: 'income',
        description: `Venta: ${product.name} (${quantity} unidades)`,
        amount: sale.total,
        date: date
    };

    data.transactions.push(incomeTransaction);

    saveData();
    updateAllDisplays();
    document.getElementById('saleForm').reset();
    closeModal('saleModal');
    showSuccess(`Venta registrada: ${quantity} unidades de ${product.name}`);
    
    // Check for low stock alert
    checkLowStockAlert(product);
}

// Invoice management
function addInvoice() {
    const invoiceType = document.getElementById('invoiceType').value;
    const prefix = invoiceType === 'ticket' ? 'TKT' : 'FAC';
    
    const invoice = {
        id: Date.now(),
        number: prefix + '-' + String(Date.now()).slice(-6),
        client: document.getElementById('invoiceClient').value,
        amount: parseFloat(document.getElementById('invoiceAmount').value),
        description: document.getElementById('invoiceDescription').value,
        date: document.getElementById('invoiceDate').value,
        type: invoiceType,
        status: 'Emitida'
    };

    data.invoices.push(invoice);

    // Add income transaction
    const incomeTransaction = {
        id: Date.now() + 1,
        type: 'income',
        description: `${invoiceType === 'ticket' ? 'Ticket' : 'Factura'} ${invoice.number}: ${invoice.client}`,
        amount: invoice.amount,
        date: invoice.date
    };

    data.transactions.push(incomeTransaction);

    saveData();
    updateAllDisplays();
    document.getElementById('invoiceForm').reset();
    closeModal('invoiceModal');
    
    // Show ticket/invoice
    showTicket(invoice);
}

// Show ticket/invoice
function showTicket(invoice) {
    const ticketContent = document.getElementById('ticketContent');
    const currentDate = new Date().toLocaleString('es-ES');
    
    ticketContent.innerHTML = `
        <div style="text-align: center; border: 2px solid #333; padding: 20px; background: white; color: black;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${currentUser.business || 'Mi Negocio'}</h3>
            <p style="margin: 0 0 15px 0; font-size: 0.9rem;">${invoice.type === 'ticket' ? 'TICKET DE VENTA' : 'FACTURA'}</p>
            <hr style="border: 1px solid #333; margin: 10px 0;">
            <div style="text-align: left;">
                <p><strong>Número:</strong> ${invoice.number}</p>
                <p><strong>Fecha:</strong> ${formatDate(invoice.date)}</p>
                <p><strong>Cliente:</strong> ${invoice.client}</p>
                <p><strong>Descripción:</strong> ${invoice.description}</p>
                <hr style="border: 1px solid #333; margin: 10px 0;">
                <p style="text-align: right; font-size: 1.2rem; font-weight: bold;">
                    <strong>TOTAL: $${invoice.amount.toLocaleString()}</strong>
                </p>
            </div>
            <hr style="border: 1px solid #333; margin: 15px 0 10px 0;">
            <p style="font-size: 0.8rem; margin: 0;">Gracias por su compra</p>
        </div>
    `;
    
    document.getElementById('ticketDisplayModal').style.display = 'block';
}

// Print ticket
function printTicket() {
    const ticketContent = document.getElementById('ticketContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Imprimir ${data.invoices[data.invoices.length - 1]?.type === 'ticket' ? 'Ticket' : 'Factura'}</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                </style>
            </head>
            <body>
                ${ticketContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Check low stock alert
function checkLowStockAlert(product) {
    if (product.stock <= product.minStock) {
        showError(`⚠️ ALERTA: El producto "${product.name}" está a punto de acabarse. Stock actual: ${product.stock}`);
    }
}

// Update low stock alerts
function updateLowStockAlerts() {
    const criticalProducts = data.products.filter(p => p.stock <= p.minStock);
    
    if (criticalProducts.length > 0) {
        const alertMessages = criticalProducts.map(p => 
            `"${p.name}" (${p.stock} unidades restantes)`
        ).join(', ');
        
        showError(`⚠️ ALERTA DE STOCK BAJO: ${alertMessages}`);
    }
}

// Display updates
function updateAllDisplays() {
    updateFinancialDisplay();
    updateInventoryDisplay();
    updateInvoicesDisplay();
    updateCreditsDisplay();
    updateProductSelect();
}

function updateFinancialDisplay() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = data.transactions.filter(t => t.date.startsWith(currentMonth));
    
    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    document.getElementById('monthly-income').textContent = `$${income.toLocaleString()}`;
    document.getElementById('monthly-expenses').textContent = `$${expenses.toLocaleString()}`;
    document.getElementById('balance').textContent = `$${balance.toLocaleString()}`;
    document.getElementById('balance').className = `value ${balance >= 0 ? 'positive' : 'negative'}`;

    // Update alerts
    const alertsContainer = document.getElementById('financial-alerts');
    alertsContainer.innerHTML = '';
    
    if (balance < 0) {
        alertsContainer.innerHTML = `
            <div class="alert negative">
                <i class="fas fa-exclamation-triangle"></i>
                Flujo de caja negativo: $${Math.abs(balance).toLocaleString()}
            </div>
        `;
    } else {
        alertsContainer.innerHTML = `
            <div class="alert positive">
                <i class="fas fa-check-circle"></i>
                Flujo de caja positivo
            </div>
        `;
    }

    // Update transactions table
    updateTransactionsTable();
    updateCashFlowChart();
}

function updateTransactionsTable() {
    const tbody = document.getElementById('transactionsBody');
    tbody.innerHTML = '';

    const sortedTransactions = data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTransactions.slice(0, 10).forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td><span class="badge ${transaction.type === 'income' ? 'positive' : 'negative'}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td>
            <td class="${transaction.type === 'income' ? 'positive' : 'negative'}">$${transaction.amount.toLocaleString()}</td>
            <td>
                <button class="btn btn-small" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateCashFlowChart() {
    const canvas = document.getElementById('cashFlowChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get last 7 days of data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().slice(0, 10));
    }
    
    const dailyData = last7Days.map(date => {
        const dayTransactions = data.transactions.filter(t => t.date === date);
        const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { date, income, expenses, balance: income - expenses };
    });
    
    // Draw simple bar chart
    const maxValue = Math.max(...dailyData.map(d => Math.max(d.income, d.expenses)));
    const barWidth = canvas.width / dailyData.length * 0.8;
    const barSpacing = canvas.width / dailyData.length;
    
    dailyData.forEach((day, index) => {
        const x = index * barSpacing + barSpacing * 0.1;
        const incomeHeight = (day.income / maxValue) * (canvas.height - 40);
        const expenseHeight = (day.expenses / maxValue) * (canvas.height - 40);
        
        // Draw income bar
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(x, canvas.height - 20 - incomeHeight, barWidth * 0.4, incomeHeight);
        
        // Draw expense bar
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + barWidth * 0.5, canvas.height - 20 - expenseHeight, barWidth * 0.4, expenseHeight);
    });
}

function updateInventoryDisplay() {
    const totalProducts = data.products.length;
    const criticalProducts = data.products.filter(p => p.stock <= p.minStock);
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('critical-products').textContent = criticalProducts.length;
    
    // Update alerts
    const alertsContainer = document.getElementById('inventory-alerts');
    alertsContainer.innerHTML = '';
    
    if (criticalProducts.length > 0) {
        const alertMessages = criticalProducts.map(p => 
            `${p.name} (${p.stock} unidades)`
        ).join(', ');
        
        alertsContainer.innerHTML = `
            <div class="alert warning">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Stock crítico:</strong> ${alertMessages}
            </div>
        `;
    } else {
        alertsContainer.innerHTML = `
            <div class="alert info">
                <i class="fas fa-info-circle"></i>
                No hay alertas de stock
            </div>
        `;
    }
    
    // Update top products
    updateTopProducts();
    updateInventoryTable();
}

function updateTopProducts() {
    const topProductsContainer = document.getElementById('top-products');
    
    if (data.sales.length === 0) {
        topProductsContainer.innerHTML = '<p>No hay datos de ventas</p>';
        return;
    }
    
    // Calculate sales by product
    const productSales = {};
    data.sales.forEach(sale => {
        if (!productSales[sale.productName]) {
            productSales[sale.productName] = { quantity: 0, revenue: 0 };
        }
        productSales[sale.productName].quantity += sale.quantity;
        productSales[sale.productName].revenue += sale.total;
    });
    
    // Sort by quantity sold
    const sortedProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b.quantity - a.quantity)
        .slice(0, 3);
    
    if (sortedProducts.length === 0) {
        topProductsContainer.innerHTML = '<p>No hay datos de ventas</p>';
        return;
    }
    
    topProductsContainer.innerHTML = sortedProducts.map(([name, data]) => `
        <div class="product-item">
            <strong>${name}</strong><br>
            <small>${data.quantity} unidades vendidas</small>
        </div>
    `).join('');
}

function updateInventoryTable() {
    const tbody = document.getElementById('inventoryBody');
    tbody.innerHTML = '';
    
    data.products.forEach(product => {
        const row = document.createElement('tr');
        const isCritical = product.stock <= product.minStock;
        const marginClass = product.margin > 0 ? 'positive' : 'negative';
        
        row.innerHTML = `
            <td>${product.name}</td>
            <td class="${isCritical ? 'critical' : ''}">${product.stock}</td>
            <td>$${product.purchasePrice.toLocaleString()}</td>
            <td>$${product.salePrice.toLocaleString()}</td>
            <td class="${marginClass}">$${product.margin.toLocaleString()} (${product.marginPercentage}%)</td>
            <td>${product.lastSale ? formatDate(product.lastSale) : 'Nunca'}</td>
            <td>
                <button class="btn btn-small" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-small" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateInvoicesDisplay() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyInvoices = data.invoices.filter(i => i.date.startsWith(currentMonth));
    const totalInvoiced = monthlyInvoices.reduce((sum, i) => sum + i.amount, 0);
    
    document.getElementById('invoices-issued').textContent = monthlyInvoices.length;
    document.getElementById('total-invoiced').textContent = `$${totalInvoiced.toLocaleString()}`;
    
    updateInvoicesTable();
}

function updateInvoicesTable() {
    const tbody = document.getElementById('invoicesBody');
    tbody.innerHTML = '';
    
    const sortedInvoices = data.invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedInvoices.slice(0, 10).forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.number}</td>
            <td>${invoice.client}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>$${invoice.amount.toLocaleString()}</td>
            <td><span class="badge positive">${invoice.status}</span></td>
            <td>
                <button class="btn btn-small" onclick="downloadInvoice(${invoice.id})">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-small" onclick="deleteInvoice(${invoice.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateCreditsDisplay() {
    // Calculate financial score
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = data.transactions.filter(t => t.date.startsWith(currentMonth));
    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    // Simple scoring algorithm
    let score = 50; // Base score
    if (balance > 0) score += 25;
    if (income > 0) score += 15;
    if (data.transactions.length > 10) score += 10;
    
    score = Math.min(100, Math.max(0, score));
    
    document.getElementById('financial-score').textContent = score;
    document.getElementById('positive-flow').textContent = balance > 0 ? 'Sí' : 'No';
    document.getElementById('payments-current').textContent = 'Sí'; // Simplified
}

function updateProductSelect() {
    const select = document.getElementById('saleProduct');
    select.innerHTML = '<option value="">Seleccionar producto</option>';
    
    data.products.forEach(product => {
        if (product.stock > 0) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Stock: ${product.stock})`;
            select.appendChild(option);
        }
    });
}

// Utility functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function setDefaultDates() {
    const today = new Date().toISOString().slice(0, 10);
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = today;
    });
}

// Delete functions
function deleteTransaction(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
        data.transactions = data.transactions.filter(t => t.id !== id);
        saveData();
        updateAllDisplays();
    }
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        data.products = data.products.filter(p => p.id !== id);
        saveData();
        updateAllDisplays();
    }
}

function deleteInvoice(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
        data.invoices = data.invoices.filter(i => i.id !== id);
        saveData();
        updateAllDisplays();
    }
}

// Edit functions
function editProduct(id) {
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    
    const newName = prompt('Nuevo nombre:', product.name);
    const newPurchasePrice = prompt('Nuevo precio de compra:', product.purchasePrice);
    const newSalePrice = prompt('Nuevo precio de venta:', product.salePrice);
    const newMinStock = prompt('Nuevo stock mínimo:', product.minStock);
    
    if (newName && newPurchasePrice && newSalePrice && newMinStock) {
        const purchasePrice = parseFloat(newPurchasePrice);
        const salePrice = parseFloat(newSalePrice);
        const margin = salePrice - purchasePrice;
        const marginPercentage = ((margin / purchasePrice) * 100).toFixed(1);
        
        product.name = newName;
        product.purchasePrice = purchasePrice;
        product.salePrice = salePrice;
        product.margin = margin;
        product.marginPercentage = marginPercentage;
        product.minStock = parseInt(newMinStock);
        
        saveData();
        updateAllDisplays();
        showSuccess('Producto actualizado exitosamente');
    }
}

// Report generation
function generateBankReport() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = data.transactions.filter(t => t.date.startsWith(currentMonth));
    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    const report = `
REPORTE FINANCIERO - ${new Date().toLocaleDateString('es-ES')}

RESUMEN DEL MES:
- Ingresos: $${income.toLocaleString()}
- Gastos: $${expenses.toLocaleString()}
- Balance: $${balance.toLocaleString()}

TRANSACCIONES:
${monthlyTransactions.map(t => 
    `${t.date} - ${t.type === 'income' ? 'Ingreso' : 'Gasto'}: ${t.description} - $${t.amount.toLocaleString()}`
).join('\n')}

PRODUCTOS EN INVENTARIO: ${data.products.length}
FACTURAS EMITIDAS: ${data.invoices.filter(i => i.date.startsWith(currentMonth)).length}
    `;
    
    // Create and download file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_financiero_${currentMonth}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateReport(type) {
    if (type === 'income-statement') {
        generateBankReport();
    } else if (type === 'cash-flow') {
        generateBankReport();
    }
}

function downloadInvoice(id) {
    const invoice = data.invoices.find(i => i.id === id);
    if (!invoice) return;
    
    const invoiceContent = `
FACTURA ${invoice.number}
Cliente: ${invoice.client}
Fecha: ${formatDate(invoice.date)}
Descripción: ${invoice.description}
Monto: $${invoice.amount.toLocaleString()}
Estado: ${invoice.status}
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${invoice.number}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Tutorial functions
function openTutorial(tutorialType) {
    const tutorials = {
        'sales': {
            title: 'Cómo Registrar Ventas',
            content: `
                <h3>Paso a paso para registrar ventas:</h3>
                <ol>
                    <li>Ve al módulo "Inventarios y Ventas"</li>
                    <li>Haz clic en "Registrar Venta"</li>
                    <li>Selecciona el producto que vendiste</li>
                    <li>Ingresa la cantidad vendida</li>
                    <li>Confirma la fecha de la venta</li>
                    <li>Haz clic en "Registrar Venta"</li>
                </ol>
                <p><strong>Tip:</strong> El sistema automáticamente actualizará el stock y registrará el ingreso.</p>
            `
        },
        'inventory': {
            title: 'Cómo Optimizar Inventario',
            content: `
                <h3>Estrategias para un inventario eficiente:</h3>
                <ul>
                    <li><strong>Stock mínimo:</strong> Establece un nivel mínimo para cada producto</li>
                    <li><strong>Rotación:</strong> Prioriza productos que se venden más rápido</li>
                    <li><strong>Alertas:</strong> Revisa regularmente las alertas de stock crítico</li>
                    <li><strong>Análisis:</strong> Usa el reporte de productos más vendidos</li>
                </ul>
                <p><strong>Beneficio:</strong> Evita pérdidas por productos vencidos y mejora el flujo de caja.</p>
            `
        },
        'invoicing': {
            title: 'Facturación Básica',
            content: `
                <h3>Guía para emitir facturas:</h3>
                <ol>
                    <li>Ve al módulo "Facturación"</li>
                    <li>Haz clic en "Generar Factura PDF"</li>
                    <li>Completa los datos del cliente</li>
                    <li>Ingresa el monto y descripción</li>
                    <li>Confirma la fecha</li>
                    <li>Descarga la factura generada</li>
                </ol>
                <p><strong>Importante:</strong> Guarda una copia de todas las facturas emitidas.</p>
            `
        },
        'financial': {
            title: 'Educación Financiera Básica',
            content: `
                <h3>Conceptos fundamentales:</h3>
                <ul>
                    <li><strong>Flujo de caja:</strong> Dinero que entra y sale de tu negocio</li>
                    <li><strong>Ingresos:</strong> Todo el dinero que recibes por ventas</li>
                    <li><strong>Gastos:</strong> Todo lo que gastas para operar</li>
                    <li><strong>Balance:</strong> Diferencia entre ingresos y gastos</li>
                </ul>
                <p><strong>Meta:</strong> Mantener un balance positivo para crecer tu negocio.</p>
            `
        }
    };
    
    const tutorial = tutorials[tutorialType];
    if (tutorial) {
        showTutorialModal(tutorial.title, tutorial.content);
    }
}

function showTutorialModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>${title}</h2>
            <div class="tutorial-content">
                ${content}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Update tutorial buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to tutorial buttons
    setTimeout(() => {
        const tutorialButtons = document.querySelectorAll('.tutorial-card .btn');
        tutorialButtons.forEach((btn, index) => {
            const tutorials = ['sales', 'inventory', 'invoicing', 'financial'];
            if (tutorials[index]) {
                btn.onclick = () => openTutorial(tutorials[index]);
            }
        });
    }, 1000);
});

// Add CSS for badges and tutorial content
const style = document.createElement('style');
style.textContent = `
    .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    .badge.positive {
        background: #d4edda;
        color: #155724;
    }
    .badge.negative {
        background: #f8d7da;
        color: #721c24;
    }
    .product-item {
        padding: 8px 0;
        border-bottom: 1px solid #ecf0f1;
    }
    .product-item:last-child {
        border-bottom: none;
    }
    .tutorial-content {
        line-height: 1.6;
        color: #e2e8f0;
    }
    .tutorial-content h3 {
        color: #63b3ed;
        margin: 15px 0 10px 0;
    }
    .tutorial-content ol, .tutorial-content ul {
        margin: 10px 0;
        padding-left: 20px;
    }
    .tutorial-content li {
        margin: 5px 0;
    }
    .tutorial-content strong {
        color: #90cdf4;
    }
`;
document.head.appendChild(style);
