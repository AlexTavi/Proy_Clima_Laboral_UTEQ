import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ListadoFormularios = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const apiUrl = "https://api.grupocrehce.com/";

  // Navbar links
  const navLinks = [
    { path: "/forms/new", label: "Nuevo Formulario" },
    { path: "/forms", label: "Formularios" },
    { path: "/registros", label: "Registros" },
    { path: "/dashboards", label: "Dashboards" },
  ].map(link => ({
    ...link,
    active: location.pathname === link.path
  }));

  // Verificar usuario
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      try {
        const res = await fetch(apiUrl+'api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Token inválido');
        const data = await res.json();
        setUsuario(data.user);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUserData();
  }, [navigate]);

  const cerrarSesion = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(apiUrl+'api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // Función para parsear los campos que vienen como strings JSON
  const parseFormData = (form) => {
    try {
      return {
        ...form,
        estructura: form.estructura ? JSON.parse(form.estructura) : {},
        adscripciones: form.adscripciones ? JSON.parse(form.adscripciones) : [],
        additionalQuestions: form.adscripciones ? JSON.parse(form.adscripciones) : [],
        answers: form.answers ? JSON.parse(form.answers) : {}
      };
    } catch (err) {
      console.error('Error parsing form data:', err);
      return form; // Si falla el parseo, devolver el form sin modificar
    }
  };

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await fetch(apiUrl+'api/forms', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success) {
          // Parseamos cada formulario y agrupamos por empresa
          const parsedForms = Array.isArray(data.data) 
            ? data.data.map(parseFormData)
            : [];
          setFormularios(parsedForms);
        } else {
          throw new Error(data.message || 'Error al obtener los datos');
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (usuario) {
      fetchFormularios();
    }
  }, [usuario]);

  if (loading) {
    return <div className="loading-container">Cargando formularios...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // Agrupar formularios por empresa
  const formulariosPorEmpresa = formularios.reduce((acc, form) => {
    if (!acc[form.nombreEmpresa]) {
      acc[form.nombreEmpresa] = [];
    }
    acc[form.nombreEmpresa].push(form);
    return acc;
  }, {});

  return (
    <div className="formulario-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-top">
          <div className="logo">RH</div>
          <nav className="desktop-nav-links">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${link.active ? 'active' : ''}`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="desktop-profile-section">
            <div className="profile-icon">👤 {usuario?.nombre}</div>
            <button 
              onClick={cerrarSesion} 
              className="logout-button"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
          <button 
            className="hamburger-button" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Menú de navegación"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>
        <div className={`nav-container ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-links">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`nav-link ${link.active ? 'active' : ''}`} 
                onClick={() => setIsMenuOpen(false)}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="profile-section">
            <div className="profile-icon">👤 {usuario?.nombre}</div>
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

      {/* Contenido principal */}
      <main className="formulario-main">
        
        {formularios.length === 0 ? (
          <div className="success-message">
            No hay formularios registrados aún.
          </div>
        ) : (
          <div className="empresas-container">
            {Object.entries(formulariosPorEmpresa).map(([empresa, forms]) => (
              <div key={empresa} className="empresa-card">
                <div className="empresa-header">
                  <h2 className="empresa-nombre">{empresa}</h2>
                  <span className="empresa-count">{forms.length} {forms.length === 1 ? 'registro' : 'registros'}</span>
                </div>
                
                <div className="registros-grid">
                  {forms.map((form) => (
                    <div key={form.id} className="registro-card">
                      <div className="registro-header">
                        <h3 className="registro-title">Registro #{form.id}</h3>
                        <span className="registro-date">
                          {new Date(form.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="registro-details">
                        <div className="detail-group">
                          <span className="detail-label">Giro:</span>
                          <span className="detail-value">{form.giro}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Empleados:</span>
                          <span className="detail-value">{form.empleados}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Domicilio:</span>
                          <span className="detail-value">{form.domicilio}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Teléfono:</span>
                          <span className="detail-value">{form.telefono}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Responsable:</span>
                          <span className="detail-value">{form.responsable}</span>
                        </div>
                        
                        {form.estructura && Object.keys(form.estructura).length > 0 && (
                          <div className="detail-section">
                            <h4 className="section-subtitle">Estructura:</h4>
                            <ul className="detail-list">
                              {Object.entries(form.estructura).map(([nivel, cantidad]) => (
                                <li key={nivel}>
                                  <span className="list-label">{nivel}:</span>
                                  <span className="list-value">{cantidad}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {form.adscripciones && form.adscripciones.length > 0 && (
                          <div className="detail-section">
                            <h4 className="section-subtitle">Adscripciones:</h4>
                            <ul className="detail-list">
                              {form.adscripciones.map((adscripcion, index) => (
                                <li key={index}>{adscripcion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {form.additionalQuestions && form.additionalQuestions.length > 0 && (
                          <div className="detail-section">
                            <h4 className="section-subtitle">Preguntas adicionales:</h4>
                            <ul className="detail-list">
                              {form.additionalQuestions.map((question, index) => (
                                <li key={index}>
                                  <p className="question-text">{question.text}</p>
                                  <p className="question-answer">
                                    {form.answers[index]?.answer || 'No respondida'}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListadoFormularios;