import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import './index.css';
import './styles/scrollbar.css';

function App() {
  return (
    <BrowserRouter>
      <main className="w-full">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App; 