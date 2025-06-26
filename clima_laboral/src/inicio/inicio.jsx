import React from 'react';
import './inicio.css';

const Inicio = () => {
  return (
    <div className="inicio-container">
      <header className="navbar">
        <div className="logo">RH</div>
        <nav className="nav-links">
          <a href="../forms/">Nuevo Formulario</a>
          <a href="#">Formularios</a>
          <a href="#">Registros</a>
          <a href="#">Dashboards</a>
        </nav>
        <div className="profile-icon">
          <span role="img" aria-label="perfil">👤</span>
        </div>
      </header>

      <main className="hero">
        <h1>Mejora y transforma tu ambiente laboral</h1>
        <p>Una plataforma diseñada para entender, medir y mejorar tu organización.</p>
      </main>

      <footer className="footer">
        <div className="footer-item">
          <span role="img" aria-label="correo">✉️</span>
          <div>
            <div>despachoRH@gmail.com</div>
            <div>+52 442 623 927 5</div>
          </div>
        </div>
        <div className="footer-item">
          <span role="img" aria-label="ubicación">📍</span>
          <div>
            <div>Fuerte de Alora 217 Col. el Vergel,</div>
            <div>Santiago de Querétaro QRO</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
