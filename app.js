/* ==========================================================================
   INCOME TRACK - MAIN APPLICATION ENGINE
   ========================================================================== */

// --- Default Data Configuration ---
const DEFAULT_PRODUCTS = {
    vegetables: [
        { id: 'tomato', tamil: 'தக்காளி', english: 'Tomato', price: 70, unit: 'kg' },
        { id: 'big_onion', tamil: 'பெரிய வெங்காயம்', english: 'Big Onion', price: 60, unit: 'kg' },
        { id: 'small_onion', tamil: 'சின்ன வெங்காயம்', english: 'Small Onion', price: 50, unit: 'kg' },
        { id: 'potato', tamil: 'உருளைக்கிழங்கு', english: 'Potato', price: 45, unit: 'kg' },
        { id: 'ladies_finger', tamil: 'வெண்டைக்காய்', english: 'Ladies Finger', price: 25, unit: 'kg' },
        { id: 'white_brinjal', tamil: 'வெள்ளை கத்தரிக்காய்', english: 'White Brinjal', price: null, unit: 'kg' },
        { id: 'black_brinjal', tamil: 'கருப்பு கத்தரிக்காய்', english: 'Black Brinjal', price: null, unit: 'kg' },
        { id: 'drumstick', tamil: 'முருங்கைக்காய்', english: 'Drumstick', price: 60, unit: 'kg' },
        { id: 'green_chilli', tamil: 'பச்சை மிளகாய்', english: 'Green Chilli', price: 10, unit: 'kg' },
        { id: 'carrot', tamil: 'கேரட்', english: 'Carrot', price: 55, unit: 'kg' },
        { id: 'beans', tamil: 'பீன்ஸ்', english: 'Beans', price: 40, unit: 'kg' },
        { id: 'cabbage', tamil: 'முட்டைக்கோஸ்', english: 'Cabbage', price: null, unit: 'kg' },
        { id: 'cauliflower', tamil: 'காலிபிளவர்', english: 'Cauliflower', price: null, unit: 'kg' },
        { id: 'beetroot', tamil: 'பீட்ரூட்', english: 'Beetroot', price: 40, unit: 'kg' }
    ],
    bananas: [
        { id: 'red_banana', tamil: 'செவ்வாழை', english: 'Red Banana', price: 100, unit: 'kg' },
        { id: 'karpooravalli', tamil: 'கற்பூரவள்ளி', english: 'Karpooravalli', price: 60, unit: 'kg' },
        { id: 'rasthali', tamil: 'ரஸ்தாளி', english: 'Rasthali', price: 80, unit: 'kg' },
        { id: 'poovan', tamil: 'பூவன்', english: 'Poovan', price: 50, unit: 'kg' },
        { id: 'yelakki', tamil: 'ஏலக்கி', english: 'Yelakki', price: 90, unit: 'kg' }
    ]
};

// --- Application State ---
let state = {
    customers: [],
    purchases: [],
    prices: {},
    activeView: 'dashboard',
    editingPurchaseId: null
};

// --- Firebase Cloud Sync Integration ---
const firebaseConfig = {
    apiKey: "AIzaSyBYAudMrkRq6Pxo9o9KnKw31gNmFE6cZLg",
    authDomain: "income-track-dd2f4.firebaseapp.com",
    projectId: "income-track-dd2f4",
    storageBucket: "income-track-dd2f4.firebasestorage.app",
    messagingSenderId: "71146709737",
    appId: "1:71146709737:web:a8a8983318f3fd645a8678"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let isFirebaseInitialized = false;

function setupFirebaseSync() {
    db.collection('income_track').doc('database_state').onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            state.customers = data.customers || [];
            state.purchases = data.purchases || [];
            state.prices = data.prices || initializeDefaultPrices();
            
            // Sync locally to cache
            localStorage.setItem('it_customers', JSON.stringify(state.customers));
            localStorage.setItem('it_purchases', JSON.stringify(state.purchases));
            localStorage.setItem('it_prices', JSON.stringify(state.prices));
            
            // Re-render current active view
            refreshActiveView();
        } else {
            // First time empty database, upload seeded state
            if (state.customers.length > 0) {
                saveStateToFirebase();
            }
        }
        isFirebaseInitialized = true;
    }, (error) => {
        console.warn("Firebase Firestore offline fallback:", error);
    });
}

