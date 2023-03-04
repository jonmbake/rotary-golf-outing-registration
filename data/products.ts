import Product from "@/types/Products";

const products : Array<Product> = [
  {
    id: 'golf_team',
    displayName: 'Golf Registration - Team',
    description: 'Register as a foursome golf team for the 2023 Golf Outing.',
    isDisabled: (products: Array<Product>) => products.findIndex(p => p.id.startsWith('golf')) !== -1,
    priceQuantity: 4,
    price: 520
  },
  {
    id: 'golf_individual',
    displayName: 'Golf Registration - Individual',
    description: 'Register one or more individual golfers for the 2023 Golf Outing.',
    isDisabled: (products: Array<Product>) => products.findIndex(p => p.id.startsWith('golf_team')) !== -1 || products.filter(p => p.id === 'golf_individual').length >= 4,
    priceQuantity: 1,
    price: 130
  },
  {
    id: 'sponsorship_hole',
    displayName: 'Company Sponsorship - Hole',
    description: 'Become a corporate hole sponsor for the 2023 Golf Outing.',
    isDisabled: (products: Array<Product>) => products.findIndex(p => p.id === 'sponsorship_hole') !== -1,
    priceQuantity: 1,
    price: 300
  },
  {
    id: 'sponsorship_cart',
    displayName: 'Company Sponsorship - Cart',
    description: 'Become a corporate cart sponsor for the 2023 Golf Outing.',
    isDisabled: (products: Array<Product>) => products.findIndex(p => p.id === 'sponsorship_cart') !== -1,
    priceQuantity: 1,
    price: 1000
  },
  {
    id: 'donation',
    displayName: 'Golf Outing - Donation',
    description: 'Not golfing, but still want to support the cause? Donate to the 2023 Golf Outing.',
    isDisabled: (products: Array<Product>) => products.findIndex(p => p.id === 'donation') !== -1,
    priceQuantity: 1,
    price: 50
  },
];

export function normalizeForCheckout (products: Array<Product>) {
  return products.reduce((acc: { [key: string]: number }, product: Product) => {
    if (product.id === 'golf_team') {
      acc['golf_individual'] = 4;
    } else if (product.id === 'donation') {
      acc[product.id] = product.price;
    } else if (acc[product.id] == null) {
      acc[product.id] = 1;
    } else {
      acc[product.id] += 1;
    }
    return acc;
  }, {});
}

export default products;