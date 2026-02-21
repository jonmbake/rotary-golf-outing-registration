import Stripe from 'stripe';
import { extractGolferMetadata, GolferMetadata } from './golfer-metadata';
import { PRICES } from '../data/products';
import { base, getMaxTeamNumber, isEventProcessed, markEventProcessed } from './airtable-helpers';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {apiVersion: '2025-12-15.clover'});

interface InsertedGolfer {
  id: string;
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, eventId?: string): Promise<void> {
  try {
      // Check if this event has already been processed (idempotency)
      if (eventId && await isEventProcessed(eventId)) {
        console.log(`Event ${eventId} already processed, skipping`);
        return;
      }

      // Retrieve the line items for the given Checkout Session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      const itemsPurchased: string[] = [];
      let donationAmount: number | undefined;
      let ccFeeAmount: number | undefined;
      let sponsorIncome: number | undefined;
      let golferMetadata: GolferMetadata[] = [];

      // Process each line item and prepare data for Airtable
      for (const item of lineItems.data) {
          const product = await stripe.products.retrieve(item.price?.product as string);

          if (product.name.includes("Golfer Registration")) {
              golferMetadata = extractGolferMetadata(paymentIntent.metadata);
              const golferCount = golferMetadata.length;
              itemsPurchased.push(`${golferCount} Golfer${golferCount > 1 ? 's' : ''}`);
          } else if (product.name.includes("Donation")) {
              donationAmount = (item.amount_total || 0) / 100;
              itemsPurchased.push("Donation");
          } else if (product.name.includes("Hole")) {
              itemsPurchased.push("Hole Sponsor");
              sponsorIncome = PRICES.sponsorship_hole;
          } else if (product.name.includes("Dinner")) {
            itemsPurchased.push("Dinner/Lunch");
          } else if (product.name.includes("Processing Fees")) {
            itemsPurchased.push("Credit Card Fees");
            ccFeeAmount = (item.amount_total || 0) / 100;
          }
      }

      const insertedGolfers: InsertedGolfer[] = [];
      // Insert into Golfers Airtable if necessary
      if (golferMetadata.length !== 0) {
        let golfTeamNumber = await getMaxTeamNumber();
        for (let index = 0; index < golferMetadata.length; index++) {
          const golfer = golferMetadata[index];
          golfTeamNumber = index % 4 === 0 ? ++golfTeamNumber : golfTeamNumber;
          const record = await base('Golfers').create({
              'Golfer Name': golfer.name || 'TBD',
              'Team #': golfTeamNumber,
              'Golfer Email': golfer.email,
              'Paid': 'Yes'
          });
          insertedGolfers.push({ id: record.id });
        }
      }

      const paymentDate = new Date(session.created * 1000).toISOString().substring(0,10);
      // Insert into Receipts Airtable
      await base('Receipts').create({
          'Payer': session.customer_details?.name || '',
          'Invoiced Amount': (session.amount_total || 0) / 100,
          'Items Purchased': itemsPurchased,
          'Donation Amount': donationAmount,
          'Credit Card Fees Paid': ccFeeAmount,
          'Sponsor Income': sponsorIncome,
          'Golfers': insertedGolfers.map(g => g.id),
          'Payer Email': session.customer_details?.email || '',
          'Payer Phone': session.customer_details?.phone || '',
          'Payment Date': paymentDate,
          'Receipt Type': 'Online - Credit Card',
          'Stripe Payment Amount': (session.amount_total || 0) / 100
      });

      // Mark event as processed for idempotency
      if (eventId) {
        await markEventProcessed(eventId);
      }

  } catch (error) {
      console.error('Error processing checkout session:', error);
      throw error;
  }
}

export default handleCheckoutSessionCompleted;
