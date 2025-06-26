import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Inicio from "./inicio/inicio";
import NuevoFormulario from "./forms/new";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/forms" element={<NuevoFormulario />} /> {/* <--- AÑADIDO */}
      </Routes>
    </Router>
  );
}

export default App;

