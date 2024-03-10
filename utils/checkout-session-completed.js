async function handleCheckoutSessionCompleted(session) {
  try {
      // Retrieve the line items for the given Checkout Session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
      let itemsPurchased = [];
      let donationAmount;
      let golferMetadata = [];
      let golferCount = 0;

      // Process each line item and prepare data for Airtable
      for (const item of lineItems.data) {
          const product = await stripe.products.retrieve(item.price.product);

          if (product.name.includes("Golfer Registration")) {
              golferCount++; // Increment golfer count for each Golfer Registration found
              golferMetadata.push(...extractGolferMetadata(paymentIntent.metadata));
          } else if (product.name.includes("Donation")) {
              donationAmount = item.amount_total / 100; // assuming amount_total is in cents
              itemsPurchased.push("Donation");
          } else if (product.name.includes("Hole")) {
              itemsPurchased.push("Hole Sponsor");
          }
      }

      // Update itemsPurchased based on the golfer count
      if (golferCount > 0) {
          itemsPurchased.push(`${golferCount} Golfer${golferCount > 1 ? 's' : ''}`);
      }

      let insertedGolfers = [];
      // Insert into Golfers Airtable if necessary
      if (golferMetadata.length !== 0) {
        let golfTeamNumber = await getMaxTeamNumber();
        for (const [index, golfer] of golferMetadata.entries()) {
          golfTeamNumber = index % 4 === 0 ? ++golfTeamNumber : golfTeamNumber;
          insertedGolfers.push(await base('Golfers').create({
              'Golfer Name': golfer.name,
              'Team #': golfTeamNumber,
              'Golfer Email': golfer.email,
              'Paid': 'Yes'
          }));
        }
      }

      const paymentDate = new Date(session.created * 1000).toISOString().substring(0,10);
      // Insert into Receipts Airtable
      await base('Receipts').create({
          'Payer': session.customer_details.name,
          'Invoiced Amount': session.amount_total / 100,
          'Items Purchased': itemsPurchased,
          'Donation Amount': donationAmount,
          'Golfers': insertedGolfers.map(g => g.id),
          'Payer Email': session.customer_details.email,
          'Payer Phone': session.customer_details.phone,
          'Payment Date': paymentDate,
          'Receipt Type': 'Online - Credit Card',
          'Stripe Payment Amount': session.amount_total / 100 // assuming amount_total is in cents
      });


  } catch (error) {
      console.error('Error processing checkout session:', error);
      // Handle the error appropriately
  }
}

function extractGolferMetadata(metadata) {
  // Assuming metadata contains golfer info like golfer1_name, golfer1_email, etc.
  const golferMetadata = [];
  Object.keys(metadata).forEach(key => {
      if (key.startsWith('golfer')) {
          const match = /golfer(\d+)_(name|email)/.exec(key);
          if (match) {
              const index = parseInt(match[1], 10) - 1;
              golferMetadata[index] = golferMetadata[index] || {};
              golferMetadata[index][match[2]] = metadata[key];
          }
      }
  });
  return golferMetadata;
}

async function getMaxTeamNumber() {
  let maxTeamNumber = 0;

  // Fetch all records from the "Golfers" table and iterate through them
  await base('Golfers').select({
    // You can specify filters and fields if necessary, to optimize data retrieval
    fields: ['Team #']
  }).eachPage((records, fetchNextPage) => {
    records.forEach(record => {
      const teamNumber = parseInt(record.get('Team Number'), 10);
      if (teamNumber > maxTeamNumber) {
        maxTeamNumber = teamNumber;
      }
    });
    fetchNextPage();
  });

  return maxTeamNumber;
}

export default handleCheckoutSessionCompleted;