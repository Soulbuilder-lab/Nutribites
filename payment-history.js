document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
  setupMobileMenu();
});

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const container = document.getElementById('ordersContainer');
  
  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: white; border-radius: 10px;">
        <i class="fas fa-receipt" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
        <h2>No orders yet</h2>
        <p style="margin: 1rem 0;">Start shopping to see your order history!</p>
        <a href="index.html#products" class="btn btn-primary">Shop Now</a>
      </div>
    `;
    return;
  }
  
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">Order ${order.id}</div>
          <div class="order-date">${order.date}</div>
        </div>
        <span class="order-status ${order.status}">
          ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <span>${item.title} x ${item.quantity}</span>
            <span>RM${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-total">Total: RM${order.total.toFixed(2)}</div>
    </div>
  `).join('');
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}