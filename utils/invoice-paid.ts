import Stripe from 'stripe';
import { extractGolferMetadata, GolferMetadata } from './golfer-metadata';
import { PRICES } from '../data/products';
import { base, getMaxTeamNumber, isEventProcessed, markEventProcessed } from './airtable-helpers';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {apiVersion: '2025-12-15.clover'});

interface InsertedGolfer {
  id: string;
}

async function handleInvoicePaid(invoice: Stripe.Invoice, eventId?: string): Promise<void> {
  try {
      // Check if this event has already been processed (idempotency)
      if (eventId && await isEventProcessed(eventId)) {
        console.log(`Event ${eventId} already processed, skipping`);
        return;
      }

      let itemsPurchased: string[] = [];
      let donationAmount: number | undefined;
      let ccFeeAmount: number | undefined;
      let sponsorIncome: number | undefined;
      let golferMetadata: GolferMetadata[] = [];

      // Process each line item from the invoice
      for (const item of invoice.lines.data) {
          const productId = item.pricing?.price_details?.product;
          if (!productId) continue;
          const product = await stripe.products.retrieve(productId);

          if (product.name.includes("Golfer Registration")) {
              // Retrieve golfer metadata from payment intent if available
              const invoicePayments = await stripe.invoicePayments.list({ invoice: invoice.id, limit: 1 });
              const payment = invoicePayments.data[0]?.payment;
              if (payment?.payment_intent && typeof payment.payment_intent === 'string') {
                const paymentIntent = await stripe.paymentIntents.retrieve(payment.payment_intent);
                golferMetadata = extractGolferMetadata(paymentIntent.metadata);
              }
              const golferCount = golferMetadata.length || (item.quantity || 1);
              itemsPurchased.push(`${golferCount} Golfer${golferCount > 1 ? 's' : ''}`);
          } else if (product.name.includes("Donation")) {
              donationAmount = (item.amount || 0) / 100;
              itemsPurchased.push("Donation");
          } else if (product.name.includes("Hole")) {
              itemsPurchased.push("Hole Sponsor");
              sponsorIncome = PRICES.sponsorship_hole;
          } else if (product.name.includes("Dinner")) {
            itemsPurchased.push("Dinner/Lunch");
          } else if (product.name.includes("Processing Fees")) {
            itemsPurchased.push("Credit Card Fees");
            ccFeeAmount = (item.amount || 0) / 100;
          }
      }

      let insertedGolfers: InsertedGolfer[] = [];
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

      const paymentDate = new Date(invoice.created * 1000).toISOString().substring(0,10);
      // Insert into Receipts Airtable
      await base('Receipts').create({
          'Payer': invoice.customer_name || '',
          'Invoiced Amount': (invoice.amount_paid || 0) / 100,
          'Items Purchased': itemsPurchased,
          'Donation Amount': donationAmount,
          'Credit Card Fees Paid': ccFeeAmount,
          'Sponsor Income': sponsorIncome,
          'Golfers': insertedGolfers.map(g => g.id),
          'Payer Email': invoice.customer_email || '',
          'Payment Date': paymentDate,
          'Receipt Type': 'Online - Invoice',
          'Stripe Payment Amount': (invoice.amount_paid || 0) / 100
      });

      // Mark event as processed for idempotency
      if (eventId) {
        await markEventProcessed(eventId);
      }

  } catch (error) {
      console.error('Error processing invoice paid:', error);
      throw error;
  }
}

export default handleInvoicePaid;
