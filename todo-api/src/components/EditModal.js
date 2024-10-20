import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'; // axiosをインポート
import './EditModal.css'; // EditModal専用のCSSを作成する場合

const url = 'https://sample-api.manabupanda.net/api/list'; // APIのベースURL

function EditModal({
  showModal, 
  handleClose, 
  editedText, 
  handleChange, 
  selectedContentId, // 編集対象のコンテンツIDを追加
  setContents, // contentsを更新するための関数を受け取る
  errorModalMessage,
}) {
  // Enterキーが押されたときにhandleSaveを実行
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  // 編集内容を保存
  const handleSave = async () => {
    if (editedText === "") {
      // エラーメッセージを表示
      return;
    }

    try {
      // APIにPOSTリクエストを送信
      const response = await axios.post(`${url}/${selectedContentId}`, {
        name: editedText,
      });

      // 成功したら、contentsを更新
      setContents((prevContents) =>
        prevContents.map((content) =>
          content.id === selectedContentId
            ? { ...content, content: response.data.name } // 更新した内容
            : content
        )
      );

      handleClose(); // モーダルを閉じる
    } catch (error) {
      console.error("POSTリクエストに失敗しました:", error);
      if (error.response) {
        console.error('サーバーからのエラーレスポンス:', error.response.data);
      }
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
        <Button variant="primary" onClick={handleSave}>
          保存
        </Button>
      </Modal.Footer>
    </Modal> 
  );
}

export default EditModal;
