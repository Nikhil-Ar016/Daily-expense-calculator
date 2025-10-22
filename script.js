let expenses = [];

function init() {
    const today = new Date();
    document.getElementById('date').valueAsDate = today;
    updateDisplay();
}

function addExpense() {
    const itemName = document.getElementById('itemName').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!itemName || !amount || amount <= 0 || !date) {
        alert('Please fill in all fields with valid data!');
        return;
    }

    const expense = {
        id: Date.now(),
        itemName,
        amount,
        category,
        date
    };

    expenses.push(expense);
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    document.getElementById('itemName').value = '';
    document.getElementById('amount').value = '';

    updateDisplay();
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    updateDisplay();
}

function clearAllExpenses() {
    if (confirm('Are you sure you want to clear all expenses?')) {
        expenses = [];
        updateDisplay();
    }
}

function updateDisplay() {
    updateSummary();
    displayExpenses();
}

function updateSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        expDate.setHours(0, 0, 0, 0);

        if (expDate.getTime() === today.getTime()) {
            todayTotal += exp.amount;
        }
        if (expDate >= weekAgo) {
            weekTotal += exp.amount;
        }
        if (expDate >= monthAgo) {
            monthTotal += exp.amount;
        }
    });

    document.getElementById('todayTotal').textContent = `₹${todayTotal.toFixed(2)}`;
    document.getElementById('weekTotal').textContent = `₹${weekTotal.toFixed(2)}`;
    document.getElementById('monthTotal').textContent = `₹${monthTotal.toFixed(2)}`;
}

function displayExpenses() {
    const expensesList = document.getElementById('expensesList');
    const clearBtn = document.getElementById('clearBtn');

    if (expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>No expenses yet. Add your first expense above!</p>
            </div>
        `;
        clearBtn.style.display = 'none';
        return;
    }

    clearBtn.style.display = 'block';

    expensesList.innerHTML = expenses.map(exp => {
        const expDate = new Date(exp.date);
        const formattedDate = expDate.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });

        return `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-name">${exp.itemName}</div>
                    <div class="expense-details">
                        <span class="category-badge category-${exp.category}">
                            ${getCategoryIcon(exp.category)} ${exp.category}
                        </span>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                <div class="expense-amount">₹${exp.amount.toFixed(2)}</div>
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
            </div>
        `;
    }).join('');
}

function getCategoryIcon(category) {
    const icons = {
        food: '🍔',
        transport: '🚗',
        shopping: '🛍️',
        bills: '📄',
        entertainment: '🎬',
        other: '📌'
    };
    return icons[category] || '📌';
}

init();
