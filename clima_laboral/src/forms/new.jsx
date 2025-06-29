import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './form.css';

const NuevoFormulario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    giro: '',
    empleados: '',
    domicilio: '',
    telefono: '',
    responsable: '',
    adscripcion: '',
    estructura: {
      direccion: 0,
      gerencias: 0,
      jefaturas: 0,
      administracion: 0,
      departamentos: 0,
    },
  });

  // Navigation links configuration
  const navLinks = [
    { path: "/forms/new", label: "Nuevo Formulario" },
    { path: "/forms", label: "Formularios" },
    { path: "/registros", label: "Registros" },
    { path: "/dashboards", label: "Dashboards" },
  ].map(link => ({
    ...link,
    active: location.pathname === link.path
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://192.168.0.50/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Token inválido');

        const data = await response.json();
        setUsuario(data.user);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const cerrarSesion = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('http://192.168.0.50/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEstructuraChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, parseInt(value) || 0);
    
    setFormData((prev) => ({
      ...prev,
      estructura: {
        ...prev.estructura,
        [name]: numValue,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://192.168.0.50/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar el formulario');

      const data = await response.json();
      console.log('Formulario guardado:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    }
  };

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <div className="formulario-container">
      <header className="navbar">
        <div className="navbar-top">
          <div className="logo">RH</div>
          
          {/* Desktop Navigation */}
          <nav className="desktop-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`nav-link ${link.active ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="hamburger-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`nav-container ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`nav-link ${link.active ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="profile-section">
            <div className="profile-icon">
              <span role="img" aria-label="perfil" className="profile-emoji">👤</span>
              {usuario && <span className="profile-name">{usuario.nombre}</span>}
            </div>
            <button 
              onClick={cerrarSesion} 
              className="logout-button"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-close">
            ×
          </button>
        </div>
      )}

      <main className="formulario-main">
        <h1 className="form-title">Nuevo Formulario</h1>
        
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Company Information Section */}
          <section className="form-section">
            <h2 className="section-title">Información de la Empresa</h2>
            
            <div className="form-group">
              <label htmlFor="nombreEmpresa" className="form-label">
                Nombre de la empresa
              </label>
              <input
                type="text"
                id="nombreEmpresa"
                name="nombreEmpresa"
                value={formData.nombreEmpresa}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Quattrocom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="giro" className="form-label">
                Tipo de empresa o sector
              </label>
              <select
                id="giro"
                name="giro"
                value={formData.giro}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Selecciona --</option>
                <option value="Automotriz">Sector Automotriz</option>
                <option value="Aeronáutica">Aeronáutica</option>
                <option value="Educativa">Institución Educativa</option>
                <option value="Salud">Hospital / Veterinaria</option>
                <option value="Servicios">Servicios</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Número de empleados participantes
              </label>
              <div className="radio-group">
                {["De 10 a 50", "De 51 a 100", "De 101 a 200", "De 201 a 300", "De 301 a 400", "Más de 400"].map((item) => (
                  <label key={item} className="radio-label">
                    <input
                      type="radio"
                      name="empleados"
                      value={item}
                      checked={formData.empleados === item}
                      onChange={handleChange}
                      className="radio-input"
                    />
                    <span className="radio-custom"></span>
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="form-section">
            <h2 className="section-title">Información de Contacto</h2>
            
            <div className="form-group">
              <label htmlFor="domicilio" className="form-label">
                Domicilio
              </label>
              <input
                type="text"
                id="domicilio"
                name="domicilio"
                value={formData.domicilio}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsable" className="form-label">
                Responsable
              </label>
              <input
                type="text"
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="adscripcion" className="form-label">
                Adscripción
              </label>
              <select
                id="adscripcion"
                name="adscripcion"
                value={formData.adscripcion}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Selecciona --</option>
                <option value="Matriz">Matriz</option>
                <option value="Sucursal">Sucursal</option>
                <option value="Norte">Norte</option>
                <option value="Sur">Sur</option>
                <option value="Noreste">Noreste</option>
                <option value="Noroeste">Noroeste</option>
                <option value="Otras">Otras</option>
              </select>
            </div>
          </section>

          {/* Organizational Structure Section */}
          <section className="form-section">
            <h2 className="section-title">Estructura Organizacional</h2>
            
            {Object.entries(formData.estructura).map(([key, value]) => (
              <div key={key} className="form-group">
                <label htmlFor={key} className="form-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  min="0"
                  value={value}
                  onChange={handleEstructuraChange}
                  className="form-input number-input"
                />
              </div>
            ))}
          </section>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Guardar Formulario
            </button>
          </div>
        </form>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-item">
            <span className="footer-icon">✉️</span>
            <div className="footer-text">
              <div>despachoRH@gmail.com</div>
              <div>+52 442 623 927 5</div>
            </div>
          </div>
          
          <div className="footer-item">
            <span className="footer-icon">📍</span>
            <div className="footer-text">
              <div>Fuerte de alora 217 Col. el vergel,</div>
              <div>Santiago de Querétaro QRO</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

NuevoFormulario.propTypes = {
  nombreEmpresa: PropTypes.string,
  giro: PropTypes.string,
  empleados: PropTypes.string,
  domicilio: PropTypes.string,
  telefono: PropTypes.string,
  responsable: PropTypes.string,
  adscripcion: PropTypes.string,
  estructura: PropTypes.shape({
    direccion: PropTypes.number,
    gerencias: PropTypes.number,
    jefaturas: PropTypes.number,
    administracion: PropTypes.number,
    departamentos: PropTypes.number,
  }),
};

export default NuevoFormulario;