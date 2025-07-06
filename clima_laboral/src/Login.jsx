import React, { useState, useEffect } from "react";
import "./App.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Redirigir automáticamente si ya hay sesión
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/inicio/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log(apiUrl)
      const res = await fetch(apiUrl+"api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Credenciales incorrectas");
        return;
      }

      const data = await res.json();

      if (!data.token || !data.usuario) {
        setError("Respuesta inválida del servidor");
        return;
      }

      const meRes = await fetch(apiUrl+"api/me", {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!meRes.ok) {
        setError("Token inválido o expirado");
        return;
      }

      const meData = await meRes.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(meData.user));

      navigate("/inicio/");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">RH</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="usuario o correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">
          <FaUser className="icon" />
          Iniciar sesión
        </button>
        {error && <p className="error-text" style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
