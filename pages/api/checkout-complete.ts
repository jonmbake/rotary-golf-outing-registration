import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import handleCheckoutSessionCompleted from '../../utils/checkout-session-completed';
import { Readable } from 'stream';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {apiVersion: '2023-10-16'});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }

  const sig = req.headers['stripe-signature'] || '';

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SIGNING_SECRET || '');
  } catch (err) {
    console.error('Error while attempting to construct webhook', err)
    res.status(400);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutSessionCompleted(session);
    } catch (error) {
      console.error('Error handling checkout session completed:', error);
      res.status(500);
      return;
    }
  }

  res.writeHead(200);
  res.end('Received webhook');
}