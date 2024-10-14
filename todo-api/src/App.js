import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button'; // React BootstrapのButtonコンポーネントをインポート
import Container from 'react-bootstrap/Container'; // React BootstrapのContainerコンポーネントをインポート
import Navbar from 'react-bootstrap/Navbar'; // React BootstrapのNavbarコンポーネントをインポート
import EditModal from './components/EditModal'; // 分離したEditModalコンポーネントをインポート

const url = 'https://jsonplaceholder.typicode.com/posts'; // テスト用APIのエンドポイント

function BasicExample() {
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false); // モーダル初期状態を非表示にしておく
  const [selectedContentId, setSelectedContentId] = useState(null); // 編集ボタンクリック時のidを管理
  const [editedText, setEditedText] = useState(''); // フォームの状態を管理
  const [addText, setAddText] = useState(''); // 新規ボタンクリック時のテキストの値を管理
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(true); // 保存ボタンの表示状態を管理
  const [errorMessage, setErrorMessage] = useState(''); // 新規追加時のエラーメッセージの状態を管理
  const [errorModalMessage, setModalErrorMessage] = useState(''); // 保存時のエラーメッセージの状態を管理

  // 新規追加ボタンクリック時の動作
  const onClickAdd = async () => {
    if (addText === "") {
      setErrorMessage('文字が未入力です'); // エラーメッセージを表示
      console.log('エラー: テキストボックスが空です。');
      return;
    }

    try {
      console.log('POSTリクエストを送信します...', { title: addText });

      // テスト用APIにPOSTリクエストを送信
      const response = await axios.post(url, { title: addText }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('POSTリクエスト成功:', response.data);

      // サーバーから返された新しいデータをもとにコンテンツを更新
      const newContent = {
        id: response.data.id,  // サーバーから返されるIDを使用
        content: (
          <div className="todo-item" key={response.data.id}>
            <div className="todo-text">
              <p className="todo-paragraph">{response.data.title}</p>
            </div>
            <div className="todo-buttons">
              <Button variant="primary" size="sm" onClick={() => handleEdit(response.data.id)}>
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
      console.log('新しいコンテンツが追加されました:', newContent);

      setAddText('');
      setErrorMessage(''); // エラーメッセージをクリア
    } catch (error) {
      console.error('POSTリクエストエラー:', error);

      // エラーの詳細な内容をコンソールに表示
      if (error.response) {
        console.error('サーバーからのエラー:', error.response.data);
        console.error('ステータスコード:', error.response.status);
      } else if (error.request) {
        console.error('サーバーからのレスポンスがありません:', error.request);
      } else {
        console.error('リクエストの設定エラー:', error.message);
      }

      setErrorMessage('データの追加に失敗しました。サーバーエラーが発生しました。');
    }
  };

  // 指定行をidにて判断し削除
  const handleDelete = (id) => {
    setContents(prevContents => prevContents.filter(content => content.id !== id));
  };

  // 編集ボタンクリック時の動作
  const handleEdit = (id) => {
    setShowModal(true); // モーダルを表示
    const contentToEdit = contents.find(content => content.id === id);
    if (contentToEdit) {
      const textToEdit = contentToEdit.content.props.children[0].props.children.props.children;
      setSelectedContentId(id); // 編集対象のコンテンツIDをセット
      setEditedText(textToEdit); // 編集用テキストをセット
      setIsSaveButtonVisible(true); // 初期状態でボタンの表示状態を設定
      setModalErrorMessage(''); // モーダル内のエラーメッセージをクリア
    }
  };

  // モーダルを閉じる
  const handleClose = () => setShowModal(false);

  // 編集内容を保存
  const handleSave = () => {
    if (editedText === "") {
      setModalErrorMessage('文字が未入力です'); // エラーメッセージを表示
      setIsSaveButtonVisible(false); // ボタンを非表示にする
      return;
    }
    setContents(prevContents =>
      prevContents.map(content =>
        content.id === selectedContentId
          ? {
              ...content,
              content: (
                <div className="todo-item" key={content.id}>
                  <div className="todo-text">
                    <p className="todo-paragraph">{editedText}</p>
                  </div>
                  <div className="todo-buttons">
                    <Button variant="primary" size="sm" onClick={() => handleEdit(content.id)}>
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
    setShowModal(false);
    setModalErrorMessage(''); // エラーメッセージをクリア
  };

  const handleAddTextChange = (e) => setAddText(e.target.value);

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
        handleChange={(e) => setEditedText(e.target.value)}
        handleSave={handleSave}
        isSaveButtonVisible={isSaveButtonVisible}
        errorModalMessage={errorModalMessage}
      />
    </section>
  );
}

export default BasicExample;
