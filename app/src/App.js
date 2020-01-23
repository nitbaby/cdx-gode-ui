import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.js';
import  MainFormComponent from './MainFormComponent';
function App() {
  return (
    <div className="App">
      <div className="container-fluid">
      <div className="row bg-white hdr-border">
        <div className="col-12">
          <header className="py-4 app-header">
            <h1>CDX GOD(E)</h1>
          </header>
        </div>
      </div>
        <div className="container-lg py-4 my-3 bg-white border rounded">
          <MainFormComponent></MainFormComponent>
        </div>
      </div>
    </div>
  );
}

export default App;
