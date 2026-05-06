let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  updateCartCount();
});

function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: white; border-radius: 10px;">
        <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
        <h2>Your cart is empty</h2>
        <p style="margin: 1rem 0;">Add some healthy snacks to get started!</p>
        <a href="index.html#products" class="btn btn-primary">Shop Now</a>
      </div>
    `;
    updateTotals();
    return;
  }
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/100?text=Product'">
      <div class="cart-item-details">
        <h3>${item.title}</h3>
        <p class="cart-item-price">RM${item.price.toFixed(2)}</p>
        <div class="quantity-control">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <p style="font-weight: bold; font-size: 1.2rem;">RM${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-item" onclick="removeItem(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  updateTotals();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) { removeItem(productId); }
    else { saveCart(); renderCartItems(); updateCartCount(); }
  }
}

function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart(); renderCartItems(); updateCartCount();
}

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + 5 + 2;
  document.getElementById('subtotal').textContent = `RM${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `RM${total.toFixed(2)}`;
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cartCount').forEach(el => { el.textContent = count; });
}

function proceedToCheckout() {
  if (cart.length === 0) { alert('Your cart is empty!'); return; }
  window.location.href = 'checkout.html';
}