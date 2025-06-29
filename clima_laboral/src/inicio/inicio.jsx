import React, { useEffect, useState } from 'react';
import './inicio.css';
import { useNavigate, Link } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://192.168.0.50/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token inválido');
        return res.json();
      })
      .then((data) => {
        setUsuario(data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const cerrarSesion = () => {
    const token = localStorage.getItem('token');

    fetch('http://192.168.0.50/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      navigate('/login');
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="inicio-container">
      <header className="navbar">
        <div className="logo">RH</div>
        
        {isMobile && (
          <button className="hamburger-button" onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        )}
        
        {!isMobile && (
          <>
            <nav className="nav-links">
              <Link to="/forms/new">Nuevo Formulario</Link>
              <Link to="#">Formularios</Link>
              <Link to="#">Registros</Link>
              <Link to="#">Dashboards</Link>
            </nav>
            <div className="profile-icon">
              <span role="img" aria-label="perfil">👤</span>
              {usuario && <span className="username">{usuario.nombre}</span>}
              <button 
                onClick={cerrarSesion} 
                className="logout-button"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        )}
        
        {isMobile && (
          <nav className={`nav-links mobile ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/forms/new" onClick={toggleMenu}>Nuevo Formulario</Link>
            <Link to="#" onClick={toggleMenu}>Formularios</Link>
            <Link to="#" onClick={toggleMenu}>Registros</Link>
            <Link to="#" onClick={toggleMenu}>Dashboards</Link>
            
            <div className="mobile-profile">
              <span role="img" aria-label="perfil">👤</span>
              {usuario && <span className="username">{usuario.nombre}</span>}
              <button 
                onClick={() => {
                  cerrarSesion();
                  toggleMenu();
                }} 
                className="logout-button"
              >
                Cerrar sesión
              </button>
            </div>
          </nav>
        )}
      </header>

      {isMobile && isMenuOpen && (
        <div className="menu-overlay" onClick={toggleMenu} />
      )}

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