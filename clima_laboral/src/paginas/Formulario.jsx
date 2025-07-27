import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');

// ✅ Simulación de envío a Rasa
async function handleNuevoFormulario(formulario) {
  // try {
  //   const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       sender: `usuario_${formulario.id_cuestionario}`,
  //       message: "Nuevo formulario de empresa",
  //       metadata: { formulario },
  //     }),
  //   });
  //   const data = await response.json();
  //   const respuestaIA = data.map((msg) => msg.text).filter(Boolean).join("\n");
  //   alert(respuestaIA || "Rasa procesó los datos correctamente.");
  // } catch {
  //   alert("Error enviando a la IA.");
  // }
}

export default function Formulario() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCuestionarios = async () => {
      try {
        const res = await fetch(apiUrl+"api/cuestionarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("🔍 Datos crudos del backend:", data); // 👈 Agregado

        // ✅ Confirmamos que incluimos "created_at" correctamente
        setRows(
          data.map((item) => ({
            id: item.id_cuestionario,
            id_cuestionario: item.id_cuestionario,
            nom_empresa: item.nom_empresa,
            tipo: item.tipo,
            created_at: item.created_at || "", // aseguramos que siempre existe
          }))
        );
      } catch (error) {
        console.error("❌ Error al cargar cuestionarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCuestionarios();
  }, []);

  const filteredRows = rows.filter(
    (r) =>
      r.nom_empresa?.toLowerCase().includes(search.toLowerCase()) ||
      r.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "id_cuestionario", headerName: "ID", width: 80 },
    { field: "nom_empresa", headerName: "Empresa", width: 180 },
    { field: "tipo", headerName: "Tipo", width: 120 },
    {
      field: "created_at",
      headerName: "Creado el",
      width: 140,
      renderCell: (params) => {
        const fecha = params.row.created_at;
        if (!fecha) return "Sin fecha";

        // ✅ Lo formateamos a dd/mm/yyyy
        const fechaValida = fecha.includes("T") ? fecha : `${fecha}T00:00:00`;
        return new Date(fechaValida).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Tooltip title="Ver Preguntas">
            <IconButton
              size="small"
              color="info"
              onClick={() =>
                navigate(`/formulario/${params.row.id_cuestionario}`)
              }
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                alert(`Eliminar cuestionario ${params.row.id_cuestionario}`)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                alert(`Editar cuestionario ${params.row.id_cuestionario}`)
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Enviar a Rasa">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleNuevoFormulario(params.row)}
            >
              <PostAddIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <TextField
        variant="outlined"
        label="Buscar cuestionario"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </Box>
  );
}
