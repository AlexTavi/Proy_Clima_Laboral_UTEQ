import React, { useEffect, useState } from 'react';
import './inicio.css';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://192.168.0.187/api/me', {
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

    fetch('http://192.168.0.187/api/logout', {
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

  if (loading) return <p>Cargando...</p>;

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
          {usuario && <span style={{ marginLeft: '8px' }}>{usuario.nombre}</span>}
          <button onClick={cerrarSesion} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
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
