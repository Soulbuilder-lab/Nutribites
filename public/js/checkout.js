// 🛒 Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Checkout page loaded');
    console.log('🛒 Cart:', cart);

    renderOrderSummary();
    setupPaymentToggle();
    setupCardFormatting();
    setupFormSubmission();
});

// ==================== RENDER ORDER SUMMARY ====================
function renderOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">Your cart is empty</p>';
        document.getElementById('checkoutSubtotal').textContent = 'RM0.00';
        document.getElementById('checkoutTotal').textContent = 'RM0.00';
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    if (user && user.discount) {
        discountAmount = subtotal * (user.discount / 100);
    }

    const delivery = 5.00;
    const serviceTax = subtotal * 0.06;
    const total = subtotal - discountAmount + delivery + serviceTax;

    orderItemsContainer.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
            <div>
                <strong style="font-family: var(--font-heading);">${item.title}</strong>
                <p style="color: #666; font-size: 0.9rem; margin: 0.25rem 0 0;">Qty: ${item.quantity}</p>
            </div>
            <strong style="color: var(--primary-sage); font-family: var(--font-heading);">RM${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
    `).join('');

    document.getElementById('checkoutSubtotal').textContent = `RM${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `RM${total.toFixed(2)}`;

    const discountRow = document.getElementById('discountRow');
    if (discountRow) {
        if (discountAmount > 0) {
            discountRow.style.display = 'flex';
            discountRow.innerHTML = `<span>Member Discount (${user.discount}% off)</span><span style="color: var(--primary-sage); font-weight: bold;">-RM${discountAmount.toFixed(2)}</span>`;
        } else {
            discountRow.style.display = 'none';
        }
    }
}

// ==================== PAYMENT TOGGLE ====================
function setupPaymentToggle() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');

    if (paymentOptions.length > 0 && cardDetails) {
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                cardDetails.style.display = e.target.value === 'cod' ? 'none' : 'block';
                cardDetails.querySelectorAll('input').forEach(input => {
                    input.required = e.target.value === 'card';
                    if (e.target.value === 'cod') input.value = '';
                });
            });
        });
    }
}

// ==================== CARD FORMATTING ====================
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');

    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = value;
        });
    }
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
            e.target.value = value;
        });
    }
    if (cardCvv) {
        cardCvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// ==================== FORM SUBMISSION (WORKS FOR BOTH COD & CARD) ====================
function setupFormSubmission() {
    const form = document.getElementById('checkoutForm') || document.querySelector('form');
    if (!form) {
        console.error('❌ Form not found!');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            console.log('🚀 Form submission triggered');

            // 1. Get Values
            const fullName = form.querySelector('input[type="text"]')?.value?.trim() || '';
            const email = form.querySelector('input[type="email"]')?.value?.trim() || '';
            const phone = form.querySelector('input[type="tel"]')?.value?.trim() || '';
            const address = form.querySelector('textarea')?.value?.trim() || '';
            const paymentMethod = form.querySelector('input[name="payment"]:checked')?.value;

            // 2. Validation
            if (!fullName) { alert('Please enter your full name'); return; }
            if (!email) { alert('Please enter a valid email'); return; }
            if (!phone) { alert('Please enter your phone number'); return; }
            if (!address) { alert('Please enter your delivery address'); return; }
            if (!paymentMethod) { alert('Please select a payment method'); return; }
            if (cart.length === 0) { alert('Your cart is empty'); return; }

            // 3. Card Validation (Only if Card is selected)
            if (paymentMethod === 'card') {
                const cardName = document.getElementById('cardName')?.value?.trim();
                const cardNumber = document.getElementById('cardNumber')?.value?.replace(/\s/g, '');
                const cardExpiry = document.getElementById('cardExpiry')?.value?.trim();
                const cardCvv = document.getElementById('cardCvv')?.value?.trim();

                if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
                    alert('Please fill in all card details');
                    return;
                }
            }

            // 4. Calculate Totals (Including 20% Discount)
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let discountAmount = 0;
            if (user && user.discount) {
                discountAmount = subtotal * (user.discount / 100);
            }
            const delivery = 5.00;
            const serviceTax = subtotal * 0.06;
            const finalTotal = subtotal - discountAmount + delivery + serviceTax;

            // 5. Create Order Object           
           // Use logged-in user's email if available, otherwise use form email
           const currentUser = JSON.parse(localStorage.getItem('currentUser'));
           const orderEmail = currentUser ? currentUser.email : email;
           const orderName = currentUser ? currentUser.name : fullName;

           const order = {
           id: 'NB-' + Date.now().toString().slice(-6),
           date: new Date().toLocaleString('en-MY'),
           items: JSON.parse(JSON.stringify(cart)),
           subtotal,
           discount: discountAmount,
           delivery,
           serviceTax,
           total: finalTotal,
           status: paymentMethod === 'cod' ? 'pending' : 'completed',
           paymentMethod,
           customer: { 
                fullName: orderName,
                email: orderEmail,  // This ensures it matches the logged-in user
                phone, 
                address 
                }
            };

            console.log('📦 Creating order:', order);

            // 6. Save & Clear
            let orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.unshift(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.removeItem('cart');
            localStorage.setItem('lastOrderAmount', finalTotal.toFixed(2));
            localStorage.setItem('lastOrderId', order.id);

            console.log('✅ Order saved, redirecting...');
            window.location.href = 'success.html';

        } catch (error) {
            console.error('❌ Checkout error:', error);
            alert('Something went wrong. Please try again.');
        }

        // Listen for when user returns to profile page
        document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            // Refresh order count on profile page if open
            const totalOrdersEl = document.getElementById('totalOrdersEl');
            if (totalOrdersEl) {
              const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
              const userOrders = allOrders.filter(order => order.customer?.email === user.email);
              totalOrdersEl.textContent = userOrders.length;
            }
                }
            }
        });
    });
}
