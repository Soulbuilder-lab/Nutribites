// 📦 Products Data (Premium Collection - Prices in RM)
const products = [
  {
    id: 1,
    title: "Dark Chocolate Protein Bar",
    price: 18.90,
    images: [
      "Images/Chocolate-bar .jpeg",
      "Images/Chocolatepack.jpeg",
      "Images/Chocolatepack.jpeg"
    ],
    description: "Rich Belgian dark chocolate infused with premium whey protein"
  },
  {
    id: 2,
    title: "Granola Power Bar",
    price: 15.90,
    images: [
      "Images/Granola-bar.jpeg",
      "Images/Granolapack.jpeg",
      "Images/Granolapack.jpeg"
    ],
    description: "Artisan blend of organic oats, wild honey, and premium nuts"
  },
  {
    id: 3,
    title: "Roasted Cashew Crunch",
    price: 24.90,
    images: [
      "Images/Cashew-crunch.jpeg",
      "Images/Cashewpack.jpeg",
      "Images/Cashewpack.jpeg"
    ],
    description: "Premium whole cashews roasted with traditional recipe"
  },
  {
    id: 4,
    title: "Spiced Cashew Bowl",
    price: 22.90,
    images: [
      "Images/Spiced-cashews.jpeg",
      "Images/Spicedpack.jpeg",
      "Images/Spicedpack.jpeg"
    ],
    description: "Traditional Malaysian spiced cashews with curry leaves & chilies"
  },
  {
    id: 5,
    title: "Spiced Cashew Bowl",
    price: 10.90,
    images: [
      "Images/Yogurt.jpeg",
      "Images/Yogurtpack.jpeg",
      "Images/Yogurtpack.jpeg"
    ],
    description: "Greek yogurt layered with crunchy granola and mixed berries"
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