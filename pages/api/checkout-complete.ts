import Stripe from 'stripe';
import Airtable from 'airtable';
import { NextApiRequest, NextApiResponse } from 'next';
import handleCheckoutSessionCompleted from '../../utils/checkout-session-completed';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {apiVersion: '2023-10-16'});
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const sig = req.headers['stripe-signature'] || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SIGNING_SECRET || '');
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