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

        // 1. Mostrar opciones de tipo de cuestionario
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

        // 2. Procesar la selección del usuario
        if (tipoSeleccionado === true) {
            tipo = "nom035";
        } else if (tipoSeleccionado === false) {
            tipo = "general";
        } else {
            // Mostrar selector de dimensiones personalizadas
            const dimensiones = [
                "estructura organizacional",
                "comunicación organizacional",
                "políticas",
                "relaciones interpersonales",
                "trabajo en equipo",
                "liderazgo",
                "capacitación",
                "evaluación de desempeño",
                "oportunidades de desarrollo",
                "selección de personal",
                "sueldo y prestaciones",
                "reconocimiento",
                "condiciones de trabajo",
                "seguridad e higiene",
                "identificación con la empresa",
                "satisfacción con el puesto",
                "actitud hacia el cambio",
                "calidad"
            ];

            const checkboxesHTML = dimensiones.map(dim => `
                <label style="display:block;text-align:left;margin:5px 0;padding:5px;background:#f8f9fa;border-radius:4px;">
                    <input type="checkbox" value="${dim}" class="dimension-checkbox" style="margin-right:10px;" />
                    ${dim.charAt(0).toUpperCase() + dim.slice(1)}
                </label>
            `).join('');

            const { value: confirmed } = await Swal.fire({
                title: 'Selecciona las dimensiones',
                html: `
                    <div style="max-height:60vh;overflow-y:auto;padding-right:10px;">
                        <form id="dimensiones-form">${checkboxesHTML}</form>
                    </div>
                    <p style="text-align:left;margin-top:10px;font-size:0.9em;">
                        Puedes seleccionar múltiples dimensiones
                    </p>
                `,
                width: '600px',
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

        // 3. Preparar el payload según el tipo de cuestionario
        let payload, endpoint, mensajeExito;

        if (tipo === "personalizado") {
            // Enviar al endpoint de Flask para cuestionarios personalizados
            endpoint = "https://ia.grupocrehce.com/api/surveys";
            mensajeExito = "Cuestionario personalizado generado con éxito";
            
            payload = {
                metadata: {
                    empresa: {
                        id_empresa: empresa.id_empresa,
                        nom_empresa: empresa.nom_empresa
                    },
                    dimensiones: dimensionesSeleccionadas
                }
            };
        } else if (tipo === "nom035") {
            // Enviar al endpoint de Rasa para NOM-035
            endpoint = "https://rasa.grupocrehce.com/webhooks/rest/webhook";
            mensajeExito = "Cuestionario NOM-035 generado con éxito";
            
            payload = {
                sender: `usuario_${empresa.id_empresa}`,
                message: "Nuevo formulario NOM035",
                metadata: { empresa }
            };
        } else {
            // Enviar al endpoint de Flask para cuestionario general
            endpoint = "https://rasa.grupocrehce.com/webhooks/rest/webhook";
            mensajeExito = "Cuestionario general generado con éxito";
            
            payload = {
                sender: `usuario_${empresa.id_empresa}`,
                message: "Formulario general",
                metadata: { empresa }
            };
        }

        console.log("🚀 Enviando datos:", JSON.stringify(payload, null, 2));

        // 4. Mostrar carga mientras se procesa
        Swal.fire({
            title: "⏳ Generando cuestionario...",
            text: "Por favor espera mientras procesamos la solicitud.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // 5. Enviar la solicitud
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // Handle HTML response for custom surveys
        if (tipo === "personalizado") {
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('text/html')) {
                // Handle HTML response (question selection interface)
                const html = await response.text();
                
                // Create a new window or modal to show the question selection interface
                const questionWindow = window.open("", "_blank", "width=1000,height=800");
                questionWindow.document.write(html);
                questionWindow.document.close();
                
                // Close the loading dialog
                Swal.close();
                return;
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error || errorData.message || 
                `Error HTTP: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("✅ Respuesta recibida:", data);

        // 6. Mostrar resultados según el tipo de cuestionario
        if (tipo === "personalizado" || tipo === "general") {
            // Respuesta del backend Flask
            const preguntasHTML = data.questions && data.questions.length > 0
                ? `<ol style="text-align:left;margin-top:10px;">
                    ${data.questions.map((q, i) => 
                        `<li style="margin-bottom:8px;">
                            <strong>${q}</strong><br>
                            <em style="color:#666;font-size:0.9em;">Dimensión: ${data.dimensions?.[i] || 'N/A'}</em>
                        </li>`
                    ).join('')}
                   </ol>`
                : "<p>No se generaron preguntas</p>";

            Swal.fire({
                title: "📋 Cuestionario Generado",
                html: `
                    <div style="text-align:left;max-height:60vh;overflow-y:auto;">
                        <p><strong>Empresa:</strong> ${data.empresa || empresa.nom_empresa}</p>
                        <p><strong>ID del cuestionario:</strong> ${data.survey_id || 'N/A'}</p>
                        <p><strong>Total de preguntas:</strong> ${data.question_count || 0}</p>
                        <p><strong>Dimensiones incluidas:</strong></p>
                        <ul>
                            ${(data.dimensions || dimensionesSeleccionadas || []).map(d => 
                                `<li>${d.charAt(0).toUpperCase() + d.slice(1)}</li>`
                            ).join('')}
                        </ul>
                        <p><strong>Preguntas generadas:</strong></p>
                        ${preguntasHTML}
                    </div>
                `,
                icon: "success",
                confirmButtonText: "Aceptar",
                width: '800px'
            });

            // Opcional: Guardar el ID del cuestionario en el estado de la aplicación
            if (data.survey_id) {
                // Aquí puedes implementar lógica para almacenar el ID
                console.log("Cuestionario creado con ID:", data.survey_id);
            }

        } else {
            // Respuesta de Rasa (NOM-035)
            const respuestaIA = Array.isArray(data) 
                ? data.map(msg => msg.text).filter(Boolean).join("\n")
                : "Cuestionario NOM-035 generado correctamente";

            Swal.fire({
                title: "📋 Cuestionario NOM-035 Generado",
                html: `<div style="text-align:left;max-height:60vh;overflow-y:auto;">
                    ${respuestaIA.replace(/\n/g, '<br>')}
                </div>`,
                icon: "success",
                confirmButtonText: "Aceptar",
                width: '800px'
            });
        }

    } catch (error) {
        console.error("❌ Error al generar el cuestionario:", error);
        
        let errorMessage = "Hubo un problema al generar el cuestionario.";
        if (error.message.includes("Failed to fetch")) {
            errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
        } else if (error.message.includes("Error HTTP: 500")) {
            errorMessage = "Error interno del servidor al procesar la solicitud.";
        } else if (error.message) {
            errorMessage = error.message;
        }

        Swal.fire({
            title: "❌ Error",
            html: `<div style="text-align:left;">
                <p>${errorMessage}</p>
                <p style="font-size:0.8em;color:#666;">Consulta la consola para más detalles.</p>
            </div>`,
            icon: "error",
            confirmButtonText: "Entendido"
        });
    }
}

export default function Empresas({setPageTitle}) {
    const [rows, setRows] = useState([]);
    const [search] = useState('');
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    // Fetch datos del backend
    useEffect(() => {
        setPageTitle("LISTADO DE EMPRESAS");
        fetch(apiUrl + 'api/forms', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 500) {
                        console.warn("401 detectado. Recargando la página...");
                        window.location.reload(); // 🔄 Fuerza refresh completo
                        return;
                    }
                    throw new Error(`Error HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (!data) return; // Para evitar errores si ya se recargó
                const rowsConId = data.data.map(row => ({
                    ...row,
                    id: row.id_empresa
                }));
                setRows(rowsConId);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error en la petición:", err);
                setLoading(false);
            });
    }, [reload, setPageTitle]);

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
