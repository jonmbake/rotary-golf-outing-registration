# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Online registration website for the Madison West Middleton Rotary Golf Outing. Built with Next.js (Pages Router) using Stripe for payment processing and Airtable for data storage.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

### Payment Flow
1. User selects products on home page → stored in `sessionStorage`
2. `/checkout` page collects golfer information
3. Form POST to `/api/checkout` creates Stripe Checkout session with line items
4. After payment, Stripe webhook hits `/api/checkout-complete`
5. `utils/checkout-session-completed.js` processes the webhook: creates Golfer records and Receipt in Airtable

### Key Files
- `data/products.ts` - Product definitions with pricing and validation logic
- `pages/api/checkout.ts` - Creates Stripe Checkout session, validates input with Joi
- `pages/api/checkout-complete.ts` - Stripe webhook endpoint
- `utils/checkout-session-completed.js` - Airtable record creation after payment

### Environment Variables Required
- `STRIPE_API_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SIGNING_SECRET` - For webhook verification
- `PRICE_ID_*` - Stripe Price IDs for each product type
- `PRODUCT_ID_*` - Stripe Product IDs for dynamic pricing (donations, CC fees)
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` - Airtable credentials
- `NEXT_PUBLIC_DOMAIN_NAME` - Site URL for redirects
- `NEXT_PUBLIC_GOLF_OUTING_YEAR` - Display year in product descriptions
