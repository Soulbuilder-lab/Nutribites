document.addEventListener('DOMContentLoaded', () => {
  const orderId = localStorage.getItem('lastOrderId') || '#NB-LUX-12345';
  const amount = localStorage.getItem('lastOrderAmount') || '0.00';
  
  document.getElementById('orderId').textContent = orderId;
  document.getElementById('orderAmount').textContent = 'RM' + amount;
  
  // Clear temporary data
  localStorage.removeItem('lastOrderId');
  localStorage.removeItem('lastOrderAmount');
});