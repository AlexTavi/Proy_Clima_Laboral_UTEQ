import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './form.css';

const NuevoFormulario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [empleadosSeleccion, setEmpleadosSeleccion] = useState('');

  const nivelesPuestos = ['Dirección', 'Gerencias', 'Jefaturas', 'Administración', 'Departamentos'];
  const adscripcionesDisponibles = ['Matriz', 'Sucursal', 'Norte', 'Sur', 'Noreste', 'Noroeste'];

  const [puestosSeleccionados, setPuestosSeleccionados] = useState([]);
  const [puestosExtra, setPuestosExtra] = useState([]);
  const [adscripcionesSeleccionadas, setAdscripcionesSeleccionadas] = useState([]);
  const [adscripcionesExtra, setAdscripcionesExtra] = useState([]);

  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    giro: '',
    subGiro: '',
    otroGiro: '',
    empleados: '',
    domicilio: '',
    telefono: '',
    responsable: '',
    estructura: {},
  });

  const girosCatalogo = {
    'Sector industrial': ['Automotriz', 'Aeronáutica', 'Alimentos', 'Electrónica', 'Veterinaria'],
    'Hospital': [],
    'Institución educativa': [],
    'Sector público': [],
    'Servicios': ['Institución Financiera', 'Aseguradora'],
    'Comercio': ['Tienda autoservicio', 'Tienda conveniencia', 'Tienda departamental'],
    'Otros': [],
  };

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
      if (!token) return navigate('/login');
      try {
        const res = await fetch('http://192.168.0.50/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Token inválido');
        const data = await res.json();
        setUsuario(data.user);
      } catch (err) {
        localStorage.removeItem('token');
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
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEstructuraChange = (e) => {
    const { name, value } = e.target;
    const num = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      estructura: { ...prev.estructura, [name]: num },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const giroFinal = formData.giro === 'Otros'
      ? formData.otroGiro
      : (formData.subGiro || formData.giro);

    const estructuraFinal = { ...formData.estructura };
    puestosExtra.forEach(p => {
      if (p.nombre) estructuraFinal[p.nombre.toLowerCase()] = p.numero;
    });

    const adscripcionesFinales = [...adscripcionesSeleccionadas, ...adscripcionesExtra.filter(Boolean)];

    try {
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.0.50/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          giro: giroFinal,
          estructura: estructuraFinal,
          adscripciones: adscripcionesFinales,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al guardar el formulario');
      }
      
      setSuccess("Formulario guardado con éxito.");
      setTimeout(() => setSuccess(null), 3000);
      // Reset form after successful submission
      setFormData({
        nombreEmpresa: '',
        giro: '',
        subGiro: '',
        otroGiro: '',
        empleados: '',
        domicilio: '',
        telefono: '',
        responsable: '',
        estructura: {},
      });
      setPuestosSeleccionados([]);
      setPuestosExtra([]);
      setAdscripcionesSeleccionadas([]);
      setAdscripcionesExtra([]);
      setEmpleadosSeleccion('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <div className="formulario-container">
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

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="success-message" role="status">
          {success}
        </div>
      )}

      <main className="formulario-main">
        <h1 className="form-title">Nuevo Formulario</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <section className="form-section">
            <h2 className="section-title">Información de la Empresa</h2>

            <div className="form-group">
              <label htmlFor="nombreEmpresa" className="form-label">Nombre de la empresa</label>
              <input 
                id="nombreEmpresa"
                name="nombreEmpresa" 
                value={formData.nombreEmpresa} 
                onChange={handleChange} 
                className="form-input"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="giro" className="form-label">Catálogo de giros</label>
              <select 
                id="giro"
                name="giro" 
                value={formData.giro} 
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, giro: val, subGiro: '', otroGiro: '' }));
                }} 
                className="form-select"
                required
              >
                <option value="">-- Selecciona un giro --</option>
                {Object.keys(girosCatalogo).map(giro => (
                  <option key={giro} value={giro}>{giro}</option>
                ))}
              </select>
            </div>

            {girosCatalogo[formData.giro]?.length > 0 && (
              <div className="form-group">
                <label htmlFor="subGiro" className="form-label">Subcategoría</label>
                <select 
                  id="subGiro"
                  name="subGiro" 
                  value={formData.subGiro} 
                  onChange={handleChange} 
                  className="form-select"
                  required
                >
                  <option value="">-- Selecciona una subcategoría --</option>
                  {girosCatalogo[formData.giro].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.giro === 'Otros' && (
              <div className="form-group">
                <label htmlFor="otroGiro" className="form-label">Especifique el giro</label>
                <input 
                  id="otroGiro"
                  name="otroGiro" 
                  value={formData.otroGiro} 
                  onChange={handleChange} 
                  className="form-input"
                  required 
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="empleadosSeleccion" className="form-label">Número de empleados</label>
              <select
                id="empleadosSeleccion"
                name="empleadosSeleccion"
                value={empleadosSeleccion}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmpleadosSeleccion(value);
                  if (value !== "Otros") {
                    setFormData(prev => ({ ...prev, empleados: value }));
                  } else {
                    setFormData(prev => ({ ...prev, empleados: "" }));
                  }
                }}
                className="form-select"
                required
              >
                <option value="">-- Selecciona un rango --</option>
                <option value="10-50">De 10 a 50</option>
                <option value="51-100">De 51 a 100</option>
                <option value="101-200">De 101 a 200</option>
                <option value="201-300">De 201 a 300</option>
                <option value="301-400">De 301 a 400</option>
                <option value="401-500">De 401 a 500</option>
                <option value="501-1000">De 501 a 1000</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {empleadosSeleccion === "Otros" && (
              <div className="form-group">
                <label htmlFor="empleados" className="form-label">Especifique el número de empleados</label>
                <input
                  id="empleados"
                  type="number"
                  name="empleados"
                  value={formData.empleados}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
            )}
          </section>

          <section className="form-section">
            <h2 className="section-title">Información de Contacto</h2>
            <div className="form-group">
              <label htmlFor="domicilio" className="form-label">Domicilio</label>
              <input 
                id="domicilio"
                name="domicilio" 
                value={formData.domicilio} 
                onChange={handleChange} 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input 
                id="telefono"
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="responsable" className="form-label">Responsable</label>
              <input 
                id="responsable"
                name="responsable" 
                value={formData.responsable} 
                onChange={handleChange} 
                className="form-input"
                required 
              />
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">Estructura Organizacional</h2>
            <p className="section-description">Niveles de puestos y número de ocupantes:</p>
            <div className="checkbox-container">
              {nivelesPuestos.map((puesto) => (
                <div key={puesto} className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id={`puesto-${puesto}`}
                      checked={puestosSeleccionados.includes(puesto)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setPuestosSeleccionados(prev =>
                          checked ? [...prev, puesto] : prev.filter(p => p !== puesto)
                        );
                      }}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    {puesto}
                  </label>
                  {puestosSeleccionados.includes(puesto) && (
                    <input
                      type="number"
                      name={puesto.toLowerCase()}
                      value={formData.estructura[puesto.toLowerCase()] || 0}
                      onChange={handleEstructuraChange}
                      className="form-input number-input"
                      min="0"
                      placeholder={`Nº de ${puesto}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {puestosExtra.map((puesto, idx) => (
              <div key={`puesto-extra-${idx}`} className="form-group extra-input-group">
                <input
                  type="text"
                  value={puesto.nombre}
                  onChange={(e) => {
                    const nuevoNombre = e.target.value;
                    setPuestosExtra(prev => {
                      const copy = [...prev];
                      copy[idx].nombre = nuevoNombre;
                      return copy;
                    });
                  }}
                  className="form-input"
                  placeholder="Nombre del puesto adicional"
                  aria-label="Nombre del puesto adicional"
                />
                <input
                  type="number"
                  value={puesto.numero}
                  onChange={(e) => {
                    const numero = parseInt(e.target.value) || 0;
                    setPuestosExtra(prev => {
                      const copy = [...prev];
                      copy[idx].numero = numero;
                      return copy;
                    });
                  }}
                  className="form-input number-input"
                  min="0"
                  placeholder="Nº ocupantes"
                  aria-label="Número de ocupantes"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPuestosExtra(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="remove-button"
                  aria-label="Eliminar puesto"
                >
                  ×
                </button>
              </div>
            ))}

            <button 
              type="button" 
              onClick={() => setPuestosExtra([...puestosExtra, { nombre: '', numero: 0 }])}
              className="add-button"
            >
              + Agregar otro puesto
            </button>
          </section>

          <section className="form-section">
            <h2 className="section-title">Adscripciones</h2>
            <div className="checkbox-container">
              {adscripcionesDisponibles.map((ads) => (
                <div key={ads} className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id={`ads-${ads}`}
                      checked={adscripcionesSeleccionadas.includes(ads)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAdscripcionesSeleccionadas(prev =>
                          checked ? [...prev, ads] : prev.filter(a => a !== ads)
                        );
                      }}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    {ads}
                  </label>
                </div>
              ))}
            </div>

            {adscripcionesExtra.map((ads, idx) => (
              <div key={`ads-extra-${idx}`} className="form-group extra-input-group">
                <input
                  type="text"
                  value={ads}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAdscripcionesExtra(prev => {
                      const copy = [...prev];
                      copy[idx] = val;
                      return copy;
                    });
                  }}
                  className="form-input"
                  placeholder="Adscripción adicional"
                  aria-label="Adscripción adicional"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAdscripcionesExtra(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="remove-button"
                  aria-label="Eliminar adscripción"
                >
                  ×
                </button>
              </div>
            ))}

            <button 
              type="button" 
              onClick={() => setAdscripcionesExtra([...adscripcionesExtra, ''])}
              className="add-button"
            >
              + Agregar otra adscripción
            </button>
          </section>

          <div className="form-actions">
            <button type="submit" className="submit-button">Guardar Formulario</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NuevoFormulario;