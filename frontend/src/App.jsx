import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddData from './pages/AddData';
import EditData from './pages/EditData';
import DetailData from './pages/DetailData';

function App() {
  return (
    <BrowserRouter>
      <div style={{}}>
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