function saveStateToFirebase() {
    db.collection('income_track').doc('database_state').set({
        customers: state.customers,
        purchases: state.purchases,
        prices: state.prices,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => {
        console.error("Firebase Sync Write Error:", err);
    });
}

function refreshActiveView() {
    const activeView = document.querySelector('.app-view.active');
    if (!activeView) return;
    
    const viewId = activeView.id.replace('view-', '');
    if (viewId === 'dashboard') renderDashboard();
    else if (viewId === 'search') renderSearchPage();
    else if (viewId === 'prices') renderPricesConfiguration();
    else if (viewId === 'add-list') renderAddList();
}

// --- Local Storage Synchronization ---
function loadStateFromStorage() {
    const localCustomers = localStorage.getItem('it_customers');
    const localPurchases = localStorage.getItem('it_purchases');
    const localPrices = localStorage.getItem('it_prices');

    if (localCustomers && localPurchases) {
        state.customers = JSON.parse(localCustomers);
        state.purchases = JSON.parse(localPurchases);
        state.prices = localPrices ? JSON.parse(localPrices) : initializeDefaultPrices();
    } else {
        // Initialize with default prices and seed sample data matching the exact screenshot details!
        state.prices = initializeDefaultPrices();
        seedSampleData();
    }
}

function saveStateToStorage() {
    localStorage.setItem('it_customers', JSON.stringify(state.customers));
    localStorage.setItem('it_purchases', JSON.stringify(state.purchases));
    localStorage.setItem('it_prices', JSON.stringify(state.prices));
    
    // Trigger background cloud Firestore sync
    saveStateToFirebase();
}

function initializeDefaultPrices() {
    const prices = {};
    DEFAULT_PRODUCTS.vegetables.forEach(p => { prices[p.id] = p.price; });
    DEFAULT_PRODUCTS.bananas.forEach(p => { prices[p.id] = p.price; });
    return prices;
}

// Seed sample customer and purchase matching screenshot details
function seedSampleData() {
    const sampleCustomer = {
        id: 'cust_' + Date.now(),
        name: 'sathya',
        phone: '9876543210'
    };
    
    // Seed purchase matching: sathya, PAID, 17 May 2026 at 09:05 PM, ₹270.00, 6 items
    const samplePurchase = {
        id: 'pur_1779111447000', // Pre-configured ID
        customerId: sampleCustomer.id,
        dateTime: '17 May 2026 at 09:05 PM',
        timestamp: 1779111447000, // May 17, 2026
        items: [
            { name: 'தக்காளி (Tomato)', price: 70, qty: 2, unit: 'kg', total: 140 },
            { name: 'பெரிய வெங்காயம் (Big Onion)', price: 60, qty: 1.5, unit: 'kg', total: 90 },
            { name: 'வெண்டைக்காய் (Ladies Finger)', price: 25, qty: 1, unit: 'kg', total: 25 },
            { name: 'பச்சை மிளகாய் (Green Chilli)', price: 10, qty: 1.5, unit: 'kg', total: 15 }
        ],
        discount: 0,
        total: 270.00,
        status: 'paid'
    };

    state.customers.push(sampleCustomer);
    state.purchases.push(samplePurchase);
    saveStateToStorage();
}

// --- View Router Engine ---
function switchView(viewName) {
    state.activeView = viewName;
    state.editingPurchaseId = null; // Clear edit locks
    
    // Toggle active classes in views
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');
    
    // Toggle active menu button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-target') === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Run view specific initializers
    if (viewName === 'dashboard') {
        renderDashboard();
    } else if (viewName === 'add-list') {
        renderAddList();
    } else if (viewName === 'prices') {
        renderPricesConfiguration();
    } else if (viewName === 'search') {
        renderSearchPage();
    }
}

// --- Date Formatter helper ---
function getFormattedDateTime() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const hoursStr = String(hours).padStart(2, '0');

    return `${day} ${month} ${year} at ${hoursStr}:${minutes} ${ampm}`;
}

