require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const session = await stripe.checkout.sessions .create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      ui_mode: 'embedded', // Added for embedded checkout
      return_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`, // Changed from success_url
    });

    // Retrieve session to get client secret
    const retrievedSession = await stripe.checkout.sessions.retrieve(session.id);
    
    console.log('Session created:', {
      id: session.id,
      hasClientSecret: !!retrievedSession.client_secret
    });

    res.json({ 
      clientSecret: retrievedSession.client_secret,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Store processed event IDs to prevent duplicate processing
const processedEvents = new Set();

// Webhook to handle successful payments
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Check for duplicate events
  if (processedEvents.has(event.id)) {
    console.log(`Duplicate event received: ${event.id}`);
    return res.json({ received: true });
  }

  // Add event ID to processed set
  processedEvents.add(event.id);

  // Clean up old event IDs (keep only last 1000)
  if (processedEvents.size > 1000) {
    const oldestEvent = Array.from(processedEvents)[0];
    processedEvents.delete(oldestEvent);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment succeeded:', session.id);
        break;
      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        console.log('Session expired:', expiredSession.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});