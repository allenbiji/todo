import { useState } from 'react'


import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TodoPage from './pages/mainpage';
import NewLoginPage from './pages/loginpage';

const App = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<NewLoginPage />} />
          <Route path="/main" element={<TodoPage />} />

          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

  
export default App;

