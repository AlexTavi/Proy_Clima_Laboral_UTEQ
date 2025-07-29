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
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {toast} from "react-hot-toast";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');

const handleAplicar = async (row) => {
  try {
    console.log("📌 Datos enviados a handleAplicar:", row);

    if (!row.id_cuestionario || !row.id_empresa) {
      alert("❌ No se encontró id_cuestionario o id_empresa. Verifica los datos.");
      return;
    }

    const confirmar = confirm(
      `¿Deseas generar tokens para el cuestionario ${row.id_cuestionario} de la empresa ${row.nom_empresa}?`
    );
    if (!confirmar) return;

    const res = await fetch("https://encuestas.grupocrehce.com/generar-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_cuestionario: row.id_cuestionario,
        id_empresa: row.id_empresa,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert(`✅ Tokens generados: ${data.tokens_generados}`);
      console.log("🔑 Tokens generados:", data.tokens);

      // ✅ Descargar Excel con tokens
      const blob = new Blob(
        [
          "Token\n" +
            data.tokens.map((t) => t).join("\n")
        ],
        { type: "text/csv;charset=utf-8;" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tokens_cuestionario_${row.id_cuestionario}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      // Opcional: Preguntar si redirigir al primer token
      if (confirm("¿Quieres ir al cuestionario con el primer token?")) {
        window.location.href = `https://encuestas.grupocrehce.com/cuestionario?token=${data.tokens[0]}`;
      }
    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (e) {
    console.error("❌ Error en handleAplicar:", e);
    alert("❌ No se pudo conectar con el servidor de tokens.");
  }
};

export default function Formulario() {
  const [rows, setRows] = useState([]);
  const [search] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);


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
          id_empresa: item.id_empresa,       // ✅ NECESARIO
          nom_empresa: item.nom_empresa,
          tipo: item.tipo,
          created_at: item.created_at || "",
          }))
        );
      } catch (error) {
        console.error("❌ Error al cargar cuestionarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCuestionarios();
  }, [refresh]);

  async function handleEliminar(row) {
    const id = row.id_cuestionario;

    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar el cuestionario #${id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      footer: `<div style="margin-top:10px; font-size: 14px;">
               <FontAwesomeIcon icon="${DeleteIcon}" /> Esta acción no se puede deshacer
             </div>`
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}api/forms/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
          setRefresh(prev => prev + 1);
        } else{
          toast.error(data.message);
        }

      } catch (error) {
        console.error("❌ Error al eliminar:", error);
        Swal.fire('Error', 'No se pudo eliminar el cuestionario.', 'error');
      }
    }
  }

  const filteredRows = rows.filter(
    (r) =>
      r.nom_empresa?.toLowerCase().includes(search.toLowerCase())
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
              color="secondary"
              onClick={() =>
                navigate(`/formulario/${params.row.id_cuestionario}`)
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() =>handleEliminar(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>


          <Tooltip title="Aplicar">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleAplicar(params.row)}
            >
              <FormatIndentIncreaseIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
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
