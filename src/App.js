import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import React, { useState } from 'react';
import './App.css'; //cssをインポート
import Button from 'react-bootstrap/Button'; // React BootstrapのButtonコンポーネントをインポート
import Container from 'react-bootstrap/Container'; // React BootstrapのContainerコンポーネントをインポート
import Navbar from 'react-bootstrap/Navbar'; // React BootstrapのNavbarコンポーネントをインポート
import EditModal from './components/EditModal'; // 分離したEditModalコンポーネントをインポート
import axios from 'axios'; // Axiosをインポート

const url = 'https://sample-api.manabupanda.net/api/list'; // テスト用APIのエンドポイント

function BasicExample() {
  const [contents, setContents] = useState([]); // 新規追加後のモーダルを開いた時の状態を管理
  const [showModal, setShowModal] = useState(false); // モーダル初期状態を非表示にしておく
  const [selectedContentId, setSelectedContentId] = useState(null); // 編集ボタンクリック時のidを管理
  const [editedText, setEditedText] = useState(''); // フォームの状態を管理
  const [addText, setAddText] = useState(''); // 新規ボタンクリック時のテキストの値を管理
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(true); // 保存ボタンの表示状態を管理
  const [errorMessage, setErrorMessage] = useState(''); // 新規追加時のエラーメッセージの状態を管理
  const [errorModalMessage, setModalErrorMessage] = useState(''); // 保存時のエラーメッセージの状態を管理
  const [displayedId, setDisplayedId] = useState(null); // 表示用のIDを管理


  // 新規追加ボタンクリック時の動作
  const onClickAdd = async () => {
    if (addText === "") {
      setErrorMessage('文字が未入力です'); 
      return;
    }

    const id = Date.now(); // クライアント側で一意のIDを生成

    try {
      const response = await axios.post(url, {
        id: id,
        name: addText,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const newContent = {
        id: response.data.id, 
        name: response.data.name,
        content: (
          <div className="todo-item" key={response.data.id}>
            <div className="todo-text">
              <p className="todo-paragraph">{response.data.name}</p>
            </div>
            <div className="todo-buttons">
              <Button variant="primary" size="sm" onClick={() => handleEdit(response.data.id, response.data.name)}>
                編集
              </Button>{' '}
              <Button onClick={() => handleDelete(response.data.id)} variant="danger" size="sm">
                削除
              </Button>
            </div>
          </div>
        ),
      };

      setContents([...contents, newContent]);
      setAddText(''); 
      setErrorMessage(''); 

    } catch (error) {
      console.error('POSTリクエストエラー:', error);
    }
  };

  // 削除ボタンクリック時の動作
  const handleDelete = async (id) => {
    try {
      const deleteUrl = `${url}/${id}`;
      const response = await axios.delete(deleteUrl);
      console.log('DELETEリクエスト成功:', response.data);

      setContents(prevContents => prevContents.filter(content => content.id !== id));
    } catch (error) {
      console.error('DELETEリクエストに失敗しました:', error);
    }
  };

  // 編集ボタンクリック時の動作
  const handleEdit = (id, name) => {
    console.log('編集対象のID:', id); 
    console.log('編集対象の名前:', name); 
    setEditedText(name); 
    setDisplayedId(id); 
    setShowModal(true);
    setSelectedContentId(id); 

    const contentToEdit = contents.find(content => content.id === id);
    if (contentToEdit) {
      setIsSaveButtonVisible(true); 
      setModalErrorMessage(""); 
    }
  };

  // モーダルを閉じる
  const handleClose = () => setShowModal(false);

  // 編集内容を保存
  const handleSave = async () => {

    if (editedText === "") {
      setModalErrorMessage('文字が未入力です'); 
      return;
    }

    try {
      const response = await axios.post(`${url}/${displayedId}`, {
        name: editedText,
      });

      console.log("サーバーからのレスポンス:", response.data); // レスポンス内容をコンソール表示

      setContents(prevContents =>
        prevContents.map(content =>
          content.id === selectedContentId
            ? {
                ...content,
                name: response.data.name,
                content: (
                  <div className="todo-item" key={content.id}>
                    <div className="todo-text">
                      <p className="todo-paragraph">{response.data.name}</p>
                    </div>
                    <div className="todo-buttons">
                      <Button variant="primary" size="sm" onClick={() => handleEdit(content.id, response.data.name)}>
                        編集
                      </Button>{' '}
                      <Button onClick={() => handleDelete(content.id)} variant="danger" size="sm">
                        削除
                      </Button>
                    </div>
                  </div>
                )
              }
            : content
        )
      );

      setEditedText(''); // 編集テキストの入力内容をクリア
      handleClose(); 
    } catch (error) {
      console.error('POSTリクエストに失敗しました:', error);
    }
  };

  // 新規追加時のテキストボックスの入力に応じてエラーメッセージをクリア
  const handleAddTextChange = (e) => {
    setAddText(e.target.value);
    if (e.target.value !== "") {
      setErrorMessage(''); 
    }
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    setEditedText(newText);
    if (newText !== "") {
      setModalErrorMessage(''); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onClickAdd();
    }
  };

  return (
    <section>
      <Navbar className="custom-navbar bg-body-tertiary" expand="lg">
        <Container className="navbar-container">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        </Container>
      </Navbar>
      <div className="add-section">
        <div className="input-container">
          <input
            type='text'
            value={addText}
            onChange={handleAddTextChange}
            onKeyPress={handleKeyPress}
            className="add-input"
          />
        </div>
        <Button onClick={onClickAdd} variant="info">新規追加</Button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="todos-container">
        <div className="todos-header">Todos</div>
        {contents.map((content) => (
          <div key={content.id}>
            {content.content}
          </div>
        ))}
      </div>

      <EditModal
        showModal={showModal}
        handleClose={handleClose}
        editedText={editedText}
        handleChange={handleChange}
        selectedContentId={selectedContentId}
        setContents={setContents}
        handleSave={handleSave}
        isSaveButtonVisible={isSaveButtonVisible}
        errorModalMessage={errorModalMessage}
      />
    </section>
  );
}

export default BasicExample;
