import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {toast} from "react-hot-toast";
import {esES} from "@mui/x-data-grid/locales";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');

const handleAplicar = async (row) => {
  try {
    // console.log("📌 Datos enviados a handleAplicar:", row);

    if (!row.id_cuestionario || !row.id_empresa) {
      toast.error("No se encontró id_cuestionario o id_empresa. Verifica los datos.");
      return;
    }

    const result = await Swal.fire({
      title: '¿Generar tokens?',
      html: `¿Deseas generar tokens para el cuestionario <strong>${row.id_cuestionario}</strong> de la empresa <strong>${row.nom_empresa}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;


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

const handleDescargar = async (row) => {
  try {
    if (!row.id_cuestionario || !row.id_empresa) {
      toast.error("No se encontró id_cuestionario o id_empresa. Verifica los datos.");
      return;
    }

    const result = await Swal.fire({
      title: '¿Descargar reporte?',
      html: `¿Deseas descargar el reporte del cuestionario <strong>${row.id_cuestionario}</strong> de la empresa <strong>${row.nom_empresa}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, descargar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    const response = await fetch(apiUrl+`api/exportar-frecuencia/${row.id_cuestionario}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    });

    if (!response.ok) throw new Error('Error al obtener el archivo Excel');

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-cuestionario-${row.id_cuestionario}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("✅ Reporte descargado correctamente");

  } catch (e) {
    console.error(e);
    toast.error("No se pudo descargar el archivo");
  }
};


const handleRevisar = async (row) => {
  try {
    // Mostrar feedback breve de acción
    const loadingToast = toast.loading('Redirigiendo al reporte...');
    
    // Construir la URL del reporte con el id_cuestionario
    const reportUrl = `https://revisar.grupocrehce.com/reportes/${row.id_cuestionario}`;
    
    // Redirigir a la nueva pestaña
    window.open(reportUrl, '_blank');
    
    // Cerrar el toast de carga
    toast.dismiss(loadingToast);
    toast.success('Redirección exitosa');
    
  } catch (error) {
    // Manejo de errores
    toast.dismiss(loadingToast);
    toast.error(`Error al redirigir: ${error.message}`);
    console.error('Error en handleRevisar:', error);
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },

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
          status_token: item.status_token || "",
          tokens: item.tokens || "",
          tokens_usados: item.tokens_usados || "",
          }))
        );
      } catch (error) {
        console.error("❌ Error al cargar cuestionarios:", error);
        window.location.reload();
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
            "Content-Type": "application/json",
            Accept: "application/json"
          },
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
      field: "status_token",
      headerName: "Estatus",
      width: 120,
      renderCell: (params) => {
        console.log(params.row)
        const status = params.row.status_token;
        const color = status.toLowerCase() === "activo" ? "green" : "red";
        return (
            <span style={{ color, fontWeight: "bold" }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        );
      },
    },
    {
      field: "tokens_usados",
      headerName: "Tokens usados",
      width: 140,
      renderCell: (params) => {
        const usados = params.row.tokens_usados ?? 0;
        const total = params.row.tokens ?? 0;
        return `${usados} de ${total}`;
      },
    },
    {
      field: "created_at",
      headerName: "Creado el",
      width: 140,
      renderCell: (params) => {
        const fecha = params.row.created_at;
        if (!fecha) return "Sin fecha";
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
            {params.row.status_token !== 'activo' && (
              <Tooltip title="Editar">
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
            )}

            <Tooltip title="Eliminar">
              <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleEliminar(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            {params.row.status_token !== 'activo' && (
                <Tooltip title="Aplicar">
                  <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleAplicar(params.row)}
                  >
                    <FormatIndentIncreaseIcon />
                  </IconButton>
                </Tooltip>
            )}
            {params.row.status_token !== 'inactivo' && (
                <Tooltip title="Aplicar">
                  <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleDescargar(params.row)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
            )}
            <Tooltip title="Revisar Formulario">
                  <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleRevisar(params.row)}
                  >
                    <ChecklistIcon />
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
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
        />
      )}
    </Box>
  );
}
