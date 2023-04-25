import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {apiVersion: '2022-11-15'});

type Data = {
  name: string
}

function buildLineItems (reqBody: any) : Array<Stripe.Checkout.SessionCreateParams.LineItem> {
  const lineItems: Array<Stripe.Checkout.SessionCreateParams.LineItem> = [];

  for (const [key, value] of Object.entries<number>(JSON.parse(reqBody.products))) {
    switch (key) {
      case 'golf_individual':
        lineItems.push({
          price: process.env.PRICE_ID_GOLFER_REGISTRATION,
          quantity: value
        });
        break;
      case 'sponsorship_hole':
        lineItems.push({
          price: process.env.PRICE_ID_SPONSORSHIP_HOLE,
          quantity: 1
        });
        break;
      case 'sponsorship_cart':
        lineItems.push({
          price: process.env.PRICE_ID_SPONSORSHIP_CART,
          quantity: 1
        });
        break;
      case 'donation':
        lineItems.push({
          price_data: {
            currency: 'USD',
            product: process.env.PRODUCT_ID_DONATION,
            unit_amount: value * 100
          },
          quantity: 1
        });
        break;
    }
  }

  return lineItems; 
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const metadata = Object.keys(req.body)
      .filter(key => key.startsWith('golfer'))
      .reduce((cur, key) => { return Object.assign(cur, { [key]: req.body[key] })}, {});
    const customFields: Array<Stripe.Checkout.SessionCreateParams.CustomField> = [];
    if (Object.keys(JSON.parse(req.body.products)).find(key => key.startsWith('sponsorship'))) {
      customFields.push(
        {
          key: 'companyname',
          label: {type: 'custom', custom: 'Sponsorship Company Name'},
          type: 'text',
        },
      );
    }
    const session = await stripe.checkout.sessions.create({
      line_items: buildLineItems(req.body),
      mode: 'payment',
      payment_intent_data: {
        metadata
      },
      phone_number_collection: {
        enabled: true,
      },
      invoice_creation: {
        enabled: true
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
      custom_fields: customFields,
    });
    if (session.url == null) {
      res.status(500);
    } else {
      res.redirect(303, session.url);
    }
  } else {
    // return unsupported method response
    res.status(405);
  }
}