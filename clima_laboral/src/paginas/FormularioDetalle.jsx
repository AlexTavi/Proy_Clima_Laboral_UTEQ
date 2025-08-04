import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from '@mui/icons-material/Cancel';
import GlassCard from "../componentes/GlassCard";
import Swal from 'sweetalert2';
import {toast} from "react-hot-toast";
import PreguntaForm from "../componentes/PreguntaForm";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');

export default function FormularioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState([]);
  const [dimensiones, setDimensiones] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [agregando, setAgregando] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    pregunta: "",
    id_dimension: "",
    id_escala: "",
  });

  // ✅ Cargar datos del backend
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch(apiUrl+"api/cuestionario/edit", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id_cuestionario: parseInt(id) }),
        });
        const data = await res.json();
        setPreguntas(data.cuestionario?.preguntas || []);
        setDimensiones(data.dimensiones || []);
        setEscalas(data.escalas || []);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [id]);

  // Guardar pregunta editada
  const handleGuardarPregunta = async (index) => {
    const p = preguntas[index];
    try {
      const res = await fetch(apiUrl + `api/update-reactivos/${p.id_cr}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pregunta: p.pregunta,
          id_dimension: p.id_dimension,
          id_escala: p.id_escala,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Pregunta actualizada correctamente");
        setEditandoIndex(null);
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      toast.error("Error al actualizar la pregunta");
    }
  };

  // Cambiar texto, dimensión o escala en tiempo real para edición
  const handleCambio = (index, campo, valor) => {
    const actualizadas = [...preguntas];
    actualizadas[index][campo] = valor;
    setPreguntas(actualizadas);
  };

  // Cambiar texto, dimensión o escala en tiempo real para nueva pregunta
  const handleCambioNueva = (campo, valor) => {
    setNuevaPregunta((prev) => ({ ...prev, [campo]: valor }));
  };

  // Guardar nueva pregunta
  const handleGuardarNuevaPregunta = async () => {
    if (
      !nuevaPregunta.pregunta.trim() ||
      !nuevaPregunta.id_dimension ||
      !nuevaPregunta.id_escala
    ) {
      alert("Por favor completa todos los campos para la nueva pregunta.");
      return;
    }
    try {
      const res = await fetch(apiUrl + `api/create-reactivo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_cuestionario: parseInt(id),
          pregunta: nuevaPregunta.pregunta,
          id_dimension: nuevaPregunta.id_dimension,
          id_escala: nuevaPregunta.id_escala,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Pregunta creada correctamente");
        setPreguntas((prev) => [...prev, data.pregunta]); // Asumiendo backend devuelve la pregunta creada
        setAgregando(false);
        setNuevaPregunta({ pregunta: "", id_dimension: "", id_escala: "" });
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error al crear pregunta:", error);
      alert("Error al crear la pregunta");
    }
  };

  // Eliminar pregunta
  const handleEliminarPregunta = async (index) => {
    const p = preguntas[index];

    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás la pregunta: "${p.pregunta}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const res = await fetch(apiUrl + `api/delete-reactivos/${p.id_cr}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        setPreguntas((prev) => prev.filter((_, i) => i !== index));
        await toast.success('La pregunta fue eliminada correctamente.');
      } else {
        await toast.error('No se pudo eliminar la pregunta.');
      }
    } catch (error) {
      console.error("❌ Error eliminando pregunta:", error);
      toast.error('Ocurrió un problema al eliminar.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Título y botón volver */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Tooltip title="Volver">
          <IconButton color="primary" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: 1, color: "#4946a9" }}>
          Cuestionario #{id}
        </Typography>
      </Box>

      <GlassCard>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
          Preguntas del cuestionario
        </Typography>

        {/* Botón para agregar nueva pregunta */}
        {!agregando && (
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" onClick={() => setAgregando(true)}>
              Agregar pregunta
            </Button>
          </Box>
        )}

        {/* Formulario para nueva pregunta */}
        {agregando && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
            }}
          >
            <PreguntaForm
              preguntaData={nuevaPregunta}
              dimensiones={dimensiones}
              escalas={escalas}
              onChange={handleCambioNueva}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" color="success" onClick={handleGuardarNuevaPregunta} startIcon={<SaveIcon />}>
                Guardar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setAgregando(false);
                  setNuevaPregunta({ pregunta: "", id_dimension: "", id_escala: "" });
                }}
                startIcon={<CancelIcon />}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        )}

        {preguntas.length > 0 ? (
          preguntas.map((p, index) => (
            <Box
              key={p.id_cr}
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: 2,
                borderBottom: "1px solid #ddd",
                pb: 1,
              }}
            >
              {editandoIndex === index ? (
                <>
                  <PreguntaForm
                    preguntaData={p}
                    dimensiones={dimensiones}
                    escalas={escalas}
                    onChange={(campo, valor) => handleCambio(index, campo, valor)}
                  />

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleGuardarPregunta(index)}
                      startIcon={<SaveIcon />}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setEditandoIndex(null)}
                      startIcon={<CancelIcon />}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {index + 1}. {p.pregunta}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dimensión:{" "}
                      <strong>
                        {dimensiones.find((d) => d.id_dimension === p.id_dimension)
                          ?.nombre || p.nom_dimension}
                      </strong>{" "}
                      | Escala:{" "}
                      <strong>
                        {escalas.find((e) => e.id_escala === p.id_escala)?.nombre ||
                          p.nom_escala}
                      </strong>
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => setEditandoIndex(index)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => handleEliminarPregunta(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}
            </Box>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            No hay preguntas registradas.
          </Typography>
        )}
      </GlassCard>
    </Box>
  );
}
