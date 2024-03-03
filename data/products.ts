import Product from "@/types/Products";

const products : Array<Product> = [
  {
    id: 'golf_team',
    displayName: 'Golf Registration - Team',
    description: `Register as a foursome golf team for the ${process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Outing. Includes 18 holes, a cart, a box lunch, and a cookout dinner.`,
    isDisabled: (products: Array<Product>) => false,
    priceQuantity: 4,
    price: 520
  },
  {
    id: 'golf_individual',
    displayName: 'Golf Registration - Individual',
    description: `Register one or more individual golfers for the ${process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Outing. Includes 18 holes, a cart, a box lunch, and a cookout dinner.`,
    isDisabled: (products: Array<Product>) => false,
    priceQuantity: 1,
    price: 130
  },
  {
    id: 'dinner',
    displayName: 'Golf Outing - Dinner Only',
    description: `Register for the cookout dinnner at the ${process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Outing.`,
    isDisabled: (products: Array<Product>) => false,
    priceQuantity: 1,
    price: 30
  },
  {
    id: 'sponsorship_hole',
    displayName: 'Corporate Sponsorship - Hole',
    description: `Become a corporate hole sponsor for the ${process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Outing.`,
    isDisabled: (products: Array<Product>) => products.findIndex(p => p.id === 'sponsorship_hole') !== -1,
    priceQuantity: 1,
    price: 300
  },
  {
    id: 'sponsorship_other',
    displayName: 'Corporate Sponsorship - Other',
    description: `Become a corporate sponsor for the ${process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Outing.`,
    isDisabled: (products: Array<Product>) => true,
    priceQuantity: 1,
    price: 0
  },
  {
    id: 'donation',
    displayName: 'Golf Outing - Donation',
    description: `Not golfing, but still want to support the cause? Donate to the ${process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Outing.`,
    isDisabled: (products: Array<Product>) => products.findIndex(p => p.id === 'donation') !== -1,
    priceQuantity: 1,
    price: 50
  },
];

export function normalizeForCheckout (products: Array<Product>) {
  return products.reduce((acc: { [key: string]: number }, product: Product) => {
    if (product.id === 'golf_team') {
      if (acc['golf_individual']) {
        acc['golf_individual'] += 4;
      } else {
        acc['golf_individual'] = 4;
      }
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