// ==========================================================================
// 1. DASHBOARD CONTROLLER
// ==========================================================================
function renderDashboard() {
    loadStateFromStorage();
    
    // Calculate stats
    const totalCustomers = state.customers.length;
    const totalSales = state.purchases.reduce((sum, p) => sum + p.total, 0);
    const unpaidSales = state.purchases
        .filter(p => p.status === 'unpaid')
        .reduce((sum, p) => sum + p.total, 0);
        
    // Update labels
    document.getElementById('stat-total-customers').textContent = totalCustomers;
    document.getElementById('stat-total-sales').textContent = `₹${totalSales.toFixed(2)}`;
    document.getElementById('stat-pending-balance').textContent = `₹${unpaidSales.toFixed(2)}`;
    
    // Render list of recent purchases
    const listBody = document.getElementById('recent-purchases-list');
    listBody.innerHTML = '';
    
    // Sort purchases by timestamp descending
    const sortedPurchases = [...state.purchases].sort((a, b) => b.timestamp - a.timestamp);
    const recent = sortedPurchases.slice(0, 10); // Display top 10

    if (recent.length === 0) {
        listBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="6">No recent purchases found. Click '+ Quick Add' to start.</td>
            </tr>`;
        return;
    }
    
    recent.forEach(p => {
        const customer = state.customers.find(c => c.id === p.customerId);
        const name = customer ? customer.name : 'Unknown';
        const phone = customer && customer.phone ? customer.phone : 'No Phone';
        const initial = name.charAt(0);
        const itemsCount = p.items.length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="customer-cell">
                    <div class="customer-avatar">${initial}</div>
                    <div class="customer-name-wrapper">
                        <span class="c-name">${name}</span>
                        <span class="c-phone">${phone}</span>
                    </div>
                </div>
            </td>
            <td>${p.dateTime}</td>
            <td>
                <span class="status-badge ${p.status}">${p.status}</span>
            </td>
            <td class="purchase-total">₹${p.total.toFixed(2)}</td>
            <td class="purchase-items-count">${itemsCount} items</td>
            <td>
                <div class="action-buttons-cell">
                    <button class="icon-action-btn view-receipt-btn" title="View & Print Invoice" data-id="${p.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                    <button class="icon-action-btn edit-btn edit-purchase-btn" title="Edit Purchase" data-id="${p.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </button>
                    <button class="icon-action-btn delete-btn delete-purchase-btn" title="Delete Entry" data-id="${p.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        listBody.appendChild(row);
    });

    // Attach listeners
    document.querySelectorAll('.view-receipt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            showInvoiceModal(id);
        });
    });

    document.querySelectorAll('.edit-purchase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            loadPurchaseForEditing(id);
        });
    });

    document.querySelectorAll('.delete-purchase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            deletePurchase(id);
        });
    });
}

function deletePurchase(id) {
    state.purchases = state.purchases.filter(p => p.id !== id);
    saveStateToStorage();
    renderDashboard();
}

// ==========================================================================
// 2. ADD / EDIT BUYING LIST CONTROLLER
// ==========================================================================
let activeBillingStatus = 'paid';

function renderAddList() {
    loadStateFromStorage();
    
    // Clear forms if not editing
    if (!state.editingPurchaseId) {
        document.getElementById('bill-customer-name').value = '';
        document.getElementById('bill-customer-phone').value = '';
        document.getElementById('billing-items-container').innerHTML = '';
        document.getElementById('bill-discount').value = '0';
        setBillingStatus('paid');
        
        // Always add at least one default row
        addBillingItemRow();
    }

    renderQuickPickGrid();
    recalculateInvoiceTotal();
}

function setBillingStatus(status) {
    activeBillingStatus = status;
    const paidBtn = document.querySelector('.status-toggle-btn.paid');
    const unpaidBtn = document.querySelector('.status-toggle-btn.unpaid');
    
    if (status === 'paid') {
        paidBtn.classList.add('active');
        unpaidBtn.classList.remove('active');
    } else {
        unpaidBtn.classList.add('active');
        paidBtn.classList.remove('active');
    }
}

function addBillingItemRow(name = '', price = '', qty = '1', unit = 'kg') {
    const container = document.getElementById('billing-items-container');
    const rowId = 'row_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    const row = document.createElement('div');
    row.className = 'billing-item-row';
    row.id = rowId;
    
    row.innerHTML = `
        <input type="text" class="item-name-input" placeholder="Item (e.g. Tomato)" value="${name}">
        <div style="position: relative; display: flex; align-items: center;">
            <span style="position: absolute; left: 8px; font-size: 13px; color: var(--text-secondary); pointer-events: none;">₹</span>
            <input type="number" class="item-price-input" placeholder="Price" min="0" step="0.5" value="${price}" style="padding-left: 20px;">
        </div>
        <input type="number" class="item-qty-input" placeholder="Qty" min="0.01" step="0.01" value="${qty}">
        <select class="item-unit-select">
            <option value="kg" ${unit === 'kg' ? 'selected' : ''}>kg</option>
            <option value="piece" ${unit === 'piece' ? 'selected' : ''}>piece</option>
            <option value="bunch" ${unit === 'bunch' ? 'selected' : ''}>bunch</option>
            <option value="packet" ${unit === 'packet' ? 'selected' : ''}>pkt</option>
        </select>
        <button type="button" class="delete-row-btn" data-row-id="${rowId}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        </button>
    `;
    
    container.appendChild(row);
    
    // Attach recalculation event listeners
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', recalculateInvoiceTotal);
    });

    row.querySelector('.delete-row-btn').addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-row-id');
        deleteBillingItemRow(id);
    });
    
    // Focus new manual row's name field
    if (!name) {
        row.querySelector('.item-name-input').focus();
    }
}

function deleteBillingItemRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        recalculateInvoiceTotal();
    }
}

function recalculateInvoiceTotal() {
    let subtotal = 0;
    const rows = document.querySelectorAll('.billing-item-row');
    
    rows.forEach(row => {
        const price = parseFloat(row.querySelector('.item-price-input').value) || 0;
        const qty = parseFloat(row.querySelector('.item-qty-input').value) || 0;
        subtotal += price * qty;
    });
    
    const discount = parseFloat(document.getElementById('bill-discount').value) || 0;
    const total = Math.max(0, subtotal - discount);
    
    document.getElementById('bill-total-amount').textContent = `₹${total.toFixed(2)}`;
}

// Quick pick grid generator
let activeQuickCategory = 'all';
let quickSearchQuery = '';

function renderQuickPickGrid() {
    const grid = document.getElementById('quick-pick-grid');
    grid.innerHTML = '';
    
    let itemsToRender = [];
    if (activeQuickCategory === 'all' || activeQuickCategory === 'vegetables') {
        itemsToRender = [...itemsToRender, ...DEFAULT_PRODUCTS.vegetables];
    }
    if (activeQuickCategory === 'all' || activeQuickCategory === 'bananas') {
        itemsToRender = [...itemsToRender, ...DEFAULT_PRODUCTS.bananas];
    }
    
    // Filter by search query
    if (quickSearchQuery.trim()) {
        const q = quickSearchQuery.toLowerCase().trim();
        itemsToRender = itemsToRender.filter(item => 
            item.tamil.toLowerCase().includes(q) || 
            item.english.toLowerCase().includes(q)
        );
    }
    
    if (itemsToRender.length === 0) {
        grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 24px; font-style: italic;">No items found.</div>`;
        return;
    }
    
    itemsToRender.forEach(item => {
        // Fetch current daily configured price
        const currentPrice = state.prices[item.id] !== undefined ? state.prices[item.id] : item.price;
        const priceText = currentPrice ? `₹${currentPrice}/${item.unit}` : 'Set Price';
        
        const card = document.createElement('div');
        card.className = 'quick-item-card';
        card.innerHTML = `
            <div class="quick-item-tamil">${item.tamil}</div>
            <div class="quick-item-english">${item.english}</div>
            <div class="quick-item-price">${priceText}</div>
        `;
        
        card.addEventListener('click', () => {
            handleQuickItemClick(item, currentPrice);
        });
        
        grid.appendChild(card);
    });
}

