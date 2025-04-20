import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import AddTodoPage from './pages/AddTodoPage';
import EditTodoPage from './pages/EditTodoPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Context
import { TodoProvider } from './context/TodoContext';

// Styles
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <div className="App">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add" element={<AddTodoPage />} />
              <Route path="/edit/:id" element={<EditTodoPage />} />
            </Routes>
          </div>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </TodoProvider>
  );
}

export default App;