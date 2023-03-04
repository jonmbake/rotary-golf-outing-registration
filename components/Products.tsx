import products from "@/data/products";
import Product from "@/types/Products";
import { useState } from "react";

interface Props {
  addProductSelection: (product: Product) => void;
  selectedProducts: Array<Product>
}
``
export default function Products({ addProductSelection, selectedProducts }: Props) {
  const [donationAmount, setDonationAmount] = useState(50);

  const onAddClick = (p: Product) => {
    if (p.id === 'donation') {
      addProductSelection({ ...p, price: donationAmount })
    } else {
      addProductSelection(p)
    }
  };

  return (
    <>
      {products.map((p) => {
        return (
          <div className="col" key={p.displayName}>
            <div className="card h-90 mb-4 rounded-3 shadow-sm">
              <div className="card-header py-3">
                <h4 className="my-0 fw-normal">{p.displayName}</h4>
              </div>
              <div className="card-body">
                <div className="card-text mb-4">{p.description}</div>
                <div className="card-title pricing-card-title">
                  { p.id === 'donation' ? (
                    <div className="input-group donation-input">
                      <span className="input-group-text">$</span>
                      <input type="number" className="form-control" placeholder="Amount" value={donationAmount} min={10} step={10} onChange={e => setDonationAmount(parseInt(e.target.value))}/>
                    </div>
                  ): '$' + p.price}
                </div>
                <button
                  type="button"
                  className="w-100 btn btn-lg btn-primary"
                  disabled={p.isDisabled(selectedProducts)}
                  onClick={() => onAddClick(p)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
