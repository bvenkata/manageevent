import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FamilyForm from './components/FamilyForm';
import Admin from './components/Admin';
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FamilyForm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default App;
