import { FaUser } from 'react-icons/fa';

export default function Info() {
    return (
        <section id="quienes-somos" className="section-info">
            <h2 className="info-heading">
                <FaUser className="info-icon" />
                ¿Quiénes somos?
            </h2>

            <p>
                Grupo CREHCE es una firma de Consultoría en Recursos Humanos con más de 30 años de experiencia, atendiendo empresas de diversos sectores.
            </p>
            <p>
                Nuestro objetivo es proporcionar herramientas para fortalecer el capital humano maximizando sus competencias
            </p>
            <p>
                Tenemos una sólida experiencia en el desarrollo de proyectos de diversa índole en el área de recursos humanos, para empresas de diferentes sectores y tamaños.
            </p>
            <p>
                Contamos con una amplia visión, debido al conocimiento de diversas culturas y procesos de trabajo; por ello, podemos aportar soluciones efectivas a los problemas que enfrentas.
            </p>
        </section>
    );
}
