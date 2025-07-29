import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useState } from "react";
import {
  FaBars,
  FaCheck,
  FaInfoCircle,
  FaHandHolding,
  FaProjectDiagram,
  FaEnvelope,
  FaSignInAlt,
  FaPlus,
  FaList,
  FaBuilding,
  FaCubes,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSignOutAlt,
  FaWpforms
} from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';

import Principal from './paginas/principal.jsx';
import Login from './paginas/Login.jsx';
import Inicio from './paginas/inicio.jsx';
import NuevoFormulario from './paginas/new.jsx';
import Footer from "./componentes/Footer.jsx";
import Info from "./paginas/Info.jsx";
import Servicios from "./paginas/Servicios.jsx";
import Proyectos from "./paginas/Proyectos.jsx";
import Contacto from "./paginas/Contacto.jsx";
import Empresas from "./paginas/Empresas.jsx";
import Formulario from "./paginas/Formulario.jsx"; // ✅ Importación correcta
import './App.scss';
import logo from '../imagen.jpg';
import Beneficios from "./paginas/Beneficios.jsx";
import {Toaster} from "react-hot-toast";
import FormularioDetalle from "./paginas/FormularioDetalle.jsx";

// ✅ Componente interno para manejar Sidebar + Rutas
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
    setToggled(value);
  };

  const isActiveRoute = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
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
          if (broken) setCollapsed(false);
        }}
        rootStyles={{
          color: '#000',
          fontSize: '14px',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {/* Header del sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-logo-collapsed">
            <img src={logo} alt="Logo" className="sidebar-logo-collapsed" />
          </div>
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
            button: ({ active }) => ({
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
            icon: ({ active }) => ({
              color: active ? '#fff' : '#4946a9',
              marginRight: collapsed ? 0 : 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              width: collapsed ? '100%' : 'auto',
            }),
            label: { fontWeight: '500' },
            subMenuContent: { backgroundColor: '#fff' },
          }}
        >
          {/* Información pública */}
          {!user && (
            <>
              <MenuItem
                icon={<FaInfoCircle />}
                component={<Link to="/" onClick={() => handleToggleSidebar(false)} />}
                active={isActiveRoute('/')}
              >
                Información
              </MenuItem>

              <MenuItem
                icon={<FaCheck />}
                component={<Link to="/beneficios" onClick={() => handleToggleSidebar(false)} />}
                active={isActiveRoute('/beneficios')}
              >
                Beneficios
              </MenuItem>

              <MenuItem
                icon={<FaHandHolding />}
                component={<Link to="/servicios" onClick={() => handleToggleSidebar(false)} />}
                active={isActiveRoute('/servicios')}
              >
                Servicios
              </MenuItem>

              <MenuItem
                icon={<FaProjectDiagram />}
                component={<Link to="/proyectos" onClick={() => handleToggleSidebar(false)} />}
                active={isActiveRoute('/proyectos')}
              >
                Proyectos
              </MenuItem>

              <MenuItem
                icon={<FaEnvelope />}
                component={<Link to="/contacto" onClick={() => handleToggleSidebar(false)} />}
                active={isActiveRoute('/contacto')}
              >
                Contacto
              </MenuItem>
            </>
          )}

          {/* Menú para usuarios logueados */}
          {user && (
            <>
              <MenuItem
                icon={<FaCubes />}
                component={<Link to="/inicio" onClick={() => handleToggleSidebar(false)} />}
                active={isActiveRoute('/inicio')}
              >
                Dashboard
              </MenuItem>

              <SubMenu
                label="Empresas"
                icon={<FaBuilding />}
                defaultOpen={location.pathname.includes('/forms') || location.pathname.includes('/registros')}
              >
                <MenuItem
                  component={<Link to="/forms/new" onClick={() => handleToggleSidebar(false)} />}
                  active={isActiveRoute('/forms/new')}
                >
                  <FaPlus size={16} style={{ marginRight: 8 }} />
                  Nueva Empresa
                </MenuItem>

                <MenuItem
                  component={<Link to="/registros" onClick={() => handleToggleSidebar(false)} />}
                  active={isActiveRoute('/registros')}
                >
                  <FaList size={16} style={{ marginRight: 8 }} />
                  Ver Empresas
                </MenuItem>
              </SubMenu>

              <MenuItem
                  icon={<FaWpforms />}
                  component={<Link to="/formularios" onClick={() => handleToggleSidebar(false)} />}
                  active={isActiveRoute('/formularios')}
              >
                Formularios
              </MenuItem>
            </>
          )}

          {/* Separador */}
          <div className="sidebar-separator" />

          {/* Login / Logout */}
          {!user ? (
            <MenuItem
              icon={<FaSignInAlt />}
              component={<Link to="/login" onClick={() => handleToggleSidebar(false)} />}
              active={isActiveRoute('/login')}
            >
              Iniciar Sesión
            </MenuItem>
          ) : (
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
        <div
          className={`btn-toggle ${toggled ? 'hidden' : ''}`}
          onClick={() => handleToggleSidebar(true)}
        >
          <FaBars />
        </div>

        <div className="app-container">
          <div className="scrollable-content">
            <Routes>
              <Route path="/" element={<Info />} />
              <Route path="/beneficios" element={<Beneficios />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/proyectos" element={<Proyectos />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/forms/new" element={<NuevoFormulario />} />
              <Route path="/forms/edit/:id_empresa" element={<NuevoFormulario />} />
              <Route path="/registros" element={<Empresas />} />
              <Route path="/formularios" element={<Formulario />} />
              <Route path="/formulario/:id" element={<FormularioDetalle />} />
            </Routes>
          </div>
        </div>

            {!user && (<Footer />)}
        </main>
          <Toaster position="bottom-right" />
      </div>
  );
}

// ✅ Componente principal con Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;