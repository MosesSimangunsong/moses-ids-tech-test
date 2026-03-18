import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- 1. Pastikan import ini ada
import Home from './pages/Home';
import AddData from './pages/AddData';
import EditData from './pages/EditData';
import DetailData from './pages/DetailData';

function App() {
  return (
    <BrowserRouter>
      {/* 2. Pastikan komponen Toaster ini diletakkan di sini */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#1e293b' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#1e293b' },
          },
        }}
      />
      
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddData />} />
          <Route path="/edit/:id" element={<EditData />} />
          <Route path="/detail/:id" element={<DetailData />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;