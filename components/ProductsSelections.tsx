"use client";

import Product from "@/types/Products";
import { normalizeForCheckout } from '@/data/products';
import { useEffect, useRef, useState } from "react";
import Products from "./Products";
import Selections from "./Selections";
import Link from "next/link";

export default function ProductsSelections() {
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const addProductSelection = (product: Product) =>
    setSelectedProducts((prev) => {
      const s = [...prev, product];
      window.sessionStorage.setItem("selections", JSON.stringify(s));
      return s;
    });
  const removeProductSelection = (product: Product) =>
    setSelectedProducts((prev) => {
      const s = prev.filter(
        (prevSelectedProducts) =>
          prevSelectedProducts.displayName !== product.displayName
      );
      window.sessionStorage.setItem("selections", JSON.stringify(s));
      return s;
    });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = window.sessionStorage.getItem("selections");
      if (s) {
        setSelectedProducts(JSON.parse(s));
      }
    }
  }, []);

  let linkClassName = "w-100 btn btn-secondary btn-lg ";
  if (selectedProducts.length === 0) {
    linkClassName += "disabled-link";
  }
  let continueMessage = "";
  if (selectedProducts.length === 0) {
    continueMessage = "Make a selection to continue";
  } else if (selectedProducts.findIndex(p => p.id.startsWith('golf')) > -1) {
    continueMessage = "Next step: Add Golfer Information";
  } else {
    continueMessage = "Next step: Review and Pay";
  }

  function onContinueClick(e: { preventDefault: () => void; }) {
    if (selectedProducts.findIndex(p => p.id.startsWith('golf')) === -1) {
      e.preventDefault();
      formRef.current && formRef.current.submit();
    }
  }

  return (
    <div className="row">
       <form ref={formRef} action={ process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/checkout' } method="post">
        <input type="hidden" name="products" value={JSON.stringify(normalizeForCheckout(selectedProducts))} />
      </form>
      <div className="col-md-5 col-lg-4 order-md-last mb-3">
        <Selections
          selectedProducts={selectedProducts}
          removeProductSelection={removeProductSelection}
        />
      </div>
      <div className="row row-cols-1 row-cols-md-3 col-md-7 col-lg-8 text-center">
        <Products
          addProductSelection={addProductSelection}
          selectedProducts={selectedProducts}
        />
        <Link
          className={linkClassName}
          title={
            selectedProducts.length === 0
              ? "Make a selection to continue"
              : "Continue"
          }
          onClick={onContinueClick}
          href={{
            pathname: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/checkout`,
          }}
        >
          Continue
        </Link>
        <div className="form-text mb-5 text-start">{continueMessage}</div>
      </div>
    </div>
  );
}
