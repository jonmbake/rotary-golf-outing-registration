import { normalizeForCheckout } from '@/data/products';
import Product from '@/types/Products';

const createProduct = (overrides: Partial<Product>): Product => ({
  id: 'test',
  displayName: 'Test Product',
  description: 'Test description',
  priceQuantity: 1,
  isDisabled: () => false,
  price: 100,
  ...overrides,
});

describe('normalizeForCheckout', () => {
  it('converts golf_team to 4 golf_individual', () => {
    const products = [createProduct({ id: 'golf_team', price: 560 })];
    const result = normalizeForCheckout(products);
    expect(result).toEqual({ golf_individual: 4 });
  });

  it('combines golf_team and golf_individual correctly', () => {
    const products = [
      createProduct({ id: 'golf_team', price: 560 }),
      createProduct({ id: 'golf_individual', price: 140 }),
    ];
    const result = normalizeForCheckout(products);
    expect(result).toEqual({ golf_individual: 5 });
  });

  it('stores donation price as value', () => {
    const products = [createProduct({ id: 'donation', price: 75 })];
    const result = normalizeForCheckout(products);
    expect(result).toEqual({ donation: 75 });
  });

  it('counts multiple of same product type', () => {
    const products = [
      createProduct({ id: 'golf_individual', price: 140 }),
      createProduct({ id: 'golf_individual', price: 140 }),
      createProduct({ id: 'golf_individual', price: 140 }),
    ];
    const result = normalizeForCheckout(products);
    expect(result).toEqual({ golf_individual: 3 });
  });

  it('combines multiple product types correctly', () => {
    const products = [
      createProduct({ id: 'golf_team', price: 560 }),
      createProduct({ id: 'sponsorship_hole', price: 300 }),
      createProduct({ id: 'dinner', price: 30 }),
      createProduct({ id: 'donation', price: 100 }),
    ];
    const result = normalizeForCheckout(products);
    expect(result).toEqual({
      golf_individual: 4,
      sponsorship_hole: 1,
      dinner: 1,
      donation: 100,
    });
  });

  it('returns empty object for empty products array', () => {
    const result = normalizeForCheckout([]);
    expect(result).toEqual({});
  });
});
