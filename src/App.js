import './App.css';
import HomePage from './components/HomePage'; 
import { Route, Routes } from "react-router-dom";
import { useState } from 'react';
import Header from './components/Header';
import SignIn from './components/SignIn';
import BlogDetail from "./components/BlogDetail";
import BookmarksPage from "./components/BookmarksPage";
import HistoryPage from "./components/HistoryPage";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsandConditions";
import ScrollToTop from './components/ScrollToTop';





function App() {

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
          
        <div className="app min-h-screen">
          <Header onSearch={handleSearch} searchTerm={searchTerm} />
          <main>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            </Routes>
          </main>
          <Footer />
        </div>
       
  );
}

export default App;