function handleQuickItemClick(item, currentPrice) {
    const price = parseFloat(currentPrice) || 0;
    const itemName = `${item.tamil} (${item.english})`;
    
    // Check if an empty first row exists
    const rows = document.querySelectorAll('.billing-item-row');
    if (rows.length === 1) {
        const firstRow = rows[0];
        const nameVal = firstRow.querySelector('.item-name-input').value;
        const priceVal = firstRow.querySelector('.item-price-input').value;
        
        if (!nameVal && !priceVal) {
            // Update empty first row
            firstRow.querySelector('.item-name-input').value = itemName;
            firstRow.querySelector('.item-price-input').value = price;
            firstRow.querySelector('.item-qty-input').value = 1;
            firstRow.querySelector('.item-unit-select').value = item.unit;
            firstRow.querySelector('.item-qty-input').focus();
            firstRow.querySelector('.item-qty-input').select();
            recalculateInvoiceTotal();
            return;
        }
    }
    
    // Check if item is already in list to avoid duplicates
    let existingRow = null;
    rows.forEach(row => {
        if (row.querySelector('.item-name-input').value === itemName) {
            existingRow = row;
        }
    });
    
    if (existingRow) {
        // Increment quantity of existing row
        const qtyInput = existingRow.querySelector('.item-qty-input');
        let currentQty = parseFloat(qtyInput.value) || 0;
        qtyInput.value = currentQty + 1;
        qtyInput.focus();
        qtyInput.select();
    } else {
        // Create new item row
        addBillingItemRow(itemName, price, 1, item.unit);
        // Find newly added row quantity field to focus it
        const newRows = document.querySelectorAll('.billing-item-row');
        if (newRows.length > 0) {
            const lastQtyInput = newRows[newRows.length - 1].querySelector('.item-qty-input');
            lastQtyInput.focus();
            lastQtyInput.select();
        }
    }
    
    recalculateInvoiceTotal();
}

