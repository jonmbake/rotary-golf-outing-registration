// Set mock environment variables before tests run
process.env.STRIPE_API_KEY = 'sk_test_mock_key';
process.env.STRIPE_WEBHOOK_SIGNING_SECRET = 'whsec_mock';
process.env.PRICE_ID_GOLFER_REGISTRATION = 'price_golfer';
process.env.PRICE_ID_SPONSORSHIP_HOLE = 'price_hole';
process.env.PRICE_ID_SPONSORSHIP_CART = 'price_cart';
process.env.PRICE_ID_DINNER = 'price_dinner';
process.env.PRODUCT_ID_DONATION = 'prod_donation';
process.env.PRODUCT_ID_CREDIT_CARD_PROCESSING_FEES = 'prod_cc_fees';
process.env.AIRTABLE_API_KEY = 'mock_airtable_key';
process.env.AIRTABLE_BASE_ID = 'mock_base_id';
process.env.NEXT_PUBLIC_DOMAIN_NAME = 'http://localhost:3000';
