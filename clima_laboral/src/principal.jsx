import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaTools,
  FaChartBar,
  FaFolderOpen,
  FaPhone,
  FaBars,
  FaSignInAlt,
} from "react-icons/fa";
import "./principal.css";

const sections = [
  {
    id: "quienes-somos",
    title: "¿Quiénes somos?",
    icon: <FaUser />,
    content: [
      "Grupo CREHCE es una firma de Consultoría en Recursos Humanos con más de 30 años de experiencia, atendiendo empresas de diversos sectores.",
      "Nuestro objetivo es proporcionar herramientas para fortalecer el capital humano y maximizar las competencias de cada colaborador.",
      "Tenemos una sólida experiencia en el desarrollo de proyectos de diversa índole en el área de recursos humanos, para empresas de diferentes sectores y tamaños.",
      "Contamos con una amplia visión, debido al conocimiento de diversas culturas y procesos de trabajo, por ello, tenemos la posibilidad de aportar soluciones efectivas para la solución de problemas.",
    ],
  },
  {
    id: "servicios",
    title: "Servicios",
    icon: <FaTools />,
    content: [
      "Grupo CREHCE es una firma de Consultoría en el área de Recursos Humanos con más de treinta años de experiencia, atendiendo clientes de diversos giros y tamaños (industria automotriz, alimentaria, aeronáutica, farmacéutica, transportistas, comercio y servicios).",
      "Nuestro objetivo fundamental es dotar a nuestros aliados comerciales de herramientas que les permitan alcanzar un alto nivel de calidad en su capital humano, mediante instrumentos con un sólido soporte metodológico para detectar nuevos talentos, o desarrollar al personal con el que se cuenta, aprovechando al máximo las competencias de cada uno para el logro de objetivos.",
      "Tenemos dos tipos de productos:",
      "1.- Complementarios al proceso de selección: Evaluación psicométrica y Estudios socioeconómicos.",
      "2.- Servicio de consultoría con un enfoque integral:",
      "  - Capacitación y Desarrollo",
      "  - Clima Laboral",
      "  - Descripciones y perfiles de puesto",
      "  - Competencias laborales",
      "  - Análisis de estructura organizacional",
    ],
  },
  {
    id: "beneficios",
    title: "Beneficios",
    icon: <FaChartBar />,
    content: [
      "• Pronosticar la conducta laboral y el grado de eficiencia que una persona puede tener en el desempeño del puesto.",
      "• Determinar el potencial de desarrollo de cada persona.",
      "• Saber si la persona se adecúa al puesto que solicita.",
      "• Tendrá información confiable para tomar decisiones de contratación o para el cumplimiento de requisitos de certificaciones (CTPAT, OEA, etc).",
      "• Disminuirá la posibilidad de contratar personal con antecedentes laborales negativos, potencialmente conflictivo, problemas personales o familiares que afecten su productividad.",
    ],
  },
  {
    id: "proyectos",
    title: "Proyectos Realizados",
    icon: <FaFolderOpen />,
    content: [
      "Contamos con 35 años desarrollando proyectos como:",
      "• Evaluación y reubicación de personal en nuevas plantas.",
      "• Perfiles y descripciones de puestos para certificaciones.",
      "• Reducción de rotación en ventas con perfiles adecuados.",
      "• Planes de carrera, clima laboral y diagnóstico organizacional.",
      "• Evaluaciones psicométricas y socio-laborales en múltiples zonas.",
      "• Evaluación de personal para nueva planta (operativo, técnico, administrativo).",
      "• Estructuración de área de selección y desarrollo en empresas manufactureras.",
      "• Análisis de perfiles psicométricos y definición de planes de desarrollo.",
      "• Estudios de clima laboral en múltiples ubicaciones.",
      "• Estrategias para reducir rotación y mejorar procesos de selección en ventas.",
      "• Definición de estructuras organizacionales para empresas de gastronomía y manufactura.",
      "• Evaluación para capacitación en plantas con operaciones internacionales.",
      "• Estudio de contratación de personal altamente especializado en 8 zonas del país.",
      "• Elaboración de baterías psicométricas, solicitudes y herramientas de selección.",
    ],
  },
  {
    id: "contacto",
    title: "Contacto",
    icon: <FaPhone />,
    content: [
      "Gracias por su atención.",
      "📞 Tel: 442 446 8253",
      "Contáctanos para más información sobre nuestros servicios y soluciones personalizadas.",
    ],
  },
];

const Principal = () => {
  const [selected, setSelected] = useState(sections[0].id);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isMobile = windowWidth < 768;
  const currentSection = sections.find((s) => s.id === selected);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (id) => {
    setSelected(id);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="principal-container">
      {isMobile && (
        <button
          className="toggle-sidebar-btn"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar: desktop */}
      {!isMobile && (
        <div className="ps-sidebar-container">
          {sections.map(({ id, title, icon }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`ps-menu-button ${selected === id ? "ps-active" : ""}`}
            >
              {icon} {title}
            </button>
          ))}
          <button
            onClick={handleLogin}
            className="ps-menu-button login-button"
          >
            <FaSignInAlt /> Iniciar Sesión
          </button>
        </div>
      )}

      {/* Sidebar: móvil */}
      {isMobile && mobileMenuOpen && (
        <div className="mobile-sidebar">
          {sections.map(({ id, title, icon }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={selected === id ? "active" : ""}
            >
              {icon} {title}
            </button>
          ))}
          <button
            onClick={handleLogin}
            className="mobile-login-button"
          >
            <FaSignInAlt /> Iniciar Sesión
          </button>
        </div>
      )}

      <main
        className={`content ${
          isMobile && mobileMenuOpen ? "content-shifted" : ""
        }`}
      >
        <h1>{currentSection.title}</h1>
        {currentSection.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </main>
    </div>
  );
};

export default Principal;