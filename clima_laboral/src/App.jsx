import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Principal from './principal';
import Login from './Login';
import Inicio from './inicio/inicio';
import NuevoFormulario from './forms/new';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="scrollable-content">
          <Routes>
            <Route path="/" element={<Principal />} />
            <Route path="/login" element={
              <div className="login-page-container">
                <Login />
              </div>
            } />
            <Route path="/inicio" element={
              <div className="inicio-page-container">
                <Inicio />
              </div>
            } />
            <Route path="/forms/new" element={
              <div className="form-page-container">
                <NuevoFormulario />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;