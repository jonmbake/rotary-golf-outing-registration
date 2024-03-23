"use client";

import Product from "@/types/Products";
import { normalizeForCheckout } from '@/data/products';
import { useEffect, useRef, useState } from "react";
import Products from "./Products";
import Selections from "./Selections";
import { useRouter } from 'next/router';
import FeeCoverModal from "./FeeCoverModal";

export default function ProductsSelections() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);
  const [showFeeCoverDialog, setShowFeeCoverDialog] = useState<boolean>(false);
  const [coverFeesSelection, setCoverFeesSelection] = useState<boolean | null>(null);
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

  useEffect(() => {
    if (coverFeesSelection != null) {
      if (selectedProducts.findIndex(p => p.id.startsWith('golf')) === -1) {
        formRef.current && formRef.current.submit();
      } else {
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/checkout?cover_cc_fees=${coverFeesSelection}`);
      }
    }
  }, [router, selectedProducts, coverFeesSelection]);

  let continueButtonClassNames = "w-100 btn btn-secondary btn-lg ";
  if (selectedProducts.length === 0) {
    continueButtonClassNames += "disabled-link";
  }
  let continueMessage = "";
  if (selectedProducts.length === 0) {
    continueMessage = "Make a selection to continue";
  } else if (selectedProducts.findIndex(p => p.id.startsWith('golf')) > -1) {
    continueMessage = "Next step: Add Golfer Information";
  } else {
    continueMessage = "Next step: Review and Pay";
  }

  return (
    <div className="row">
       <form ref={formRef} action={ process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/checkout' } method="post">
        <input type="hidden" name="products" value={JSON.stringify(normalizeForCheckout(selectedProducts))} />
        <input type="hidden" name="cover_cc_fees" value={coverFeesSelection?.toString() || "false"} />
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
        <button className={continueButtonClassNames} onClick={ () => setShowFeeCoverDialog(true) }>Continue</button>
        <div className="form-text mb-5 text-start">{continueMessage}</div>
      </div>
      <FeeCoverModal show={showFeeCoverDialog} selectedProducts={selectedProducts} onClose={() => setShowFeeCoverDialog(false)} onConfirm={coverFees => setCoverFeesSelection(coverFees) } />
    </div>
  );
}
