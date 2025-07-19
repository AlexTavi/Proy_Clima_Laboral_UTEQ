import React, { useState, useEffect } from "react";
import "../App.scss";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth-context";
import { Toaster, toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const apiUrl = "https://api.grupocrehce.com/";
  const { login } = useAuth();

  // ✅ Redirigir automáticamente si ya hay sesión y el token es válido
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(apiUrl + "api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          navigate("/inicio");
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => localStorage.removeItem("token"));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Intentando login con:", email);
      const res = await fetch(apiUrl + "api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Credenciales incorrectas");
        toast.error("Credenciales incorrectas");
        return;
      }

      const data = await res.json();

      if (!data.token) {
        setError("Respuesta inválida del servidor");
        toast.error("Respuesta inválida del servidor");
        return;
      }

      const meRes = await fetch(apiUrl + "api/me", {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!meRes.ok) {
        setError("Token inválido o expirado");
        toast.error("Token inválido o expirado");
        return;
      }

      const meData = await meRes.json();

      // ✅ Guarda sesión antes de redirigir
      login(data.token, meData.user);
      localStorage.setItem("token", data.token);

      toast.success("Inicio de sesión exitoso");
      console.log("Redirigiendo a /inicio");
      navigate("/inicio");
    } catch (err) {
      console.error("Error en login:", err.message);
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">RH</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Usuario o correo"
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
      <Toaster position="top-right" />
    </div>
  );
}
