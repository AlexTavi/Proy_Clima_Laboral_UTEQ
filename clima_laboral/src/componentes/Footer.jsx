import {
    FaHeart,
    FaFacebookSquare,
    FaTwitterSquare,
    FaLinkedin,
    FaEnvelope,
} from 'react-icons/fa';

function Footer() {
    return (
        <>
            <footer className="site-footer">
                {/* Créditos */}
                <small className="credit">
                    <FaHeart className="heart" /> Hecho con cariño por&nbsp;
                    <a
                        href="https://granada.com.gt/es/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Grupo Crehce
                    </a>
                </small>

                {/* Redes sociales */}
                <nav className="social">
                    <a
                        href="https://www.facebook.com/grupo.crehce"
                        aria-label="Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaFacebookSquare />
                    </a>
                    <a
                        href="https://twitter.com/grupo_crehce"
                        aria-label="Twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaTwitterSquare />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/grupo-crehce"
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="mailto:contacto@crehce.com"
                        aria-label="Correo"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaEnvelope />
                    </a>
                </nav>
            </footer>

            {/* === ESTILOS DEL FOOTER (mueve a .scss si lo prefieres) === */}
            <style>{`
        :root {
          --clr-primary: #005bd1;
          --clr-bg: #f6f8fa;
          --clr-text: #2c2c2c;
          --clr-accent: #e63946; /* rojo del corazón */
        }

        .site-footer {
          background: var(--clr-bg);
          padding: .1rem .5rem;
          text-align: center;
          color: var(--clr-text);
        }

        /* Créditos */
        .credit {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: .35rem;
          font-size: .9rem;
          flex-wrap: wrap;
        }
        .heart {
          color: var(--clr-accent);
        }
        .credit a {
          color: var(--clr-primary);
          font-weight: 600;
          text-decoration: none;
        }
        .credit a:hover {
          text-decoration: underline;
        }

        /* Redes sociales */
        .social {
          margin-top: .75rem;
          display: flex;
          justify-content: center;
          gap: 1.1rem;
        }
        .social a {
          font-size: 1.35rem;
          color: var(--clr-text);
          transition: color .2s ease;
        }
        .social a:hover {
          color: var(--clr-primary);
        }

        /* Pequeña animación de aparición */
        @media (prefers-reduced-motion: no-preference) {
          .site-footer {
            animation: fadeUp .6s ease-out both;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
        </>
    );
}

export default Footer;

