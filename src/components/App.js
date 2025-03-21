import React from 'react';
import HomePage from '../pages/HomePage';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <div className="container-fluid">
            <Header />
            <HomePage />
        </div>
    );
};

export default App;