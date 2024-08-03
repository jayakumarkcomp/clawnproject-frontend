import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { GoSearch } from 'react-icons/go';
import { RiTodoLine } from 'react-icons/ri';
import { GiHamburgerMenu } from 'react-icons/gi';

const Home = () => {
  const [editId, setEditId] = useState('');
  const [showEdits, setShowEdits] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [show, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showAllTodos, setShowAllTodos] = useState(false);

  useEffect(() => {
    fetchAllTodos();
  }, [fetchAllTodos]);

  const fetchAllTodos = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const url = `https://clawn-backendprojk.netlify.app/${userData.id}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const filteredSearch = data.filter((todo) => todo.title.toLowerCase().includes(searchInput.toLowerCase()));
      setTodos(filteredSearch);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = (show) => setShow(show);
  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const addItem = () => setShowAllTodos(true);

  const cancelAddTodo = () => setShowAllTodos(false);

  const titleChange = (e) => setTitle(e.target.value);
  const textAreaChange = (e) => setDescription(e.target.value);

  const addItemForm = async (event) => {
    event.preventDefault();
    const url = 'https://clawn-backendprojk.netlify.app/todos';
    const { title, description } = { title, description };
    const userData = JSON.parse(localStorage.getItem('user'));
    const data = {
      title,
      description,
      user_id: userData.id,
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      console.log('Todo added successfully');
      setTitle('');
      setDescription('');
      setShowAllTodos(false);
      fetchAllTodos();
    } else {
      console.log('Failed to add todo');
    }
  };

  const deleteItem = async (id) => {
    const url = `https://clawn-backendprojk.netlify.app/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (response.ok) {
      console.log('Todo deleted successfully');
      fetchAllTodos();
    } else {
      console.log('Failed to delete todo');
    }
  };

  const updateItemSend = async (e) => {
    e.preventDefault();
    const { editId, editTitle, editDescription } = { editId, editTitle, editDescription };
    const url = `https://clawn-backendprojk.netlify.app/${editId}`;
    const data = {
      title: editTitle,
      description: editDescription,
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      console.log('Todo updated successfully');
      setEditId('');
      setEditTitle('');
      setEditDescription('');
      setShowEdits(false);
      fetchAllTodos();
    } else {
      console.log('Failed to update todo');
    }
  };

  const updateItem = (item) => {
    setEditId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setShowAllTodos(false);
    setShowEdits(true);
  };

  const editTitleChange = (event) => setEditTitle(event.target.value);
  const editTextAreaChange = (event) => setEditDescription(event.target.value);

  const userInputSearch = (event) => {
    setSearchInput(event.target.value);
    fetchAllTodos();
  };

  const searchButton = () => fetchAllTodos();

  const jwtToken = Cookies.get('jwtToken');
  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div className="nav-bar">
        <div>
          <button
            type="button"
            className="hamburg-menu"
            onClick={handleShow}
          >
            <GiHamburgerMenu />
          </button>
          <Offcanvas
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <div className="show-only-on-larger-screen">
                  <img
                    className="keep-logo"
                    src="https://i.ibb.co/10TvKXC/paper-14203821.png"
                    alt="blog-logo-not-found"
                  />
                  <span className="keep-title">Todos</span>
                </div>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div>
                <h3>Welcome to Todos</h3>
                <p>create a todos</p>
                <p></p>
              </div>
              <div className="notes-add-button-container">
                <div className="icon">
                  <RiTodoLine />
                </div>
                <div className="button">
                  <button
                    onClick={addItem}
                    className="notes-all-add-button"
                  >
                    Add a Note
                  </button>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
        <div className="search-bar-container">
          <button onClick={searchButton} className="search-button">
            <GoSearch />
          </button>
          <input
            value={searchInput}
            onChange={userInputSearch}
            type="search"
            placeholder="Search"
            className="search-bar"
          />
        </div>
        <div>
          <Link to="/profile">
            <img
              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1721325896~exp=1721326496~hmac=9b0e0ed6d5328d0f0ad3f74f17048bdca4736e9f69a0d125db1f586a93cb79f9"
              alt="image-user-not-found"
              className="user-image"
            />
          </Link>
        </div>
      </div>
      {showAllTodos === false && (
        <div className="all-notes-container">
          <div className="todos-container">
            {todos.length > 0 ? (
              todos.map((each) => (
                <div className="each-todo" key={each.id}>
                  <h3>{each.title}</h3>
                  <p>{each.description}</p>
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => updateItem(each)}
                    >
                      Edit
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteItem(each.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-todo-found-container">
                <div>
                  <h3>No Todos Found</h3>
                  <p>No todos found in your list</p>
                  <img
                    src="https://img.freepik.com/free-vector/work-life-balance-concept-illustration_114360-8897.jpg?t=st=1722526776~exp=1722530376~hmac=3171a049a17b4887e3e7e3043af5665719903884dc154e39b565749f81506e09&w=740"
                    className="no-todo-found"
                    alt="no-todo-found"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showAllTodos === true && (
        <div className="form-container">
          <form className="form-box" onSubmit={addItemForm}>
            <input
              onChange={titleChange}
              value={title}
              type="text"
              placeholder="Title"
              name="title"
              required
            />
            <textarea
              onChange={textAreaChange}
              value={description}
              className="textarea"
              placeholder="Description"
              name="description"
              required
            />
            <div>
              <button type="submit" className="btn btn-primary">
                Add Todo
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-danger"
                onClick={cancelAddTodo}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {showEdits === true && (
        <div className="form-container">
          <form className="form-box" onSubmit={updateItemSend}>
            <input
              onChange={editTitleChange}
              value={editTitle}
              type="text"
              placeholder="Title"
              name="title"
              required
            />
            <textarea
              onChange={editTextAreaChange}
              value={editDescription}
              className="textarea"
              placeholder="Description"
              name="description"
              required
            />
            <div>
              <button type="submit" className="btn btn-primary">
                Update Todo
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowEdits(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default Home;