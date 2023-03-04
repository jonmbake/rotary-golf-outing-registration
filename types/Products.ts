export default interface Product {
  id: string;
  displayName: string;
  description: string;
  priceQuantity: number;
  isDisabled: (products: Array<Product>) => boolean,
  price: number;
}