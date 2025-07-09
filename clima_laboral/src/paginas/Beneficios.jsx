import { FaChartBar } from "react-icons/fa";

export default function Beneficios() {
    return (
        <section id="beneficios" className="section-info">
            <h2 className="info-heading">
                <FaChartBar className="info-icon"/>
                Beneficios
            </h2>
            <ul>
                <li>Determinar el potencial de desarrollo de cada persona.</li>
                <li>Saber si la persona se adecúa al puesto que solicita.</li>
                <li>Tener información confiable para tomar decisiones de contratación o para el cumplimiento de requisitos de certificaciones (CTPAT, OEA, etc).</li>
                <li>Disminuir la posibilidad de contratar personas con problemas que afecten su productividad.</li>
            </ul>
        </section>

    );
}
