// Sidebar.jsx
import {
    Sidebar,
    Menu,
    MenuItem,
    SubMenu,
    useProSidebar,
} from 'react-pro-sidebar';
import {
    FaAngleDoubleLeft, FaAngleDoubleRight, FaTachometerAlt, FaTools,
    FaChartBar, FaFolderOpen, FaPhone, FaUser,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import bgImg from '../assets/bg1.jpg';

export default function AppSidebar({ image = true }) {
    const { collapseSidebar, collapsed, toggleSidebar, broken } = useProSidebar();

    return (
        <Sidebar
            backgroundImage={image ? bgImg : undefined}
            breakPoint="md"
            onBackdropClick={() => toggleSidebar(false)}
            rootStyles={{ height: '100vh' }}
        >
            <Menu>
                <MenuItem
                    icon={collapsed ? <FaAngleDoubleRight /> : undefined}
                    suffix={collapsed ? null : <FaAngleDoubleLeft />}
                    onClick={() => collapseSidebar()}
                >
                    {!collapsed && 'CREHCE'}
                </MenuItem>
            </Menu>

            <Menu>
                <MenuItem
                    icon={<FaTachometerAlt />}
                    component={<NavLink to="/" />}
                >
                    ¿Quiénes somos?
                </MenuItem>

                <MenuItem
                    icon={<FaTools />}
                    component={<NavLink to="/servicios" />}
                >
                    Servicios
                </MenuItem>

                <MenuItem
                    icon={<FaChartBar />}
                    component={<NavLink to="/beneficios" />}
                >
                    Beneficios
                </MenuItem>

                <MenuItem
                    icon={<FaFolderOpen />}
                    component={<NavLink to="/proyectos" />}
                >
                    Proyectos
                </MenuItem>

                <MenuItem
                    icon={<FaPhone />}
                    component={<NavLink to="/contacto" />}
                >
                    Contacto
                </MenuItem>
            </Menu>

            {/* ---------- Footer ---------- */}
            <div style={{ marginTop: 'auto' }}>
                <Menu>
                    <MenuItem
                        icon={<FaUser />}
                        component={<NavLink to="/perfil" />}
                    >
                        Mi cuenta
                    </MenuItem>
                </Menu>
            </div>
        </Sidebar>
    );
}
