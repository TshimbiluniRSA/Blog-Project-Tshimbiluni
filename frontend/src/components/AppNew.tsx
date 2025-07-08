import '../App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import ArticleList from './ArticleList';
import ArticleDetail from './ArticleDetail';
import ArticleForm from './ArticleForm';
import SearchAndEdit from './SearchAndEdit';

const Home = () => (
  <div className="flex flex-col justify-center items-center h-full text-center">
    <h1 className="text-4xl mb-4">Welcome to Tshimbiluni Blog Web App</h1>
    <p className="text-lg mb-6">This web app is about sharing articles and be able comments on an article.</p>
    <div className="space-x-4">
      <Link to="/create-article" className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors">
        Create Article
      </Link>
      <Link to="/blog" className="bg-secondary text-white py-2 px-4 rounded hover:bg-secondary-dark transition-colors">
        View Blog
      </Link>
      <Link to="/search-edit" className="bg-tertiary text-white py-2 px-4 rounded hover:bg-tertiary-dark transition-colors">
        Search and Edit
      </Link>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-white p-4">
          <nav>
            <ul className="flex space-x-4 justify-center">
              <li>
                <Link to="/" className="text-white hover:text-gray-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-article" className="text-white hover:text-gray-200 transition-colors">
                  Create Article
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white hover:text-gray-200 transition-colors">
                  View Blog
                </Link>
              </li>
              <li>
                <Link to="/search-edit" className="text-white hover:text-gray-200 transition-colors">
                  Search and Edit
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/create-article" element={<ArticleForm />} />
            <Route path="/blog" element={<ArticleList />} />
            <Route path="/search-edit" element={<SearchAndEdit />} />
          </Routes>
        </main>
        
        <footer className="bg-primary text-white p-4 text-center">
          <p>© {new Date().getFullYear()} Tshimbiluni Web App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  </ErrorBoundary>
);

export default App;
