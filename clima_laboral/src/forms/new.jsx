import React from 'react';
import './form.css';

const NuevoFormulario = () => {
  return (
    <div className="formulario-container">
      <header className="navbar">
        <div className="logo">RH</div>
        <nav className="nav-links">
          <a href="#">Nuevo Formulario</a>
          <a href="#">Formularios</a>
          <a href="#">Registros</a>
          <a href="#">Dashboards</a>
        </nav>
        <div className="profile-icon blue">
          <span role="img" aria-label="perfil">👤</span>
        </div>
      </header>

      <main className="formulario-main">
        <section className="formulario-column">
          <div className="formulario-title">Selecciona el Tipo de empresa o sector</div>
          {["Sector automotriz", "Sector Público", "Hospital", "Comercio", "Sector Público", "Otros"].map((item, idx) => (
            <button key={idx} className="formulario-button">{item}</button>
          ))}
        </section>

        <section className="formulario-column">
          <div className="formulario-title">Selecciona el número de empleados</div>
          {["de 10 a 50", "De 51 a 100", "De 101 a 150", "De 151 a 200", "De 201 a 250", "Más de 250"].map((item, idx) => (
            <button key={idx} className="formulario-button">{item}</button>
          ))}
        </section>

        <section className="formulario-column">
          <div className="formulario-title light">Ubicación o contacto</div>
          <button className="formulario-button">Agregar Ubicación</button>
          <button className="formulario-button">Agregar Teléfono</button>
          <button className="formulario-button">Agregar responsable</button>
        </section>

        <div className="guardar-btn-container">
          <button className="guardar-btn">Guardar</button>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-item">
          ✉️
          <div>
            <div>despachoRH@gmail.com</div>
            <div>+52 442 623 927 5</div>
          </div>
        </div>
        <div className="footer-item">
          📍
          <div>
            <div>Fuerte de alora 217 Col. el vergel,</div>
            <div>Santiago de Querétaro QRO</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NuevoFormulario;
