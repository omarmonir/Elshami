const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();

// Initialize Stripe with your test key
const stripe = new Stripe("sk_test_51RHtQg2LJ7rsHnnhWpQDJIv6mGFMZdPRLcsgncqIzBXmbhajeZ8Bf6eo3gBKyRHEhrsstPG0LDZkqBANxjr8CWQj00uqZua9E1");

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5500", 
        "http://127.0.0.1:5500", 
        "http://localhost:5501", 
        "http://127.0.0.1:5501",
        "http://localhost:3000"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Payment server is running' });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Create Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
    try {
        console.log('Received checkout request:', req.body);
        
        const { cart } = req.body;

        // Validate cart data
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            console.log('Invalid cart data');
            return res.status(400).json({ 
                error: "Invalid cart data. Cart must be a non-empty array." 
            });
        }

        // Create line items for Stripe
        const lineItems = cart.map(item => {
            console.log('Processing item:', item);
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        description: `Delicious ${item.name}`,
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to cents
                },
                quantity: item.quantity,
            };
        });

        console.log('Creating Stripe session with line items:', lineItems);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: "http://127.0.0.1:5501/index.html?payment=success",
            cancel_url: "http://127.0.0.1:5501/checkout.html?payment=cancelled",
            billing_address_collection: 'required',
            metadata: {
                order_id: `order_${Date.now()}`,
            }
        });

        console.log('Stripe session created successfully:', session.id);
        res.json({ 
            url: session.url,
            sessionId: session.id 
        });

    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ 
            error: "Failed to create checkout session",
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
    console.log(`🚀 Payment server running on port ${PORT}`);
    console.log(`💳 Stripe integration ready`);
    console.log(`🌐 CORS enabled for localhost:5500, localhost:5501, and 127.0.0.1:5500, 127.0.0.1:5501`);
    console.log(`📝 Test the server: http://localhost:${PORT}/test`);
});

module.exports = app;