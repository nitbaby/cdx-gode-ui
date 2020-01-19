import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastProvider } from 'react-toast-notifications';
import  MainFormComponent from './MainFormComponent';

function AppBasic() {
  return (
    <div className="App">
      <div className="container-fluid">
        <header className="py-5 app-header">
          <h1>CDX GOD(E)</h1>
        </header>
        <div className="container-lg">
          <MainFormComponent></MainFormComponent>
        </div>
      </div>
    </div>
  );
}
const App = () => (
  <ToastProvider>
    <AppBasic />
  </ToastProvider>
)
export default App;
