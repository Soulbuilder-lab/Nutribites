// server.js
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes: HTML Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'public/cart.html')));
app.get('/success', (req, res) => res.sendFile(path.join(__dirname, 'public/success.html')));
app.get('/cancel', (req, res) => res.sendFile(path.join(__dirname, 'public/cancel.html')));

// Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, hasDiscount } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid.' });
    }

    // Calculate prices with optional 20% discount
    const line_items = items.map(item => {
      let unitAmount = Math.round(parseFloat(item.price || 0) * 100);
      
      // Apply 20% discount if user is logged in
      if (hasDiscount) {
        unitAmount = Math.round(unitAmount * 0.80); // 20% off
      }
      
      return {
        price_data: {
          currency: 'myr', // Changed to MYR for Malaysia
          product_data: {
            name: item.title || item.name || 'Product',
            images: item.image ? [item.image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: parseInt(item.quantity, 10) || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `https://nutribites-4051.onrender.com/success`,
      cancel_url: `https://nutribites-4051.onrender.com/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message || 'Checkout failed' });
  }
});