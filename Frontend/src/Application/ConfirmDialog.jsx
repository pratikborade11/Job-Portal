// ConfirmDialog.js
import React from 'react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal">
      <div className="modal-content">
        <h6>Are you sure want to Delete Application?</h6>
        <div className="yes-no-btn">
        <button onClick={onConfirm} className="delete-btn">Yes</button>
        <button onClick={onClose} className="cancel-btn">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
