# E-Shop - Modern E-commerce Platform

A modern e-commerce platform built with React, TypeScript, and Stripe integration for secure payments.

## Features

- 🛍️ Product browsing and filtering
- 🛒 Shopping cart functionality
- 💳 Secure payment processing with Stripe
- 📱 Responsive design
- 🔍 Product search
- 📦 Order management
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- A Stripe account for payment processing

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd e-shop
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Stripe publishable key:
```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

To get your Stripe publishable key:
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to Developers → API keys
3. Copy your publishable key (starts with `pk_test_` for test mode)

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Testing Payments

For testing the payment functionality, use these test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future date for expiry
- Any 3 digits for CVC

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Stripe
- Tailwind CSS
- React Query
- React Hook Form
- Zod

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Redux store and slices
├── schemas/       # Zod validation schemas
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@eshop.com or open an issue in the repository.