// Autocomplete customer names
function setupCustomerAutocomplete() {
    const input = document.getElementById('bill-customer-name');
    const dropdown = document.getElementById('autocomplete-dropdown');
    const phoneInput = document.getElementById('bill-customer-phone');
    
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        
        if (!query) {
            dropdown.style.display = 'none';
            return;
        }
        
        const matches = state.customers.filter(c => 
            c.name.toLowerCase().includes(query) || 
            (c.phone && c.phone.includes(query))
        );
        
        if (matches.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        dropdown.style.display = 'block';
        matches.forEach(c => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.innerHTML = `
                <span>${c.name}</span>
                <span class="c-number">${c.phone || ''}</span>
            `;
            
            item.addEventListener('click', () => {
                input.value = c.name;
                phoneInput.value = c.phone || '';
                dropdown.style.display = 'none';
            });
            
            dropdown.appendChild(item);
        });
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// Save / Commit the buying list
function saveBuyingList() {
    const customerNameInput = document.getElementById('bill-customer-name');
    const customerPhoneInput = document.getElementById('bill-customer-phone');
    const discountInput = document.getElementById('bill-discount');
    
    const name = customerNameInput.value.trim();
    const phone = customerPhoneInput.value.trim();
    
    if (!name) {
        alert("Please enter a customer name!");
        customerNameInput.focus();
        return;
    }
    
    // Compile items
    const items = [];
    const rows = document.querySelectorAll('.billing-item-row');
    
    rows.forEach(row => {
        const iName = row.querySelector('.item-name-input').value.trim();
        const iPrice = parseFloat(row.querySelector('.item-price-input').value) || 0;
        const iQty = parseFloat(row.querySelector('.item-qty-input').value) || 0;
        const iUnit = row.querySelector('.item-unit-select').value;
        
        if (iName) {
            items.push({
                name: iName,
                price: iPrice,
                qty: iQty,
                unit: iUnit,
                total: iPrice * iQty
            });
        }
    });
    
    if (items.length === 0) {
        alert("Please add at least one item list entry to compile!");
        return;
    }
    
    // Fetch or register customer
    let customer = state.customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    if (!customer) {
        customer = {
            id: 'cust_' + Date.now(),
            name: name,
            phone: phone || ''
        };
        state.customers.push(customer);
    } else if (phone && phone !== customer.phone) {
        // Update customer's phone number if it changed
        customer.phone = phone;
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount = parseFloat(discountInput.value) || 0;
    const total = Math.max(0, subtotal - discount);
    
    if (state.editingPurchaseId) {
        // Edit existing buying register
        const purchaseIndex = state.purchases.findIndex(p => p.id === state.editingPurchaseId);
        if (purchaseIndex !== -1) {
            state.purchases[purchaseIndex].customerId = customer.id;
            state.purchases[purchaseIndex].items = items;
            state.purchases[purchaseIndex].discount = discount;
            state.purchases[purchaseIndex].total = total;
            state.purchases[purchaseIndex].status = activeBillingStatus;
            // Retain original timestamp & dateTime
        }
    } else {
        // Create new purchase
        const now = Date.now();
        const newPurchase = {
            id: 'pur_' + now,
            customerId: customer.id,
            dateTime: getFormattedDateTime(),
            timestamp: now,
            items: items,
            discount: discount,
            total: total,
            status: activeBillingStatus
        };
        state.purchases.push(newPurchase);
    }
    
    saveStateToStorage();
    
    // Done! Switch view back to Dashboard
    alert("Customer buying list saved successfully!");
    switchView('dashboard');
}

// Edit entry load
function loadPurchaseForEditing(purchaseId) {
    const p = state.purchases.find(item => item.id === purchaseId);
    if (!p) return;
    
    state.editingPurchaseId = purchaseId;
    switchView('add-list');
    
    // Set headers
    document.querySelector('.view-title').textContent = "Edit Buying List";
    
    // Load Customer details
    const customer = state.customers.find(c => c.id === p.customerId);
    document.getElementById('bill-customer-name').value = customer ? customer.name : '';
    document.getElementById('bill-customer-phone').value = customer && customer.phone ? customer.phone : '';
    
    // Load Cart items
    const container = document.getElementById('billing-items-container');
    container.innerHTML = '';
    
    p.items.forEach(item => {
        addBillingItemRow(item.name, item.price, item.qty, item.unit);
    });
    
    // Load summary calculations
    document.getElementById('bill-discount').value = p.discount;
    setBillingStatus(p.status);
    
    recalculateInvoiceTotal();
}

// ==========================================================================
// 3. TODAY'S PRICES CONTROLLER
// ==========================================================================
function renderPricesConfiguration() {
    loadStateFromStorage();
    
    const vegGrid = document.getElementById('vegetables-price-grid');
    const bananaGrid = document.getElementById('bananas-price-grid');
    
    vegGrid.innerHTML = '';
    bananaGrid.innerHTML = '';
    
    // Load vegetables
    DEFAULT_PRODUCTS.vegetables.forEach(v => {
        const price = state.prices[v.id] !== undefined ? state.prices[v.id] : v.price;
        const row = createPriceSettingRow(v, price);
        vegGrid.appendChild(row);
    });
    
    // Load bananas
    DEFAULT_PRODUCTS.bananas.forEach(b => {
        const price = state.prices[b.id] !== undefined ? state.prices[b.id] : b.price;
        const row = createPriceSettingRow(b, price);
        bananaGrid.appendChild(row);
    });
}

function createPriceSettingRow(item, price) {
    const card = document.createElement('div');
    card.className = 'price-item-settings-card';
    
    card.innerHTML = `
        <div class="price-item-info">
            <span class="p-item-tamil">${item.tamil}</span>
            <span class="p-item-english">${item.english} (${item.unit})</span>
        </div>
        <div class="price-item-input-wrapper">
            <span class="price-prefix">₹</span>
            <input type="number" class="price-config-input" data-id="${item.id}" min="0" step="0.5" value="${price !== null ? price : ''}" placeholder="-">
        </div>
    `;
    return card;
}

function saveAllPrices() {
    const inputs = document.querySelectorAll('.price-config-input');
    inputs.forEach(input => {
        const itemId = input.getAttribute('data-id');
        const val = input.value.trim();
        state.prices[itemId] = val !== '' ? parseFloat(val) : null;
    });
    
    saveStateToStorage();
    alert("Vegetable & banana prices saved for today!");
    switchView('dashboard');
}

// ==========================================================================
// 4. CUSTOMER SEARCH PAGE CONTROLLER
// ==========================================================================
let activeProfileCustomerId = null;
let customerSearchQuery = '';

function renderSearchPage() {
    loadStateFromStorage();
    renderSearchCustomersList();
    renderCustomerProfileDetails();
}

function renderSearchCustomersList() {
    const sidebar = document.getElementById('search-customers-list');
    sidebar.innerHTML = '';
    
    let customersList = [...state.customers];
    
    // Filter list
    if (customerSearchQuery.trim()) {
        const q = customerSearchQuery.toLowerCase().trim();
        customersList = customersList.filter(c => 
            c.name.toLowerCase().includes(q) || 
            (c.phone && c.phone.includes(q))
        );
    }
    
    // Update counter
    document.getElementById('search-results-counter').textContent = `${customersList.length} customers found`;
    
    if (customersList.length === 0) {
        sidebar.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px; font-style: italic; font-size: 13px;">No customers found.</div>`;
        return;
    }
    
    customersList.forEach(c => {
        const purchases = state.purchases.filter(p => p.customerId === c.id);
        const unpaidCount = purchases.filter(p => p.status === 'unpaid').length;
        const initial = c.name.charAt(0);
        
        const card = document.createElement('div');
        card.className = `search-customer-card ${activeProfileCustomerId === c.id ? 'active' : ''}`;
        
        card.innerHTML = `
            <div class="sc-avatar">${initial}</div>
            <div class="sc-details">
                <span class="sc-name">${c.name}</span>
                <span class="sc-phone">${c.phone || 'No Phone'}</span>
            </div>
            ${unpaidCount > 0 ? `<span class="sc-unpaid-badge">${unpaidCount} unpaid</span>` : ''}
        `;
        
        card.addEventListener('click', () => {
            activeProfileCustomerId = c.id;
            // Refresh selection highlighting
            document.querySelectorAll('.search-customer-card').forEach(el => el.classList.remove('active'));
            card.classList.add('active');
            renderCustomerProfileDetails();
        });
        
        sidebar.appendChild(card);
    });
}

function renderCustomerProfileDetails() {
    const emptyState = document.getElementById('customer-profile-empty-state');
    const content = document.getElementById('customer-profile-content');
    
    if (!activeProfileCustomerId) {
        emptyState.classList.remove('hidden');
        content.classList.add('hidden');
        return;
    }
    
    const customer = state.customers.find(c => c.id === activeProfileCustomerId);
    if (!customer) {
        activeProfileCustomerId = null;
        emptyState.classList.remove('hidden');
        content.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    content.classList.remove('hidden');
    
    // Update basic header meta
    document.getElementById('customer-profile-name').textContent = customer.name;
    document.getElementById('customer-profile-phone').textContent = customer.phone || 'No phone registered';
    document.getElementById('customer-profile-avatar').textContent = customer.name.charAt(0);
    
    // Calculate buying summaries
    const purchases = state.purchases.filter(p => p.customerId === customer.id);
    const totalCount = purchases.length;
    const totalSpent = purchases.reduce((sum, p) => sum + p.total, 0);
    const outstanding = purchases.filter(p => p.status === 'unpaid').reduce((sum, p) => sum + p.total, 0);
    
    document.getElementById('customer-stat-purchases').textContent = totalCount;
    document.getElementById('customer-stat-spent').textContent = `₹${totalSpent.toFixed(2)}`;
    
    const outstandingEl = document.getElementById('customer-stat-outstanding');
    outstandingEl.textContent = `₹${outstanding.toFixed(2)}`;
    
    // Settle balance button visibility
    const settleAllBtn = document.getElementById('settle-all-balances-btn');
    if (outstanding > 0) {
        settleAllBtn.classList.remove('hidden');
    } else {
        settleAllBtn.classList.add('hidden');
    }
    
    // Render History list of purchases
    const historyList = document.getElementById('customer-history-list');
    historyList.innerHTML = '';
    
    if (purchases.length === 0) {
        historyList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px; font-style: italic;">No purchase registry logs.</div>`;
        return;
    }
    
    // Sort purchases by timestamp descending
    const sorted = [...purchases].sort((a, b) => b.timestamp - a.timestamp);
    
    sorted.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'history-item-card';
        card.id = `history-card-${p.id}`;
        
        card.innerHTML = `
            <div class="history-item-header" data-id="${p.id}">
                <div class="h-meta-left">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-expand-icon">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <span class="h-datetime">${p.dateTime}</span>
                </div>
                <div class="h-meta-right">
                    <span class="h-total">₹${p.total.toFixed(2)}</span>
                    <button type="button" class="h-status-btn ${p.status}" data-id="${p.id}" title="${p.status === 'unpaid' ? 'Mark as paid' : 'Payment finalized'}">
                        ${p.status}
                    </button>
                </div>
            </div>
            
            <div class="history-item-details">
                <table class="h-items-table">
                    <thead>
                        <tr>
                            <th>Item Particulars</th>
                            <th style="text-align: right;">Price</th>
                            <th style="text-align: right;">Qty</th>
                            <th style="text-align: right;">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${p.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                                <td style="text-align: right;">${item.qty} ${item.unit}</td>
                                <td style="text-align: right;">₹${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="h-details-actions">
                    <button class="btn-secondary share-invoice-btn" data-id="${p.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Share WhatsApp
                    </button>
                    <button class="btn-secondary print-invoice-btn" data-id="${p.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Print Invoice
                    </button>
                    <button class="btn-secondary edit-invoice-btn" data-id="${p.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="btn-secondary danger-action-btn delete-invoice-btn" data-id="${p.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        `;
        historyList.appendChild(card);
    });
    
    // Attach Accordion Toggle
    document.querySelectorAll('.history-item-header').forEach(header => {
        header.addEventListener('click', (e) => {
            // Avoid expand toggle if they click the status button directly
            if (e.target.classList.contains('h-status-btn')) return;
            
            const id = e.currentTarget.getAttribute('data-id');
            const card = document.getElementById(`history-card-${id}`);
            card.classList.toggle('expanded');
        });
    });
    
    // Individual Status toggles inside registry list
    document.querySelectorAll('.h-status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            togglePurchaseStatus(id);
        });
    });
    
    // Action details listeners
    document.querySelectorAll('.share-invoice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            shareViaWhatsApp(id);
        });
    });

    document.querySelectorAll('.print-invoice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            showInvoiceModal(id);
        });
    });

    document.querySelectorAll('.edit-invoice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            loadPurchaseForEditing(id);
        });
    });

    document.querySelectorAll('.delete-invoice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            state.purchases = state.purchases.filter(p => p.id !== id);
            saveStateToStorage();
            renderCustomerProfileDetails();
            renderSearchCustomersList(); // Refresh sidebar unpaid flags
        });
    });
}

