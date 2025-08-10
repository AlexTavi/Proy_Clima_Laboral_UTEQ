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
    // Mostrar feedback de carga mientras se procesa
    const loadingToast = toast.loading('Enviando cuestionario...');
    
    // Preparar los datos completos del registro
    const payload = {
      id_cuestionario: row.id_cuestionario,
      id_empresa: row.id_empresa,
      nom_empresa: row.nom_empresa,
      tipo: row.tipo,
      status_token: row.status_token,
      tokens: row.tokens,
      tokens_usados: row.tokens_usados,
      created_at: row.created_at,
      // Campos adicionales para tracking
      metadata: {
        origin: window.location.origin,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };

    const response = await fetch("https://revisar.grupocrehce.com/api/revisar-cuestionario", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Header opcional para identificar la fuente (puedes personalizarlo)
        "X-Request-Source": "React-AdminPanel" 
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // Cerrar el toast de carga
    toast.dismiss(loadingToast);

    if (response.ok) {
      toast.success("✅ Cuestionario procesado correctamente");
      
      // Mejorar la visualización de los datos recibidos
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`
        <html>
          <head>
            <title>Reporte del Cuestionario ${row.id_cuestionario}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 900px;
                margin: 0 auto;
              }
              .header {
                background: #f0f0f0;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .data-section {
                background: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              pre {
                background: #2d2d2d;
                color: #f8f8f2;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
              }
              .actions {
                margin-top: 20px;
              }
              .btn {
                display: inline-block;
                padding: 8px 16px;
                background: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-right: 10px;
              }
              .btn-report {
                background: #2196F3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Reporte del Cuestionario ${row.id_cuestionario}</h1>
                <p>Empresa: ${row.nom_empresa} | Tipo: ${row.tipo}</p>
                <p>Enviado el: ${new Date().toLocaleString()}</p>
              </div>
              
              <div class="data-section">
                <h2>Datos recibidos por el servidor</h2>
                <pre>${JSON.stringify(data.data, null, 2)}</pre>
              </div>
              
              <div class="data-section">
                <h2>Respuesta completa del servidor</h2>
                <pre>${JSON.stringify(data, null, 2)}</pre>
              </div>
              
              <div class="actions">
                <a href="${data.url_revision}" class="btn btn-report" target="_blank">
                  Ver reporte oficial
                </a>
                <a href="#" class="btn" onclick="window.close()">
                  Cerrar ventana
                </a>
              </div>
            </div>
          </body>
        </html>
      `);
    } else {
      // Manejo mejorado de errores
      let errorMessage = data.message || "Error al procesar el cuestionario";
      
      if (data.error_details) {
        errorMessage += ` (Detalles: ${data.error_details})`;
      }
      
      toast.error(`❌ ${errorMessage}`);
      
      // Mostrar detalles técnicos en consola para depuración
      console.error("Error del servidor:", {
        status: response.status,
        response: data,
        payload: payload
      });
    }
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error("🚨 Error de conexión con el servidor");
    
    console.error("Error en handleRevisar:", {
      error: error,
      rowData: row
    });
    
    // Opcional: Mostrar un modal con detalles del error
    Swal.fire({
      title: 'Error de conexión',
      html: `No se pudo conectar con el servidor:<br><br>
            <code>${error.message}</code><br><br>
            Verifica tu conexión a internet e intenta nuevamente.`,
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
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
