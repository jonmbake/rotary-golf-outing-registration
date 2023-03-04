import Product from "@/types/Products";

interface Selection {
  product: Product,
  quantity: number
}

interface Props {
  selectedProducts: Array<Product>
  removeProductSelection?: (product: Product) => void
}

export default function Selections ({ selectedProducts, removeProductSelection }: Props) {
  const selections: Array<Selection> = [];
  selectedProducts.forEach(product => {
    const productIndex = selections.findIndex((s: Selection) => s.product.id === product.id);
    if (productIndex === -1) {
      selections.push({product, quantity: 1})
    } else {
      ++selections[productIndex].quantity;
    }
  })
  return (
    <>
    <h4 className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-primary">Selections</span>
          <span className="badge bg-primary rounded-pill">
            {selections.length}
          </span>
        </h4>
          <ul className="list-group">
          {selections.map((s, i) => {
            return (
              <li key={s.product.displayName} className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">{s.product.displayName} ({s.quantity}x)</h6>
                  { removeProductSelection && <small className="text-muted"><button className="btn btn-link" style={{ padding: 0 }} onClick={() => removeProductSelection(s.product)}>Remove</button></small>}
                </div>
                <span className="text-muted">${s.product.price * s.quantity}</span>
              </li>
            );
          })}
          { selections.length === 0 && (
            <li className="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 className="my-0">No selections</h6>
              </div>
            </li>
          )}
          <li className="list-group-item d-flex justify-content-between">
            <span>Total</span>
            <strong>${ selectedProducts.reduce((prev, curr) => prev + curr.price, 0)}</strong>
          </li>
        </ul>
    </>
  )
}