import './App.css';
import HomePage from './components/HomePage'; 
import { Route, Routes } from "react-router-dom";
import { useState } from 'react';
import Header from './components/Header';
import SignIn from './components/SignIn';
import BlogDetail from "./components/BlogDetail";
import BookmarksPage from "./components/BookmarksPage";
import HistoryPage from "./components/HistoryPage";




function App() {

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
          
            <div className="app min-h-screen">
              <Header onSearch={handleSearch} searchTerm={searchTerm} />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/signin" element={<SignIn />} />
                </Routes>
              </main>
            </div>
       
  );
}

export default App;
