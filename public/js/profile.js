// User Authentication System
document.addEventListener('DOMContentLoaded', () => {
  checkUserStatus();
  
  // Login form
  const loginForm = document.getElementById('loginFormElement');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Register form
  const registerForm = document.getElementById('registerFormElement');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Update user icon in header
  updateUserIcon();
});

// Check if user is logged in
function checkUserStatus() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    showProfileDashboard(user);
  } else {
    showLoginForm();
  }
}

// Handle Login
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert(`Welcome back, ${user.name}!`);
    showProfileDashboard(user);
    updateUserIcon();
  } else {
    alert('Invalid email or password.');
  }
}

// Handle Register
function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find(u => u.email === email)) {
    alert('Email already registered.');
    return;
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    discount: 20,
    joinedDate: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  alert(`Welcome to NutriBites, ${name}!`);
  showProfileDashboard(newUser);
  updateUserIcon();
}

// Show Profile Dashboard
function showProfileDashboard(user) {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('profileDashboard').style.display = 'block';
  
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  
  // --- NEW LOGIC: Count Orders for this specific user ---
  // 1. Get all orders from localStorage
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // 2. Filter orders where the customer's email matches the logged-in user's email
  // We use optional chaining (?.) to safely access the email property
  const userOrders = allOrders.filter(order => order.customer?.email === user.email);
  
  // 3. Update the UI element with the correct count
  const totalOrdersEl = document.getElementById('totalOrdersEl');
  if (totalOrdersEl) {
    totalOrdersEl.textContent = userOrders.length;
  }
}

// Show Login Form
function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('profileDashboard').style.display = 'none';
}

// Show Register Form
function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('profileDashboard').style.display = 'none';
}

// Logout
function logout() {
  localStorage.removeItem('currentUser');
  alert('You have been logged out.');
  showLoginForm();
  updateUserIcon();
}

// Update User Icon in Header
function updateUserIcon() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const userIcon = document.getElementById('userIcon');
  const userName = document.getElementById('userName');
  
  if (userIcon && userName) {
    if (user) {
      userName.textContent = user.name.split(' ')[0];
      userIcon.classList.add('logged-in');
    } else {
      userName.textContent = 'Login';
      userIcon.classList.remove('logged-in');
    }
  }
}

// Listen for storage changes (when user makes a purchase)
window.addEventListener('storage', (e) => {
  if (e.key === 'orders') {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      updateOrderCount(user);
    }
  }
});

// Update order count function
function updateOrderCount(user) {
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const userOrders = allOrders.filter(order => order.customer?.email === user.email);
  const totalOrdersEl = document.getElementById('totalOrders');
  if (totalOrdersEl) {
    totalOrdersEl.textContent = userOrders.length;
  }
}