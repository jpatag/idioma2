import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './Blog';
import ArticleDetail from './ArticleDetail';

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/article" element={<ArticleDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
