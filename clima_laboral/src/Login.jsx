import React from "react";
import "./App.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías validar el usuario antes
    navigate("/inicio/");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">RH</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="usuario o correo" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">
          <FaUser className="icon" />
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}


