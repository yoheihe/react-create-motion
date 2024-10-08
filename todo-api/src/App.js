import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import React, { useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'; // React BootstrapのButtonコンポーネントをインポート
import Container from 'react-bootstrap/Container'; // React BootstrapのContainerコンポーネントをインポーレート
import Navbar from 'react-bootstrap/Navbar'; // React BootstrapのNavbarコンポーネントをインポート
import EditModal from './components/EditModal'; // 分離したEditModalコンポーネントをインポート

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
  const onClickAdd = () => {
    if (addText === "") {
      setErrorMessage('文字が未入力です'); // エラーメッセージを表示
      return;
    }
    const id = Date.now();  // 一意のIDを生成
    const newContent = {
      id,
      content: (
        <div className="todo-item" key={id}>
          <div className="todo-text">
            <p className="todo-paragraph">{addText}</p>
          </div>
          <div className="todo-buttons">
            <Button variant="primary" size="sm" onClick={() => handleEdit(id)}>
              編集
            </Button>{' '}
            <Button onClick={() => handleDelete(id)} variant="danger" size="sm">
              削除
            </Button>
          </div>
        </div>
      )
    };
    setContents([...contents, newContent]);
    setAddText('');
    setErrorMessage(''); // エラーメッセージをクリア
  };

  // 指定行をidにて判断しを削除
  const handleDelete = (id) => {
    setContents(prevContents => prevContents.filter(content => content.id !== id));
  };

  // 編集ボタンクリック時の動作
  const handleEdit = (id) => {
    console.log('OK');
    setShowModal(true); // モーダルを表示
    const contentToEdit = contents.find(content => content.id === id);
    if (contentToEdit) {
      // JSXからテキストを取得する方法
      const textToEdit = contentToEdit.content.props.children[0].props.children.props.children;
      setSelectedContentId(id); // 編集対象のコンテンツIDをセット
      setEditedText(textToEdit); // 編集用テキストをセット
      setIsSaveButtonVisible(true); // 初期状態でボタンの表示状態を設定
      setModalErrorMessage(""); // モーダル内のエラーメッセージをクリア

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

  // 新規追加時のテキストボックスの入力に応じてエラーメッセージをクリア
  const handleAddTextChange = (e) => {
    setAddText(e.target.value);
    if (e.target.value !== "") {
      setErrorMessage(''); // テキストボックスに値がある場合はエラーメッセージをクリア
    }
  };

  // テキストボックスの入力に応じて保存ボタンの表示状態を更新
  const handleChange = (e) => {
    const newText = e.target.value;
    setEditedText(newText);
    if (newText !== "") {
      setModalErrorMessage(''); // エラーメッセージをクリア
    }
  };

  // エンターキーを押したときにonClickAddを呼び出す
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
            onChange={handleAddTextChange} // 新規追加時のテキストボックス変更に応じた処理
            onKeyPress={handleKeyPress} // エンターキー押下時にonClickAddを呼び出す
            className="add-input"
          />
        </div>
        <Button onClick={onClickAdd} variant="info">新規追加</Button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* エラーメッセージを表示 */}
      <div className="todos-container">
        <div className="todos-header">Todos</div>
        {contents.map((content) => (
          <div key={content.id}>
            {content.content}
          </div>
        ))}
      </div>
      <EditModal
        // モーダルが表示されているかどうかを制御。trueの場合、モーダルが表示され、falseの場合は非表示
        showModal={showModal}
        // モーダルの閉じるボタンが押下時に呼び出し
        handleClose={handleClose}
        // モーダル内のテキストボックスの値を管理
        editedText={editedText}
        // モーダル内のテキストボックスの値が変更された時に呼び出される関数。新しいテキストの値をeditedTextに反映
        handleChange={handleChange}
        // 編集内容を保存する関数。保存ボタンがクリックされたと時に呼び出される
        handleSave={handleSave}
        // 保存ボタンの表示・非表示を制御。trueの場合、保存ボタンを表示、falseの場合は非表示
        isSaveButtonVisible={isSaveButtonVisible}
        // モーダル内のテキストボックスが未入力の時、エラーメッセージを表示
        errorModalMessage={errorModalMessage}
      />
    </section>
  );
}

export default BasicExample;
