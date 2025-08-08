import React, {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Box, CircularProgress, IconButton, TextField, Tooltip} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {esES} from '@mui/x-data-grid/locales';
import {toast} from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');


// Utilidad para mostrar estructura como string
function resumenEstructura(estructura) {
    if (!estructura) return '';
    return Object.entries(estructura)
        .map(([key, val]) => `${val} ${key}`)
        .join(', ');
}

async function handleNuevoFormulario(empresa) {
    try {
        if (!empresa || !empresa.id_empresa) {
            console.error("❌ No se enviaron datos válidos de la empresa:", empresa);
            Swal.fire({
                title: "❌ Datos inválidos",
                text: "No hay datos válidos para enviar a la IA.",
                icon: "error",
                confirmButtonText: "Entendido"
            });
            return;
        }

        // ✅ 1. Mostrar opciones de tipo de cuestionario
        const { value: tipoSeleccionado } = await Swal.fire({
            title: "Selecciona el tipo de cuestionario",
            text: "¿Qué tipo de cuestionario deseas generar?",
            icon: "question",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "✅ NOM‑035",
            denyButtonText: "📋 General",
            cancelButtonText: "🎯 Elegir Dimensiones",
            reverseButtons: true
        });

        let tipo = null;
        let dimensionesSeleccionadas = [];

        // ✅ NOM‑035
        if (tipoSeleccionado === true) {
            tipo = "nom035";

        // ✅ General
        } else if (tipoSeleccionado === false) {
            tipo = "general";

        // ✅ Elegir dimensiones personalizadas
        } else {
            const dimensiones = [
                "compromiso",
                "relaciones_laborales",
                "condiciones_trabajo",
                "reconocimiento",
                "desarrollo",
                "comunicacion",
                "organizacion_trabajo",
                "retribucion",
                "cambio",
                "confianza",
                "cultura_innovacion",
                "motivacion",
                "seguridad"
            ];

            const checkboxesHTML = dimensiones.map(dim => `
                <label style="display:block;text-align:left">
                    <input type="checkbox" value="${dim}" class="dimension-checkbox" />
                    ${dim.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
            `).join('');

            const { value: confirmed } = await Swal.fire({
                title: 'Selecciona las dimensiones',
                html: `<form id="dimensiones-form">${checkboxesHTML}</form>`,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '✅ Confirmar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const checkboxes = document.querySelectorAll('.dimension-checkbox');
                    const seleccionadas = Array.from(checkboxes)
                        .filter(cb => cb.checked)
                        .map(cb => cb.value);
                    if (seleccionadas.length === 0) {
                        Swal.showValidationMessage('Debes seleccionar al menos una dimensión');
                    }
                    return seleccionadas;
                }
            });

            if (!confirmed) return;

            tipo = "personalizado";
            dimensionesSeleccionadas = confirmed;
        }

        const mensajeIA = tipo === "nom035"
            ? "Nuevo formulario NOM035"
            : tipo === "general"
            ? "Nuevo formulario de empresa"
            : `Nuevo formulario con dimensiones: ${dimensionesSeleccionadas.join(", ")}`;

        const payload = {
            sender: `usuario_${empresa.id_empresa}`,
            message: mensajeIA,
            metadata: {
                empresa,
                ...(tipo === "personalizado" ? { dimensiones: dimensionesSeleccionadas } : {})
            }
        };

        console.log("🚀 Enviando datos a Rasa:", JSON.stringify(payload, null, 2));

        Swal.fire({
            title: "⏳ Generando cuestionario...",
            text: "Por favor espera mientras procesamos la solicitud.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch("https://rasa.grupocrehce.com/webhooks/rest/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Respuesta de Rasa:", data);

        const respuestaIA = data.map(msg => msg.text).filter(Boolean).join("\n");

        Swal.fire({
            title: "📋 Cuestionario Generado",
            text: respuestaIA || "Rasa procesó los datos correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });

    } catch (error) {
        console.error("❌ Error al enviar a Rasa:", error);
        Swal.fire({
            title: "❌ Error",
            text: "Hubo un problema al enviar los datos a la IA. Revisa la consola.",
            icon: "error",
            confirmButtonText: "Entendido"
        });
    }
}


export default function Empresas() {
    const [rows, setRows] = useState([]);
    const [search] = useState('');
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    // Fetch datos del backend
    useEffect(() => {
        fetch(apiUrl+'api/forms', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
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
    }, [reload]);

    async function handleEliminar(empresa) {
        if (!empresa || !empresa.id_empresa) {
            console.error("❌ No se enviaron datos válidos de la empresa:", empresa);
            alert("No hay datos válidos para enviar a la IA.");
            return;
        }
        const id_empresa = empresa.id_empresa;

        const { value: isConfirmed } = await Swal.fire({
            title: '¿Eliminar empresa?',
            text: "Para eliminar, escribe la clave 12345",
            input: 'password',
            inputLabel: 'Clave de confirmación',
            inputPlaceholder: 'Escribe 12345 para continuar',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            preConfirm: (inputValue) => {
                if (inputValue !== '12345') {
                    Swal.showValidationMessage('Clave incorrecta. Intenta de nuevo.');
                    return false;
                }
                return true;
            }
        });
        if (!isConfirmed) {
            toast('Eliminación cancelada');
            return;
        }

        try {
            const response = await fetch(apiUrl + "api/destroy/empresa", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    id_empresa: id_empresa
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data)
            if (data.success) {
                toast.success(data.message);
                setReload(r => !r);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("❌ Error al enviar a servidor:", error);
            toast.error("Ocurrió un error al intentar eliminar la empresa.");
        }
    }

    const filteredRows = rows.filter(row =>
        row.nom_empresa?.toLowerCase().includes(search.toLowerCase())
    );
    const handleEditar = (empresa) => {
        if (!empresa || !empresa.id_empresa) {
            console.error("❌ Empresa inválida para editar:", empresa);
            return;
        }

        // Redirigir a la ruta con el ID
        navigate(`/forms/edit/${empresa.id_empresa}`);
    };

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
        <Box sx={{ width: '100%' }}>
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
