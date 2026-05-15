// 📦 Products Data with Value Propositions
const products = [
  { 
    id: 1, 
    title: "Dark Chocolate Protein Bar", 
    price: 16.90, 
    images: [
      "Images/Chocolate-bar .jpeg",
      "Images/Chocolatepack.jpeg",
      "Images/Chocolatepic.jpeg"
    ],
    description: "Rich Belgian dark chocolate infused with premium whey protein",
    badge: "🌱 Eco-Friendly" // Value Prop: Sustainability
  },
  { 
    id: 2, 
    title: "Granola Power Bar", 
    price: 13.90, 
    images: [
      "Images/Granola-bar.jpeg",
      "Images/Granolapack.jpeg",
      "Images/Granolapic.jpeg"
    ],
    description: "Artisan blend of organic oats, wild honey, and premium nuts",
    badge: "⚡ Fast Energy" // Value Prop: Performance
  },
  { 
    id: 3, 
    title: "Veggie Crunch Mix", 
    price: 22.90, 
    images: [
      "Images/Cashew-crunch.jpeg",
      "Images/Cashewpack.jpeg",
      "Images/Veggiepic.jpeg"
    ],
    description: "Premium whole veggie crunch with traditional recipe",
    badge: "💰 Best Value" // Value Prop: Price
  },
  { 
    id: 4, 
    title: "Spiced Cashew Bowl", 
    price: 20.90, 
    images: [
      "Images/Spiced-cashews.jpeg",
      "Images/Spicedpack.jpeg",
      "Images/Spicedpic.jpeg"
    ],
    description: "Traditional Malaysian spiced cashews with curry leaves & chilies",
    badge: "🔥 Trending Now" // Value Prop: Popularity
  },
  { 
    id: 5, 
    title: "Yogurt Berry Crunch Cups", 
    price: 10.90, 
    images: [
      "Images/Yogurt.jpeg",
      "Images/Yogurtpack.jpeg",
      "Images/Yogurtpic.jpeg"
    ],
    description: "Greek yogurt layered with crunchy granola and mixed berries",
    badge: "✨ Premium Quality" // Value Prop: Luxury/Quality
  }
];

// 🛒 Cart State
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🔗 DOM References
const productsGrid = document.getElementById('productsGrid');
const cartCountElements = document.querySelectorAll('#cartCount');

// 🔄 Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (productsGrid) {
    renderProducts();
    setupMobileMenu();
    initProductGalleries();
  }
});

// ==================== RENDER PRODUCTS ====================
function renderProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <!-- Value Proposition Badge -->
      <span class="product-badge">${p.badge}</span>
      
      <div class="product-gallery">
        <div class="product-gallery-images" id="gallery-${p.id}">
          ${p.images.map((img, idx) => `
            <img src="${img}" alt="${p.title} - View ${idx + 1}" class="product-gallery-image">
          `).join('')}
        </div>
        <button class="product-gallery-nav prev" data-product="${p.id}" aria-label="Previous">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="product-gallery-nav next" data-product="${p.id}" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="product-gallery-dots" id="dots-${p.id}">
          ${p.images.map((_, idx) => `
            <span class="product-gallery-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
          `).join('')}
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.description}</p>
        <p class="product-price">RM${p.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${p.id}">
          <i class="fas fa-shopping-bag"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');
  
  initProductGalleries();
}

// ==================== PRODUCT GALLERY ====================
function initProductGalleries() {
  document.querySelectorAll('.product-gallery-nav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.dataset.product;
      const direction = btn.classList.contains('next') ? 1 : -1;
      changeProductGallerySlide(productId, direction);
    });
  });
  
  document.querySelectorAll('.product-gallery-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = dot.closest('.product-card').dataset.id;
      const index = parseInt(dot.dataset.index);
      goToProductGallerySlide(productId, index);
    });
  });
  
  document.querySelectorAll('.product-gallery').forEach(gallery => {
    gallery.addEventListener('click', (e) => e.stopPropagation());
  });
}

function changeProductGallerySlide(productId, direction) {
  const gallery = document.getElementById(`gallery-${productId}`);
  const dots = document.querySelectorAll(`#dots-${productId} .product-gallery-dot`);
  const images = gallery.querySelectorAll('.product-gallery-image');
  
  let currentIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
  let newIndex = currentIndex + direction;
  if (newIndex < 0) newIndex = images.length - 1;
  if (newIndex >= images.length) newIndex = 0;
  
  gallery.style.transform = `translateX(-${newIndex * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[newIndex].classList.add('active');
}

function goToProductGallerySlide(productId, index) {
  const gallery = document.getElementById(`gallery-${productId}`);
  const dots = document.querySelectorAll(`#dots-${productId} .product-gallery-dot`);
  const images = gallery.querySelectorAll('.product-gallery-image');
  
  if (index < 0 || index >= images.length) return;
  
  gallery.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

// ==================== ADD TO CART ====================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, image: product.images[0], quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification('Added to your selection');
}