function togglePurchaseStatus(purchaseId) {
    const p = state.purchases.find(item => item.id === purchaseId);
    if (!p) return;
    
    p.status = p.status === 'paid' ? 'unpaid' : 'paid';
    saveStateToStorage();
    
    // Re-render panels
    renderCustomerProfileDetails();
    renderSearchCustomersList();
}

function settleAllCustomerBalances() {
    if (!activeProfileCustomerId) return;
    
    if (confirm("Mark all outstanding buying list bills for this customer as PAID?")) {
        state.purchases.forEach(p => {
            if (p.customerId === activeProfileCustomerId && p.status === 'unpaid') {
                p.status = 'paid';
            }
        });
        
        saveStateToStorage();
        renderCustomerProfileDetails();
        renderSearchCustomersList();
    }
}

function deleteCustomerPermanently() {
    if (!activeProfileCustomerId) return;
    
    const customer = state.customers.find(c => c.id === activeProfileCustomerId);
    if (!customer) return;
    
    if (confirm(`Are you sure you want to permanently delete customer "${customer.name}" and ALL of their purchase lists? This action CANNOT be undone.`)) {
        // Remove customer from state
        state.customers = state.customers.filter(c => c.id !== activeProfileCustomerId);
        
        // Remove all purchases of this customer
        state.purchases = state.purchases.filter(p => p.customerId !== activeProfileCustomerId);
        
        saveStateToStorage();
        
        // Clear selection
        activeProfileCustomerId = null;
        
        // Re-render
        renderSearchCustomersList();
        renderCustomerProfileDetails();
        
        alert("Customer and all associated buying details have been deleted permanently!");
    }
}

