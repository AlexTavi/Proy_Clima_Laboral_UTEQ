import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useState } from "react";
import { FaBars, FaCheck, FaInfoCircle, FaHandHolding, FaProjectDiagram, FaEnvelope, FaSignInAlt, FaPlus, FaList, FaCubes, FaAngleDoubleLeft, FaAngleDoubleRight, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';

import Principal from './paginas/principal.jsx';
import Login from './paginas/Login.jsx';
import Inicio from './paginas/inicio.jsx';
import NuevoFormulario from './paginas/new.jsx';
import ListadoFormularios from './paginas/registros.jsx';
import Footer from "./componentes/Footer.jsx";
import Info from "./paginas/Info.jsx";
import Servicios from "./paginas/Servicios.jsx";
import Proyectos from "./paginas/Proyectos.jsx";
import Contacto from "./paginas/Contacto.jsx";
import './App.scss';
import logo from '../imagen.jpg';
import Beneficios from "./paginas/Beneficios.jsx";

// Componente interno para usar useLocation
function AppContent() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = (value) => {
    console.log('aaaa')
    setToggled(value);
  };

  // Función para verificar si la ruta está activa
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };
    const handleLogout = () => {
        logout();                 // limpia sesión
        navigate('/', { replace: true }); // redirige
    };

  return (
      <div className={`app ${toggled ? 'toggled' : ''}`}>
        <Sidebar
            collapsed={collapsed}
            toggled={toggled}
            width="240px"
            collapsedWidth="80px"
            backgroundColor="#eaebee"
            breakPoint="md"
            transitionDuration={300}
            onBackdropClick={() => handleToggleSidebar(false)}
            onBreakPoint={(broken) => {
              if (broken) {
                setCollapsed(false);
              }
            }}
            rootStyles={{
              color: '#000',
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
            }}
        >
          {/* Header del sidebar */}
          <div className="sidebar-header">
            {/*{!collapsed ? (*/}
            {/*    <h2 className="sidebar-title">Grupo Crehce</h2>*/}
            {/*) : (*/}
                <div className="sidebar-logo-collapsed">
                  <img src={logo} alt="Logo" className="sidebar-logo-collapsed"/>
                </div>
            {/*)}*/}
          </div>

          {/* Botón de colapso */}
          <div className="sidebar-btn-wrapper">
            <button
                className="sidebar-btn"
                onClick={handleCollapsedChange}
                title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
            </button>
          </div>

          {/* Menu principal */}
          <Menu
              closeOnClick={true}
              transitionDuration={300}
              menuItemStyles={{
                button: ({active}) => ({
                  padding: '12px 24px',
                  margin: '4px 16px',
                  borderRadius: 8,
                  backgroundColor: active ? '#4946a9' : 'transparent',
                  color: active ? '#fff' : '#4946a9',
                  transition: 'all .2s ease',
                  '&:hover': {
                    backgroundColor: '#4946a9',
                    color: '#fff',
                  },
                }),
                icon: ({active}) => ({
                  color: active ? '#fff' : '#4946a9',
                  marginRight: collapsed ? 0 : 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  width: collapsed ? '100%' : 'auto',
                }),
                label: {
                  fontWeight: '500',
                },
                subMenuContent: {
                  backgroundColor: '#fff',
                },
              }}
          >
            {/* Información/Inicio */}
            {!user && (
                <MenuItem
                    icon={<FaInfoCircle/>}
                    component={<Link to="/" onClick={() => handleToggleSidebar(false)}/>}
                    active={isActiveRoute('/')}
                >
                  Información
                </MenuItem>
            )}

            {!user && (
                <MenuItem
                    icon={<FaCheck/>}
                    component={<Link to="/beneficios" onClick={() => handleToggleSidebar(false)}/>}
                    active={isActiveRoute('/beneficios')}
                >
                  Beneficios
                </MenuItem>
            )}

            {!user && (
                <MenuItem
                    icon={<FaHandHolding/>}
                    component={<Link to="/servicios" onClick={() => handleToggleSidebar(false)}/>}
                    active={isActiveRoute('/servicios')}
                >
                  Servicios
                </MenuItem>
            )}

            {!user && (
                <MenuItem
                    icon={<FaProjectDiagram/>}
                    component={<Link to="/proyectos" onClick={() => handleToggleSidebar(false)}/>}
                    active={isActiveRoute('/proyectos')}
                >
                  Proyectos
                </MenuItem>
            )}

            {!user && (
                <MenuItem
                    icon={<FaEnvelope/>}
                    component={<Link to="/contacto" onClick={() => handleToggleSidebar(false)}/>}
                    active={isActiveRoute('/contacto')}
                >
                  Contacto
                </MenuItem>
            )}

            {user && (
                <MenuItem
                    icon={<FaCubes/>}
                    component={<Link to="/inicio" onClick={() => handleToggleSidebar(false)}/>}
                    active={isActiveRoute('/inicio')}
                >
                  Dashboard
                </MenuItem>
            )}

            {user && (
                <SubMenu
                    label="Formularios"
                    icon={<FaList/>}
                    defaultOpen={location.pathname.includes('/forms') || location.pathname.includes('/registros')}
                >
                  <MenuItem
                      // icon={<FaPlus />}
                      component={<Link to="/forms/new" onClick={() => handleToggleSidebar(false)}/>}
                      active={isActiveRoute('/forms/new')}
                  >
                    <FaPlus size={16} style={{marginRight: 8}}/>
                    Nuevo Formulario
                  </MenuItem>
                  <MenuItem
                      // icon={<FaList />}
                      component={<Link to="/registros" onClick={() => handleToggleSidebar(false)}/>}
                      active={isActiveRoute('/registros')}
                  >
                    <FaList size={16} style={{marginRight: 8}}/>
                    Ver Registro
                  </MenuItem>
                </SubMenu>
            )}
            {/* Separador */}
            <div className="sidebar-separator"/>

            {!user && (
                <MenuItem
                    icon={<FaSignInAlt/>}
                    component={<Link to="/login" onClick={() => handleToggleSidebar(false)}/>}
                    active={isActiveRoute('/login')}
                >
                  Iniciar Sesión
                </MenuItem>
            )}

            {user && (
              <div className="sidebar-btn-wrapper">
                <button
                    className="sidebar-btn"
                    onClick={handleLogout}
                    title={'Cerrar sesión'}
                >
                  <FaSignOutAlt />
                  {!collapsed && <span>Cerrar sesión</span>}
                </button>
              </div>
            )}

          </Menu>
        </Sidebar>

        <main className="main-content">
          {/* Botón de toggle para móviles */}
          <div
              className={`btn-toggle ${toggled ? 'hidden' : ''}`}
              onClick={() => handleToggleSidebar(true)}
          >
            <FaBars/>
          </div>

          {/* Contenido principal */}
          <div className="app-container">
            <div className="scrollable-content">
              <Routes>
                <Route path="/" element={<Info />} />
                <Route path="/beneficios" element={<Beneficios />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/contacto" element={<Contacto />} />
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
                <Route path="/registros" element={
                  <div className="registros-page-container">
                    <ListadoFormularios />
                  </div>
                } />
              </Routes>
            </div>
          </div>

          <Footer />
        </main>
      </div>
  );
}

// Componente principal con Router
function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}

export default App;