// ==================== CART COUNT ====================
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach(el => { 
    el.textContent = count;
    if (count > 0) {
      el.style.transform = 'scale(1.2)';
      setTimeout(() => el.style.transform = 'scale(1)', 200);
    }
  });
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }
}

// ==================== NOTIFICATION ====================
function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: var(--primary-sage); color: var(--neutral-white);
    padding: 1rem 2rem; border-radius: var(--radius-md);
    box-shadow: var(--shadow-hover); z-index: 9999;
    display: flex; align-items: center; gap: 0.75rem;
    font-weight: 500; animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add keyframes if not present
if (!document.getElementById('notif-styles')) {
  const style = document.createElement('style');
  style.id = 'notif-styles';
  style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  `;
  document.head.appendChild(style);
}

// Event delegation for add-to-cart
document.addEventListener('click', (e) => {
  if (e.target.closest('.add-to-cart')) {
    e.preventDefault();
    const btn = e.target.closest('.add-to-cart');
    const productId = parseInt(btn.dataset.id);
    addToCart(productId);
    
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    btn.style.background = 'var(--primary-sage-dark)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
    }, 1500);
  }
});

/* ==================== USER AUTHENTICATION SYSTEM ==================== */
// Check if user is logged in
function checkUserStatus() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    // User is logged in - apply 20% discount
    document.querySelectorAll('.cart-item-price').forEach(el => {
      const originalPrice = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
      const discountedPrice = originalPrice * 0.8; // 20% off
      el.textContent = `RM${discountedPrice.toFixed(2)}`;
    });
    
    // Update cart totals
    calculateCartTotals();
  } else {
    // User is not logged in - show regular prices
    document.querySelectorAll('.cart-item-price').forEach(el => {
      const originalPrice = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
      el.textContent = `RM${originalPrice.toFixed(2)}`;
    });
    
    // Update cart totals
    calculateCartTotals();
  }
}

// Calculate cart totals with discount
function calculateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const hasDiscount = user && user.discount;
  
  // Apply 20% discount if user is logged in
  let discount = 0;
  if (hasDiscount) {
    discount = subtotal * 0.20;
  }
  
  const total = subtotal - discount + 5; // 5 = delivery fee
  
  // Update display
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const totalEl = document.getElementById('checkoutTotal');
  const discountEl = document.getElementById('discountRow');
  
  if (subtotalEl) {
    subtotalEl.textContent = `RM${subtotal.toFixed(2)}`;
  }
  
  if (totalEl) {
    totalEl.textContent = `RM${total.toFixed(2)}`;
  }
  
  // Show/hide discount row
  if (discountEl) {
    if (discount > 0) {
      discountEl.style.display = 'flex';
      discountEl.innerHTML = `
        <span style="color: var(--primary-sage);">Member Discount (20%):</span>
        <span style="color: var(--primary-sage);">-RM${discount.toFixed(2)}</span>
      `;
    } else {
      discountEl.style.display = 'none';
    }
  }
}

// User authentication functions
function login(email, password) {
  // In a real app, this would check against a server
  // For demo, we'll just create a dummy user
  const user = {
    id: Date.now(),
    name: email.split('@')[0],
    email: email,
    discount: 20,
    joinedDate: new Date().toISOString()
  };
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Update UI
  document.querySelector('.user-name').textContent = user.name;
  document.querySelector('.user-icon').classList.add('logged-in');
  
  // Apply discount
  checkUserStatus();
  
  return user;
}

function logout() {
  localStorage.removeItem('currentUser');
  
  // Update UI
  document.querySelector('.user-name').textContent = 'Login';
  document.querySelector('.user-icon').classList.remove('logged-in');
  
  // Remove discount
  checkUserStatus();
}

// Initialize user status
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    document.querySelector('.user-name').textContent = user.name;
    document.querySelector('.user-icon').classList.add('logged-in');
  }
  
  // Check cart for discounts
  checkUserStatus();
});

// Add login functionality to profile button
document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.querySelector('.user-icon');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        // User is logged in - show profile
        window.location.href = 'profile.html';
      } else {
        // User is not logged in - show login
        window.location.href = 'login.html';
      }
    });
  }
});

// Add logout functionality
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = 'index.html';
    });
  }
}

// Calculate cart totals on page load
document.addEventListener('DOMContentLoaded', () => {
  calculateCartTotals();
});