// ==========================================================================
// 5. RECEIPT / INVOICE DIALOG ENGINE & SHARERS
// ==========================================================================
let activeModalInvoiceId = null;

function showInvoiceModal(purchaseId) {
    const p = state.purchases.find(item => item.id === purchaseId);
    if (!p) return;
    
    activeModalInvoiceId = purchaseId;
    const customer = state.customers.find(c => c.id === p.customerId);
    
    // Fill in values
    document.getElementById('inv-customer-name').textContent = customer ? customer.name : 'Walk-in Customer';
    document.getElementById('inv-customer-phone').textContent = customer && customer.phone ? customer.phone : 'Not provided';
    document.getElementById('inv-id').textContent = p.id.replace('pur_', '#');
    document.getElementById('inv-datetime').textContent = p.dateTime;
    
    // Items
    const tbody = document.getElementById('invoice-items-body');
    tbody.innerHTML = '';
    
    let subtotal = 0;
    p.items.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
            <td style="text-align: right;">${item.qty} ${item.unit}</td>
            <td style="text-align: right;">₹${itemTotal.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('inv-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('inv-discount').textContent = `₹${p.discount.toFixed(2)}`;
    document.getElementById('inv-grand-total').textContent = `₹${p.total.toFixed(2)}`;
    
    const statusBadge = document.getElementById('inv-status');
    statusBadge.textContent = p.status.toUpperCase();
    statusBadge.className = `inv-status-badge ${p.status}`;
    
    // Open Modal
    document.getElementById('invoice-modal').classList.remove('hidden');
}

function closeInvoiceModal() {
    document.getElementById('invoice-modal').classList.add('hidden');
    activeModalInvoiceId = null;
}

// Compile beautifully formatted text and open WhatsApp share window
function shareViaWhatsApp(purchaseId) {
    const p = state.purchases.find(item => item.id === purchaseId);
    if (!p) return;
    
    const customer = state.customers.find(c => c.id === p.customerId);
    if (!customer) return;
    
    let text = `*Thirumalaimurugan Shop*\n`;
    text += `Ph: 4633238478\n`;
    text += `Address: Main Road, Panboli - 627807\n`;
    text += `=========================\n`;
    text += `*Invoice No:* ${p.id.replace('pur_', '#')}\n`;
    text += `*Date:* ${p.dateTime}\n`;
    text += `*Customer:* ${customer.name}\n`;
    text += `=========================\n\n`;
    
    p.items.forEach((item, idx) => {
        text += `${idx + 1}. *${item.name}*\n`;
        text += `    ${item.qty} ${item.unit} x ₹${item.price.toFixed(2)} = *₹${item.total.toFixed(2)}*\n`;
    });
    
    text += `\n-------------------------\n`;
    if (p.discount > 0) {
        text += `*Subtotal:* ₹${(p.total + p.discount).toFixed(2)}\n`;
        text += `*Discount:* -₹${p.discount.toFixed(2)}\n`;
    }
    text += `*Grand Total:* *₹${p.total.toFixed(2)}*\n`;
    text += `*Payment Status:* *${p.status.toUpperCase()}*\n`;
    text += `-------------------------\n\n`;
    text += `_Thank you for buying from us! Visit again!_`;
    
    const encodedText = encodeURIComponent(text);
    const phoneNumber = customer.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
    
    // Add country code if missing
    let targetPhoneUrl = '';
    if (phoneNumber) {
        const fullPhone = phoneNumber.length === 10 ? '91' + phoneNumber : phoneNumber;
        targetPhoneUrl = `https://wa.me/${fullPhone}?text=${encodedText}`;
    } else {
        targetPhoneUrl = `https://wa.me/?text=${encodedText}`;
    }
    
    window.open(targetPhoneUrl, '_blank');
}



// ==========================================================================
// INITIALIZATION AND EVENT LISTENERS HANDLERS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State load
    loadStateFromStorage();
    
    // Start Firebase Cloud database real-time listener sync
    setupFirebaseSync();
    
    // 2. Load Dashboard view first
    switchView('dashboard');
    
    // 3. Sidebar Menu Nav Buttons click listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            switchView(target);
        });
    });
    
    // 4. Header buttons
    document.getElementById('quick-add-btn').addEventListener('click', () => {
        switchView('add-list');
    });
    
    document.getElementById('global-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const q = e.target.value.trim();
            if (q) {
                switchView('search');
                document.getElementById('search-page-input').value = q;
                customerSearchQuery = q;
                renderSearchCustomersList();
                e.target.value = ''; // Clear header bar
            }
        }
    });

    document.getElementById('view-all-purchases-btn').addEventListener('click', () => {
        switchView('search');
    });

    // 5. Billing form listeners
    setupCustomerAutocomplete();
    
    document.getElementById('add-manual-item-btn').addEventListener('click', () => {
        addBillingItemRow();
    });

    document.querySelectorAll('.status-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const status = e.target.getAttribute('data-status');
            setBillingStatus(status);
        });
    });

    document.getElementById('bill-discount').addEventListener('input', recalculateInvoiceTotal);

    document.getElementById('save-buying-list-btn').addEventListener('click', saveBuyingList);

    // Quick pick listeners
    document.getElementById('quick-pick-search').addEventListener('input', (e) => {
        quickSearchQuery = e.target.value;
        renderQuickPickGrid();
    });

    document.querySelectorAll('.quick-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.quick-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            activeQuickCategory = e.target.getAttribute('data-category');
            renderQuickPickGrid();
        });
    });

    // 6. Prices View listeners
    document.getElementById('save-all-prices-btn').addEventListener('click', saveAllPrices);

    // 7. Search Page listeners
    document.getElementById('search-page-input').addEventListener('input', (e) => {
        customerSearchQuery = e.target.value;
        renderSearchCustomersList();
    });

    document.getElementById('settle-all-balances-btn').addEventListener('click', settleAllCustomerBalances);
    document.getElementById('delete-customer-btn').addEventListener('click', deleteCustomerPermanently);

    // 8. Modal Receipt actions
    document.getElementById('close-invoice-modal-btn').addEventListener('click', closeInvoiceModal);
    
    document.getElementById('print-invoice-btn').addEventListener('click', () => {
        window.print();
    });
    
    document.getElementById('whatsapp-share-btn').addEventListener('click', () => {
        if (activeModalInvoiceId) {
            shareViaWhatsApp(activeModalInvoiceId);
        }
    });
    
    // Close modal on click outside content card
    const modalOverlay = document.getElementById('invoice-modal');
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeInvoiceModal();
        }
    });


});
