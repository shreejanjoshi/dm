# Digital Marketplace

This project is a digital marketplace built with Next.js 14 where users can sell and buy digital products such as images, PDFs, eBooks, and illustrations. The platform includes a user authentication system and an admin panel for approving products before they are listed for sale.

## Features

- User authentication and authorization
- Admin dashboard for managing products and users
- Product listing, details, and purchasing functionality
- Shopping cart with persistent state
- Secure checkout with Stripe integration
- Email notifications and verification

## Getting Started

### Prerequisites

- Node.js
- Yarn
- MongoDB
- Stripe account

### Installation

#### 1. Create Project

```bash
npx create-next-app@latest digitalmarket
cd digitalmarket
```

#### 2. Project Setup

```
TypeScript, ESLint, Tailwind, src directory, and app router
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
yarn add lucide-react
```

#### 3. Project Structure

```
mkdir src/components src/hooks src/config src/lib src/collections
touch src/components/MaxWidthWrapper.tsx src/components/Navbar.tsx
touch src/components/Icons.tsx src/components/NavItems.tsx src/components/NavItem.tsx
touch src/hooks/use-on-click-outside.ts src/hooks/use-auth.ts
touch src/config/index.ts src/lib/utils/price.ts src/lib/validator/account-credentials-validator.ts src/lib/validator/query-validator.ts
```

#### 4. Tailwind CSS Setup

```
rm src/app/globals.css
touch src/app/globals.css
```

#### 5. Server and Self-Hosting Setup

```
touch src/server.ts src/get-payload.ts src/next-utils.ts
yarn add express @types/express dotenv payload cross-env
```

#### 6. Admin Dashboard Setup

```
touch src/payload.config.ts src/collections/Users.ts src/collections/Products.ts
yarn add @payloadcms/richtext-slate @payloadcms/bundler-webpack @payloadcms/db-mongodb nodemon
```

#### 7. Database Setup

```
# Configure MongoDB and update .env file
```

#### 8. Authentication Setup

```
mkdir src/app/(auth) src/app/(auth)/sign-up src/app/(auth)/verify-email src/app/(auth)/sign-in
touch src/app/(auth)/sign-up/page.tsx src/app/(auth)/verify-email/page.tsx src/app/(auth)/sign-in/page.tsx
yarn add react-hook-form @hookform/resolvers zod sonner @trpc/client @trpc/next @trpc/react-query @trpc/server @tanstack/react-query
```

#### 9. tRPC Setup

```
mkdir src/trpc src/app/api/trpc src/app/api/trpc/[trpc]
touch src/trpc/client.ts src/trpc/index.ts src/trpc/trpc.ts src/app/api/trpc/[trpc]/route.ts
```

#### 10. Payment Integration with Stripe

```
yarn add stripe
touch src/lib/stripe.ts
# Configure Stripe API keys in .env file
```

#### 11. Finalizing Auth Flow and Email Verification

```
yarn add nodemailer @types/nodemailer
touch src/components/VerifyEmail.tsx
```

#### 12. Product and Order Management

```
mkdir src/collections src/components src/hooks
touch src/collections/Media.ts src/collections/ProductFile.ts src/collections/Orders.ts src/components/ProductReel.tsx src/components/ProductListing.tsx src/components/ImageSlider.tsx src/components/AddToCartButton.tsx src/components/CartItem.tsx
```

#### 13. Checkout and Payment Flow

```
touch src/trpc/payment-router.ts src/app/thank-you/page.tsx src/webhooks.ts
yarn add body-parser @react-email/components date-fns
```

#### 14. Deployment

```
yarn build
yarn add -D copyfiles
# Update package.json, tsconfig.json, server.ts for production
```

#### 15. Final Tweaks

```
touch src/components/MobileNav.tsx src/components/UserAccountNav.tsx src/utils/metadata.ts
```

# Deployment

To deploy the project, follow these steps:

## Railway.app Setup

```
# Deploy the application on Railway.app
```

## Stripe Webhooks Configuration

```
# Configure Stripe webhooks for payment notifications
```

## Build and Start

```
yarn lint
yarn build
yarn start
```

### License

This project is licensed under the MIT License.

### Acknowledgments

- Next.js
- Stripe
- Payload CMS
