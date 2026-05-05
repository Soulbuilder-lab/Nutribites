// 🛒 Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Checkout page loaded');
  console.log('🛒 Cart:', cart);
  
  // Only run on checkout page
  if (window.location.pathname.includes('/checkout') || window.location.href.includes('checkout.html')) {
    renderOrderSummary();
    setupPaymentToggle();
    setupFormSubmission();
  }
});

function renderOrderSummary() {
  const orderItemsContainer = document.getElementById('orderItems');
  if (!orderItemsContainer) {
    console.warn('⚠️ orderItems container not found');
    return;
  }
  
  if (cart.length === 0) {
    orderItemsContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">Your cart is empty</p>';
    return;
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = 5.00;
  const total = subtotal + delivery;
  
  orderItemsContainer.innerHTML = cart.map(item => `
    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
      <div>
        <strong style="font-family: var(--font-heading);">${item.title}</strong>
        <p style="color: #666; font-size: 0.9rem; margin: 0.25rem 0 0;">Qty: ${item.quantity}</p>
      </div>
      <strong style="color: var(--primary-sage); font-family: var(--font-heading);">RM${(item.price * item.quantity).toFixed(2)}</strong>
    </div>
  `).join('');
  
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const totalEl = document.getElementById('checkoutTotal');
  if (subtotalEl) subtotalEl.textContent = `RM${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `RM${total.toFixed(2)}`;
}

function setupPaymentToggle() {
  const paymentOptions = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById('cardDetails');
  
  console.log('💳 Payment options found:', paymentOptions.length);
  
  paymentOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      console.log('💳 Payment method selected:', e.target.value);
      if (cardDetails) {
        cardDetails.style.display = e.target.value === 'cod' ? 'none' : 'block';
      }
    });
  });
}

function setupFormSubmission() {
  const form = document.getElementById('checkoutForm');
  if (!form) {
    console.error('❌ checkoutForm not found!');
    return;
  }
  
  console.log('✅ Form found, attaching submit listener');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      console.log('🚀 Form submission triggered');
      
      // 🔍 Get form values using querySelector (since inputs have no IDs)
      const fullName = form.querySelector('input[type="text"]')?.value?.trim() || '';
      const email = form.querySelector('input[type="email"]')?.value?.trim() || '';
      const phone = form.querySelector('input[type="tel"]')?.value?.trim() || '';
      const address = form.querySelector('textarea')?.value?.trim() || '';
      const city = form.querySelectorAll('input[type="text"]')[1]?.value?.trim() || '';
      const postalCode = form.querySelectorAll('input[type="text"]')[2]?.value?.trim() || '';
      const paymentMethod = form.querySelector('input[name="payment"]:checked')?.value || '';
      
      console.log('📝 Form values:', { fullName, email, phone, address, city, postalCode, paymentMethod });
      
      // ✅ Validation with specific error messages
      if (!fullName) {
        alert('Please enter your full name');
        form.querySelector('input[type="text"]')?.focus();
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        form.querySelector('input[type="email"]')?.focus();
        return;
      }
      if (!phone) {
        alert('Please enter your phone number');
        form.querySelector('input[type="tel"]')?.focus();
        return;
      }
      if (!address) {
        alert('Please enter your delivery address');
        form.querySelector('textarea')?.focus();
        return;
      }
      if (!paymentMethod) {
        alert('Please select a payment method');
        return;
      }
      
      if (cart.length === 0) {
        alert('Your cart is empty');
        return;
      }
      
      const formData = { fullName, email, phone, address, city, postalCode, paymentMethod };
      
      // 💰 Calculate totals
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const delivery = 5.00;
      const total = subtotal + delivery;
      
      // 📦 Create order object
      const order = {
        id: 'NB-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleString('en-MY'),
        items: JSON.parse(JSON.stringify(cart)), // Deep copy
        subtotal,
        delivery,
        total,
        status: 'completed',
        customer: formData
      };
      
      console.log('📦 Creating order:', order);
      
      // 💾 Save to localStorage
      let orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.unshift(order); // Add to beginning for newest first
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // 🗑️ Clear cart
      localStorage.removeItem('cart');
      
      // 🔄 Pass order info to success page
      localStorage.setItem('lastOrderAmount', total.toFixed(2));
      localStorage.setItem('lastOrderId', order.id);
      
      console.log('✅ Order saved successfully, redirecting...');
      
      // 🎯 Redirect with small delay to ensure localStorage writes complete
      setTimeout(() => {
        window.location.href = 'success.html';
      }, 100);
      
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert('Something went wrong. Please try again.\n\nError: ' + error.message);
    }
  });
}