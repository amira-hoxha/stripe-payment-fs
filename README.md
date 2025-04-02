# Stripe payment demo with Embedded Checkout

A demo implementation of Stripe payment using Node.js for the backend and React for the frontend.

## Getting Started

Follow the steps below to set up and run the project.

---

## Backend Setup

### 1. Install Dependencies
Navigate to the backend directory and install the required Node modules:
```sh
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory and add the following:
```env
STRIPE_SECRET_KEY=sk_test_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret
PORT=3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_publishable_key
```

### 3. Start the Backend Server
Run the following command to start the backend server:
```sh
node server.js
```

### 4. Listen for Stripe Webhooks
Run the following command to forward Stripe webhook events to your local server:
```sh
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```
After running the command, update your `.env` file with the new `STRIPE_WEBHOOK_SECRET` value.

---

## Frontend Setup

### 1. Install Dependencies
Navigate to the frontend directory and install the required Node modules:
```sh
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the `frontend` directory and add the following:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 3. Start the Frontend Server
Run the following command to start the frontend development server:
```sh
npm run dev
```

---

## Notes
- Ensure you replace the placeholder Stripe keys with your actual keys from the Stripe dashboard.
- The `stripe listen` command helps capture webhook events in development. Be sure to replace the `STRIPE_WEBHOOK_SECRET` value in your `.env` file after running the command.

Happy coding! 🚀
