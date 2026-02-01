const requiredEnvVars = [
  'STRIPE_API_KEY',
  'STRIPE_WEBHOOK_SIGNING_SECRET',
  'PRICE_ID_GOLFER_REGISTRATION',
  'PRICE_ID_SPONSORSHIP_HOLE',
  'PRICE_ID_SPONSORSHIP_CART',
  'PRICE_ID_DINNER',
  'PRODUCT_ID_DONATION',
  'PRODUCT_ID_CREDIT_CARD_PROCESSING_FEES',
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'NEXT_PUBLIC_DOMAIN_NAME',
  'NEXT_PUBLIC_GOLF_OUTING_YEAR',
  'NEXT_PUBLIC_GOLF_OUTING_DATE',
  'NEXT_PUBLIC_GOLF_OUTING_LOCATION',
  'NEXT_PUBLIC_REGISTRATION_OPEN',
  'NEXT_PUBLIC_CONTACT_EMAIL',
  'NEXT_PUBLIC_CONTACT_NAME',
] as const;

let validated = false;

export function validateEnv(): void {
  if (validated) return;

  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  validated = true;
}
