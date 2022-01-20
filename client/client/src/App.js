import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react'
import Header from './components/pages/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Routes } from './routes/Router';
import {  BrowserRouter as Router } from 'react-router-dom';
// import HelloWorld from './components/HelloWorld';
import LangSelector from './components/LangSelector';

function App() {
  return (
<React.Fragment>
      {/* <h3>Implement multi-languages in React - <a href="https://www.cluemediator.com" target="_blank" rel="noopener noreferrer">Clue Mediator</a></h3> */}
      <LangSelector />


    <div className="App">
      
      <Router>
        <Header />
        {/* <HelloWorld /> */}
        <Routes />
        <Footer />
      </Router>
    </div>
    </React.Fragment>

  );
}

export default App;
