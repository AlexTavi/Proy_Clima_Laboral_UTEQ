import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";

const slides = [
  {
    image: "./images/ima1.jpg",
    title: "Consultoría en Recursos Humanos",
    description: "Más de 30 años de experiencia atendiendo empresas de diversos sectores.",
  },
  {
    image: "./images/ima2.jpg",
    title: "Fortalecemos el capital humano",
    description: "Proporcionamos herramientas para maximizar competencias.",
  },
  {
    image: "./images/ima3.jpg",
    title: "Soluciones efectivas",
    description: "Aportamos estrategias basadas en amplio conocimiento y visión empresarial.",
  },
];

export default function Info() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      {/* ✅ Carrusel pantalla completa */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <img
          src={slides[current].image}
          alt={`Slide ${current + 1}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.5s ease-in-out",
          }}
        />

        {/* ✅ Texto superpuesto */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "20px 40px",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
            {slides[current].title}
          </h1>
          <p style={{ fontSize: "1.2rem" }}>{slides[current].description}</p>
        </div>

        {/* ✅ Flechas navegación */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
            borderRadius: "50%",
          }}
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
            borderRadius: "50%",
          }}
        >
          ❯
        </button>
      </section>

      {/* ✅ Texto debajo del carrusel */}
      <section
        id="quienes-somos"
        className="section-info"
        style={{ textAlign: "center", padding: "40px 20px" }}
      >
        <h2 className="info-heading" style={{ fontSize: "2rem", marginBottom: "20px" }}>
          <FaUser className="info-icon" /> ¿Quiénes somos?
        </h2>

        <p>
          Grupo CREHCE es una firma de Consultoría en Recursos Humanos con más de 30 años de experiencia,
          atendiendo empresas de diversos sectores.
        </p>
        <p>
          Nuestro objetivo es proporcionar herramientas para fortalecer el capital humano maximizando sus competencias
        </p>
        <p>
          Tenemos una sólida experiencia en el desarrollo de proyectos de diversa índole en el área de recursos humanos,
          para empresas de diferentes sectores y tamaños.
        </p>
        <p>
          Contamos con una amplia visión, debido al conocimiento de diversas culturas y procesos de trabajo;
          por ello, podemos aportar soluciones efectivas a los problemas que enfrentas.
        </p>
      </section>
    </>
  );
}
