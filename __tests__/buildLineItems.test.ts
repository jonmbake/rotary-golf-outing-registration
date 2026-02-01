import { buildLineItems } from '@/pages/api/checkout';
import { PRICES } from '@/data/products';

describe('buildLineItems', () => {
  it('generates correct line item for golf_individual', () => {
    const reqBody = {
      products: JSON.stringify({ golf_individual: 2 }),
      cover_cc_fees: false,
    };
    const result = buildLineItems(reqBody);
    expect(result).toEqual([
      { price: 'price_golfer', quantity: 2 }
    ]);
  });

  it('generates correct line item for sponsorship_hole', () => {
    const reqBody = {
      products: JSON.stringify({ sponsorship_hole: 1 }),
      cover_cc_fees: false,
    };
    const result = buildLineItems(reqBody);
    expect(result).toEqual([
      { price: 'price_hole', quantity: 1 }
    ]);
  });

  it('generates correct line item for sponsorship_cart', () => {
    const reqBody = {
      products: JSON.stringify({ sponsorship_cart: 1 }),
      cover_cc_fees: false,
    };
    const result = buildLineItems(reqBody);
    expect(result).toEqual([
      { price: 'price_cart', quantity: 1 }
    ]);
  });

  it('generates correct line item for dinner', () => {
    const reqBody = {
      products: JSON.stringify({ dinner: 1 }),
      cover_cc_fees: false,
    };
    const result = buildLineItems(reqBody);
    expect(result).toEqual([
      { price: 'price_dinner', quantity: 1 }
    ]);
  });

  it('generates correct line item for donation with dynamic amount', () => {
    const reqBody = {
      products: JSON.stringify({ donation: 75 }),
      cover_cc_fees: false,
    };
    const result = buildLineItems(reqBody);
    expect(result).toEqual([
      {
        price_data: {
          currency: 'USD',
          product: 'prod_donation',
          unit_amount: 7500, // 75 * 100 cents
        },
        quantity: 1,
      }
    ]);
  });

  it('adds CC fee line item when cover_cc_fees is true', () => {
    const reqBody = {
      products: JSON.stringify({ golf_individual: 1 }),
      cover_cc_fees: true,
    };
    const result = buildLineItems(reqBody);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ price: 'price_golfer', quantity: 1 });
    expect(result[1]).toMatchObject({
      price_data: {
        currency: 'USD',
        product: 'prod_cc_fees',
      },
      quantity: 1,
    });
    // Verify CC fee calculation: (140 * 2.9 / 0.971 + 30) rounded
    const expectedFee = Math.round(PRICES.golf_individual * 2.9 / 0.971 + 30);
    expect(result[1].price_data?.unit_amount).toBe(expectedFee);
  });

  it('combines multiple product types', () => {
    const reqBody = {
      products: JSON.stringify({
        golf_individual: 4,
        sponsorship_hole: 1,
        dinner: 1,
      }),
      cover_cc_fees: false,
    };
    const result = buildLineItems(reqBody);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({ price: 'price_golfer', quantity: 4 });
    expect(result).toContainEqual({ price: 'price_hole', quantity: 1 });
    expect(result).toContainEqual({ price: 'price_dinner', quantity: 1 });
  });

  it('calculates CC fees correctly for multiple products', () => {
    const reqBody = {
      products: JSON.stringify({
        golf_individual: 4,
        sponsorship_hole: 1,
      }),
      cover_cc_fees: true,
    };
    const result = buildLineItems(reqBody);
    // Total amount: 4*140 + 300 = 860
    const totalAmount = PRICES.golf_individual * 4 + PRICES.sponsorship_hole;
    const expectedFee = Math.round(totalAmount * 2.9 / 0.971 + 30);
    const ccFeeItem = result.find(item => item.price_data?.product === 'prod_cc_fees');
    expect(ccFeeItem?.price_data?.unit_amount).toBe(expectedFee);
  });

  it('returns empty array for empty products', () => {
    const reqBody = {
      products: JSON.stringify({}),
      cover_cc_fees: false,
    };
    const result = buildLineItems(reqBody);
    expect(result).toEqual([]);
  });
});
