import React, {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Box, CircularProgress, IconButton, TextField, Tooltip} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {esES} from '@mui/x-data-grid/locales';

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');


// Utilidad para mostrar estructura como string
function resumenEstructura(estructura) {
    if (!estructura) return '';
    return Object.entries(estructura)
        .map(([key, val]) => `${val} ${key}`)
        .join(', ');
}
// ✅ Mandar datos a Rasa con manejo de errores y respuesta real
async function handleNuevoFormulario(empresa) {
    if (!empresa || !empresa.id_empresa) {
        console.error("❌ No se enviaron datos válidos de la empresa:", empresa);
        alert("No hay datos válidos para enviar a la IA.");
        return;
    }

    console.log("🚀 Enviando datos a Rasa:", JSON.stringify({
        sender: `usuario_${empresa.id_empresa}`,
        message: "Nuevo formulario de empresa", // Dispara el intent `nuevo_formulario`
        metadata: { empresa }
    }, null, 2));

    try {
        const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: `usuario_${empresa.id_empresa}`, 
                message: "Nuevo formulario de empresa",
                metadata: { empresa }
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Respuesta de Rasa:", data);

        // 🔥 Mostrar la respuesta real de Rasa
        const respuestaIA = data.map(msg => msg.text).filter(Boolean).join("\n");
        alert(respuestaIA || "Rasa procesó los datos correctamente.");

    } catch (error) {
        console.error("❌ Error al enviar a Rasa:", error);
        alert("Hubo un problema al enviar los datos a la IA. Revisa la consola.");
    }
}

async function handleEliminar(empresa) {
    if (!empresa || !empresa.id_empresa) {
        console.error("❌ No se enviaron datos válidos de la empresa:", empresa);
        alert("No hay datos válidos para enviar a la IA.");
        return;
    }
    const id_empresa = empresa.id_empresa;

    try {
        const response = await fetch(apiUrl + "api/destroy", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_empresa: id_empresa
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Respuesta de Rasa:", data);

        // 🔥 Mostrar la respuesta real de Rasa
        const respuestaIA = data.map(msg => msg.text).filter(Boolean).join("\n");
        alert(respuestaIA || "Rasa procesó los datos correctamente.");

    } catch (error) {
        console.error("❌ Error al enviar a Rasa:", error);
        alert("Hubo un problema al enviar los datos a la IA. Revisa la consola.");
    }
}




export default function Empresas() {
    const [rows, setRows] = useState([]);
    const [search] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch datos del backend
    useEffect(() => {
        fetch(apiUrl+'api/forms', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                const rowsConId = data.data.map(row => ({
                    ...row,
                    id: row.id_empresa
                }));
                setRows(rowsConId);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredRows = rows.filter(row =>
        row.nom_empresa?.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { field: 'id_empresa', headerName: 'ID', width: 80 },
        { field: 'nom_empresa', headerName: 'Nombre', width: 180 },
        { field: 'giro', headerName: 'Giro', width: 120 },
        { field: 'empleados', headerName: 'Empleados', width: 120 },
        { field: 'direccion', headerName: 'Domicilio', width: 180 },
        { field: 'telefono', headerName: 'Teléfono', width: 140 },
        { field: 'responsable', headerName: 'Responsable', width: 160 },
        {
            field: 'estructura',
            headerName: 'Estructura',
            width: 220,
            valueGetter: (params) =>
                params && params
                    ? resumenEstructura(params)
                    : ''
        },
        {
            field: 'adscripciones',
            headerName: 'Adscripción',
            width: 140,
            valueGetter: (params) => {
                const ads = params;
                if (Array.isArray(ads)) return ads.join(', ');
                if (typeof ads === 'string') return ads;
                return '';
            }
        },
        {
            field: 'additionalQuestions',
            headerName: 'Preguntas adicionales',
            width: 220,
            valueGetter: (params) => {
                const preguntas = params;
                if (Array.isArray(preguntas) && preguntas.length > 0) {
                    return preguntas.map(p => {
                        // Muestra el texto y si hay opciones, las concatena
                        return p.text || '';
                    }).join(' | ');
                }
                return '';
            }
        },
        {
            field: 'answers',
            headerName: 'Respuestas',
            width: 180,
            valueGetter: (params) => {
                const answers = params;
                if (Array.isArray(answers) && answers.length > 0) {
                    // Mostramos todos los valores posibles
                    return answers.map(a => a.answer || a.selectedOption || '').filter(Boolean).join(' | ');
                }
                return '';
            }
        },
        {
            field: 'created_at',
            headerName: 'Registro',
            width: 160,
            valueGetter: (params) => {
                if (!params) return '';
                return new Date(params).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
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
                            onClick={() => handleEliminar(params.row)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditar(params.row)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Nuevo Formulario">
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
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <DataGrid
                    sx={{
                        backgroundColor: 'info.main',
                        borderRadius: 2,

                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'info.main',
                            color: 'secondary.main',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            borderBottom: 'none', // Elimina la línea entre header y primera fila
                            minHeight: '48px !important', // Altura fija del header
                            maxHeight: '48px !important',
                        },

                        '& .MuiDataGrid-row': {
                            backgroundColor: '#fff',
                            color: '#222',
                            margin: 0,
                            borderRadius: 0,
                        },

                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: 'background.default',
                            borderTop: 'none',
                        },

                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#f3f4f6'
                        }
                    }}
                    rows={filteredRows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
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
