import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, CircularProgress, Tooltip, IconButton } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// ✅ Enviar formulario a Rasa
async function handleNuevoFormulario(formulario) {
  if (!formulario || (!formulario.id_formulario && !formulario.id_empresa)) {
    alert("No hay datos válidos para enviar a la IA.");
    return;
  }
  try {
    const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: `usuario_${formulario.id_formulario || formulario.id_empresa}`,
        message: "Nuevo formulario de empresa",
        metadata: { formulario }
      })
    });
    const data = await response.json();
    const respuestaIA = data.map(msg => msg.text).filter(Boolean).join("\n");
    alert(respuestaIA || "Rasa procesó los datos correctamente.");
  } catch {
    alert("Error enviando a la IA.");
  }
}

export default function Formulario() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(apiUrl + 'api/forms', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const rowsConId = Array.isArray(data.data)
          ? data.data.map(f => ({ ...f, id: f.id_formulario || f.id_empresa }))
          : [];
        setRows(rowsConId);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRows = rows.filter(r =>
    r.nom_empresa?.toLowerCase().includes(search.toLowerCase()) ||
    r.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'id_formulario', headerName: 'ID', width: 80 },
    { field: 'nom_empresa', headerName: 'Empresa', width: 180 },
    { field: 'tipo', headerName: 'Tipo', width: 120 },
    {
      field: 'reactivos',
      headerName: 'Preguntas',
      width: 300,
      valueGetter: (params) => {
        const preguntas = params?.row?.reactivos || [];
        if (!Array.isArray(preguntas)) return '';
        return preguntas
          .map((p, i) => `${i + 1}. ${p.pregunta || ''} (${p.respuesta || 'Sin respuesta'})`)
          .join(' | ');
      }
    },
    {
      field: 'created_at',
      headerName: 'Creado el',
      width: 140,
      valueGetter: (params) =>
        params?.row?.created_at
          ? new Date(params.row.created_at).toLocaleDateString()
          : ''
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 160,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => alert(`Eliminar formulario ${params.row.id_formulario}`)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => alert(`Editar formulario ${params.row.id_formulario}`)}
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
    }
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <TextField
        variant="outlined"
        label="Buscar formulario"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          getRowId={(row) => row.id_formulario || row.id_empresa}
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
import { Link } from 'react-router-dom';
import { FaList } from 'react-icons/fa';  