import Product from '@/types/Products';
import React from 'react';

interface FeeCoverModalProps {
  show: boolean;
  selectedProducts: Array<Product>;
  onClose: () => void;
  onConfirm: (coverFees: boolean) => void;
}

const FeeCoverModal: React.FC<FeeCoverModalProps> = ({ show, selectedProducts, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  const feeAmount = Math.round(selectedProducts.reduce((prev, curr) => prev + curr.price, 0) * 2.9 / 0.971 + 30) / 100;

  return (
    <>
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cover Credit Card Processing Fees?</h5>
            <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
            </button>
          </div>
          <div className="modal-body text-start">
            <p>Would you like to cover the credit card processing fee of <span className='fw-bold'>${feeAmount}</span> so that 100% of your registration fee goes towards supporting our Rotary Club&apos;s initiatives?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => onConfirm(false)}>
              No
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onConfirm(true)}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default FeeCoverModal;
