import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './EditModal.css'; // EditModal専用のCSSを作成する場合

function EditModal({
  showModal, 
  handleClose, 
  editedText, 
  handleChange, 
  handleSave, 
  isSaveButtonVisible, 
  errorModalMessage
}) {
    // Enterキーが押されたときにhandleSaveを実行
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSave();
      }
    };
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>編集</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input
            type="text"
            value={editedText}
            onChange={handleChange}
            onKeyDown={handleKeyDown} 
            className="edit-modal-input"
          />
          {errorModalMessage && <p className="error-message">{errorModalMessage}</p>}
        </div>
 </Modal.Body>
  <Modal.Footer>
       <Button variant="secondary" onClick={handleClose}>
      閉じる
  </Button>
   {isSaveButtonVisible && (
          <Button variant="primary" onClick={handleSave}>
            保存
          </Button>
        )}
      </Modal.Footer>
    </Modal> 
  );
}

export default EditModal;
