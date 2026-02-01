import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import Joi from 'joi';
import { PRICES } from '@/data/products';
import { validateEnv } from '@/utils/env';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', { apiVersion: '2025-12-15.clover' });

type Data = {
  name?: string;
  error?: string;
}

// Define a schema for product input validation
const productSchema = Joi.object({
  golf_individual: Joi.number().integer().min(0),
  sponsorship_hole: Joi.number().valid(1).optional(),
  sponsorship_cart: Joi.number().valid(1).optional(),
  dinner: Joi.number().valid(1).optional(),
  donation: Joi.number().integer().min(0).optional(),
}).or('golf_individual', 'sponsorship_hole', 'sponsorship_cart', 'dinner', 'donation');

// Define a schema for the request body validation
const requestBodySchema = Joi.object({
  products: Joi.string().required(),
  cover_cc_fees: Joi.boolean().required(),
  // Allow any keys starting with 'golfer'
}).pattern(/^golfer\d+_(name|email)$/, Joi.string().allow(''));

export function buildLineItems(reqBody: any): Array<Stripe.Checkout.SessionCreateParams.LineItem> {
  const lineItems: Array<Stripe.Checkout.SessionCreateParams.LineItem> = [];
  const products = JSON.parse(reqBody.products);

  let lineItemAmount = 0;
  for (const [key, value] of Object.entries<number>(products)) {
    switch (key) {
      case 'golf_individual':
        lineItems.push({
          price: process.env.PRICE_ID_GOLFER_REGISTRATION!,
          quantity: value
        });
        lineItemAmount += PRICES.golf_individual * value;
        break;
      case 'sponsorship_hole':
        lineItems.push({
          price: process.env.PRICE_ID_SPONSORSHIP_HOLE!,
          quantity: 1
        });
        lineItemAmount += PRICES.sponsorship_hole;
        break;
      case 'sponsorship_cart':
        lineItems.push({
          price: process.env.PRICE_ID_SPONSORSHIP_CART!,
          quantity: 1
        });
        lineItemAmount += PRICES.sponsorship_cart;
        break;
      case 'dinner':
        lineItems.push({
          price: process.env.PRICE_ID_DINNER!,
          quantity: 1
        });
        lineItemAmount += PRICES.dinner;
        break;
      case 'donation':
        lineItems.push({
          price_data: {
            currency: 'USD',
            product: process.env.PRODUCT_ID_DONATION!,
            unit_amount: value * 100
          },
          quantity: 1
        });
        lineItemAmount += value;
        break;
    }
  }

  if (reqBody.cover_cc_fees) {
    lineItems.push({
      price_data: {
        currency: 'USD',
        product: process.env.PRODUCT_ID_CREDIT_CARD_PROCESSING_FEES!,
        unit_amount: Math.round(lineItemAmount * 2.9 / 0.971 + 30)
      },
      quantity: 1
    });
  }

  return lineItems;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  validateEnv();

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Validate the request body
    const { value, error } = requestBodySchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // Further validate the products data
    const products = JSON.parse(value.products);
    const productValidation = productSchema.validate(products);
    if (productValidation.error) {
      res.status(400).json({ error: productValidation.error.details[0].message });
      return;
    }

    // Validate golfer count matches product quantity
    const expectedGolfers = products.golf_individual || 0;
    const providedGolfers = Object.keys(req.body).filter(k => /^golfer\d+_name$/.test(k)).length;
    if (providedGolfers < expectedGolfers) {
      res.status(400).json({ error: `Expected ${expectedGolfers} golfer names, got ${providedGolfers}` });
      return;
    }

    const metadata = Object.keys(req.body)
      .filter(key => key.startsWith('golfer'))
      .reduce((cur, key) => ({ ...cur, [key]: req.body[key] }), {});
    const customFields: Array<Stripe.Checkout.SessionCreateParams.CustomField> = [];
    if (Object.keys(products).find(key => key.startsWith('sponsorship'))) {
      customFields.push({
        key: 'companyname',
        label: { type: 'custom', custom: 'Sponsorship Company Name' },
        type: 'text',
      });
    }
    const session = await stripe.checkout.sessions.create({
      line_items: buildLineItems(value),
      mode: 'payment',
      payment_intent_data: {
        metadata
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
      custom_fields: customFields,
    });

    if (!session.url) {
      res.status(500).json({ error: 'Failed to create Stripe session' });
      return;
    }

    res.redirect(303, session.url);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
