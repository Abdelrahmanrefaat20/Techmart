# TechMart

TechMart is a full-stack e-commerce frontend built with Next.js and TypeScript. It provides a shopping experience where users browse products, explore categories and brands, manage a cart and wishlist, place orders, and manage their accounts.

## Live Demo

[View TechMart](https://easybuy-olive-nu.vercel.app/)

## Features

### Shopping
- Browse the product catalog.
- Explore products by category and brand.
- View detailed product information and image galleries.
- Add products to the shopping cart.
- Update item quantities and remove products.
- Save products to a personal wishlist.
- View cart and wishlist item counts.

### Accounts and authentication
- Register and sign in with email and password.
- Authenticate with NextAuth.js using the Credentials provider.
- Keep user sessions with JWT strategy.
- View account details and order history.
- Change the account password.
- Recover access through a forgot-password flow with reset-code verification.

### Checkout and orders
- Submit shipping details.
- Choose cash or online payment during checkout.
- View previous orders and order details.
- Track payment and delivery status.

### User experience
- Responsive layouts for desktop and mobile.
- Loading skeletons and route transitions.
- Form validation with React Hook Form and Zod.
- Toast notifications for user feedback.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | React framework and App Router |
| [React 19](https://react.dev/) | UI development |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Application state management |
| [React Redux](https://react-redux.js.org/) | React bindings for Redux |
| [NextAuth.js](https://next-auth.js.org/) | Authentication and session management |
| [React Hook Form](https://react-hook-form.com/) | Form state and handling |
| [Zod](https://zod.dev/) | Schema validation |
| [Lucide React](https://lucide.dev/) | Icons |

## API

TechMart connects to the [Route Ecommerce API](https://ecommerce.routemisr.com/) for products, categories, brands, authentication, cart, wishlist, and order operations.

Set the API base URL in your environment variables. The project reads it through `NEXT_PUBLIC_BASE_URL`.

## Getting Started

### Prerequisites

- Node.js
- npm
- An accessible Route Ecommerce API base URL

### 1. Clone the repository

```bash
git clone https://github.com/Abdelrahmanrefaat20/Techmart.git
cd Techmart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BASE_URL=https://ecommerce.routemisr.com
NEXTAUTH_SECRET=replace-with-a-long-random-secret
```

Use the API base URL supplied for your environment. Keep secrets out of version control. Do not share your `.env.local` file or commit real credentials.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project Structure

```text
Techmart/
├── public/                 # Static assets
├── src/
│   ├── app/                # App Router pages and API routes
│   │   ├── (pages)/        # Store, account, checkout and order pages
│   │   └── api/auth/       # NextAuth route handler
│   ├── components/
│   │   ├── cart/           # Cart components
│   │   ├── home/            # Home page components
│   │   ├── layout/          # Navbar, footer and product components
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # Wishlist context and cart synchronization
│   ├── interfaces/          # Domain interfaces
│   ├── lib/                 # Shared utilities and auth configuration
│   ├── providers/           # App-level providers
│   ├── redux/               # Redux store and slices
│   ├── services/             # API service methods
│   └── types/                # Shared TypeScript types
├── .env.local                # Local environment variables
├── package.json
└── README.md
```

## State Management

The project uses Redux Toolkit for shared application state, including cart-related state. Wishlist functionality uses a React Context provider to load and update the signed-in user's saved product IDs. NextAuth.js provides the authenticated session and API token.

## Authentication Notes

The sign-in flow uses NextAuth.js Credentials Provider and the Route Ecommerce API. The API token is stored in the JWT-backed session and sent with authenticated cart, wishlist, checkout, and account requests.

## Deployment

The app is configured for deployment on [Vercel](https://vercel.com/).

1. Import the GitHub repository into Vercel.
2. Add `NEXT_PUBLIC_BASE_URL` and `NEXTAUTH_SECRET` to the project's environment variables.
3. Deploy the project.
4. Confirm the API checkout return URL matches your deployed domain before using online checkout.

## Author

**Abdelrahman Refaat**

- GitHub: [@Abdelrahmanrefaat20](https://github.com/Abdelrahmanrefaat20)
- Project repository: [TechMart](https://github.com/Abdelrahmanrefaat20/Techmart)

---

Built with Next.js, TypeScript, and the Route Ecommerce API.
