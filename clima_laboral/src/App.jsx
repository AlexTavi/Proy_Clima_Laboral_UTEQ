import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useState } from "react";
import {
  FaBars,
  FaCubes,
  FaBuilding,
  FaPlus,
  FaList,
  FaSignOutAlt,
  FaWpforms,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';
import Swal from 'sweetalert2';

import Login from './paginas/Login.jsx';
import Dashboard from './paginas/Dashboard.jsx';
import NuevoFormulario from './paginas/new.jsx';
import Empresas from './paginas/Empresas.jsx';
import Formulario from './paginas/Formulario.jsx';
import FormularioDetalle from "./paginas/FormularioDetalle.jsx";
import { Toaster } from "react-hot-toast";
import './App.scss';
import Navbar from "./componentes/NavBar.jsx";

function AppContent() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState("");
  const hider = ["/", "/login"].includes(location.pathname);

  const handleCollapsedChange = () => setCollapsed(!collapsed);
  const handleToggleSidebar = (value) => setToggled(value);
  const isActiveRoute = (path) => location.pathname === path;

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/', { replace: true });
      }
    });
  };

  return (
    <div className={`app ${toggled ? 'toggled' : ''}`}>
      {toggled && (
          <div
              className="custom-backdrop"
              onClick={() => handleToggleSidebar(false)}
          />
      )}
      {!hider && (
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          width="240px"
          collapsedWidth="80px"
          backgroundColor="#eaebee"
          transitionDuration={300}
          onBackdropClick={() => handleToggleSidebar(false)}
          breakPoint="md"
          onBreakPoint={(broken) => { if (broken) setCollapsed(false); }}
          rootStyles={{
            color: '#000',
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {/*<div className="sidebar-header">*/}
          {/*  <div className="sidebar-logo-collapsed">*/}
          {/*    <img src={logo} alt="Logo" className="sidebar-logo-collapsed" />*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="sidebar-btn-wrapper">
            <button
              className="sidebar-btn"
              onClick={handleCollapsedChange}
              title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
            </button>
          </div>

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
            <>

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

              <div className="sidebar-btn-wrapper">
                <button className="sidebar-btn" onClick={handleLogout} title="Cerrar sesión">
                  <FaSignOutAlt />
                  {!collapsed && <span>Cerrar sesión</span>}
                </button>
              </div>
            </>
          </Menu>
        </Sidebar>
      )}
      <main className="main-content">
        <div
          className={`btn-toggle ${toggled ? 'hidden' : ''}`}
          onClick={() => handleToggleSidebar(true)}
        >
          <FaBars />
        </div>

        {!hider && <Navbar title={pageTitle} />}
          <div className="scrollable-content">
            <Routes>
              <Route path="/" element={<Login setPageTitle={setPageTitle}/>} />
              <Route path="/login" element={<Login setPageTitle={setPageTitle}/>} />
              <Route path="/dashboard/:id_formulario" element={<Dashboard setPageTitle={setPageTitle}/>} />
              <Route path="/forms/new" element={<NuevoFormulario setPageTitle={setPageTitle}/>} />
              <Route path="/forms/edit/:id_empresa" element={<NuevoFormulario setPageTitle={setPageTitle}/>} />
              <Route path="/registros" element={<Empresas setPageTitle={setPageTitle}/>} />
              <Route path="/formularios" element={<Formulario setPageTitle={setPageTitle}/>} />
              <Route path="/formulario/:id" element={<FormularioDetalle setPageTitle={setPageTitle}/>} />
            </Routes>
          </div>
        <Toaster position="bottom-right" />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
