import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../componentes/GlassCard.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  RadioGroup,
  Radio,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormGroup, Stack, FormControlLabel, Button, IconButton, Chip, FormHelperText
} from "@mui/material";
import {toast} from "react-hot-toast";


const NuevoFormulario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [empleadosSeleccion, setEmpleadosSeleccion] = useState('');
  const [answers, setAnswers] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const nivelesPuestos = ['Dirección', 'Gerencias', 'Jefaturas', 'Administración', 'Departamentos'];
  const adscripcionesDisponibles = ['Matriz', 'Sucursal', 'Norte', 'Sur', 'Noreste', 'Noroeste'];

  const [puestosSeleccionados, setPuestosSeleccionados] = useState([]);
  const [puestosExtra, setPuestosExtra] = useState([]);
  const [adscripcionesSeleccionadas, setAdscripcionesSeleccionadas] = useState([]);
  const [adscripcionesExtra, setAdscripcionesExtra] = useState([]);
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [newQuestionType, setNewQuestionType] = useState('open');

  const [formData, setFormData] = useState({
    nom_empresa: '',
    rfc_empresa: '',
    direccion: '',
    cp: '',
    municipio: '',
    estado: '',
    email_empresa: '',
    giro: '',
    subGiro: '',
    otroGiro: '',
    empleados: '',
    telefono: '',
    responsable: '',
    estructura: {},
    num: '',
  });

  const girosCatalogo = {
    'Sector industrial': ['Automotriz', 'Aeronáutica', 'Alimentos', 'Electrónica', 'Veterinaria'],
    'Hospital': [],
    'Institución educativa': [],
    'Sector público': [],
    'Servicios': ['Institución Financiera', 'Aseguradora'],
    'Comercio': ['Tienda autoservicio', 'Tienda conveniencia', 'Tienda departamental'],
    'Otros': [],
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      try {
        const res = await fetch(apiUrl+'api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Token inválido');
        // const data = await res.json();
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEstructuraChange = (e) => {
    const { name, value } = e.target;
    const num = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      estructura: { ...prev.estructura, [name]: num },
    }));
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { ...prev[questionIndex], answer: value }
    }));
  };

  const handleOptionSelect = (questionIndex, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { ...prev[questionIndex], selectedOption: option }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    // Lista de campos requeridos
    const requiredFields = [
      "nom_empresa", "giro",
      "email_empresa", "responsable", "direccion",
      "cp", "estado", "municipio"
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === "")) {
        errors[field] = "Este campo es obligatorio";
      }
    });
    if (girosCatalogo[formData.giro]?.length > 0) {
      if (!formData.subGiro || formData.subGiro.trim() === "") {
        errors.subGiro = "Selecciona una subcategoría";
      }
    }

    if (formData.giro === "Otros") {
      if (!formData.otroGiro || formData.otroGiro.trim() === "") {
        errors.otroGiro = "Especifique el giro";
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Por favor complete todos los campos obligatorios.");
      return;
    }
    const hasEmptyQuestions = additionalQuestions.some(q =>
      !q.text || (q.type === 'multiple' && (q.options.length === 0 || q.options.some(o => !o)))
    );

    if (hasEmptyQuestions) {
      setError('Por favor complete todas las preguntas adicionales');
      return;
    }

    const hasEmptyAnswers = additionalQuestions.some((q, index) => {
      if (!answers[index]) return true;
      if (q.type === 'multiple' && !answers[index].selectedOption) return true;
      return q.type !== 'multiple' && !answers[index].answer;

    });

    if (hasEmptyAnswers) {
      setError('Por favor responda todas las preguntas adicionales');
      return;
    }

    const giroFinal = formData.giro === 'Otros'
      ? formData.otroGiro
      : (formData.subGiro || formData.giro);

    const estructuraFinal = { ...formData.estructura };
    puestosExtra.forEach(p => {
      if (p.nombre) estructuraFinal[p.nombre.toLowerCase()] = p.numero;
    });

    const adscripcionesFinales = [...adscripcionesSeleccionadas, ...adscripcionesExtra.filter(Boolean)];

    try {
      setError(null);
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        giro: giroFinal,
        estructura: estructuraFinal,
        adscripciones: adscripcionesFinales,
        additionalQuestions,
        answers,
      };

      console.log('Payload enviado:', JSON.stringify(payload, null, 2));

      const res = await fetch(apiUrl+'api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al guardar el formulario');
      }

      setSuccess("Formulario guardado con éxito.");
      setTimeout(() => setSuccess(null), 3000);
      setFormData({
        nom_empresa: '',
        rfc_empresa: '',
        direccion: '',
        cp: '',
        municipio: '',
        estado: '',
        email_empresa: '',
        giro: '',
        subGiro: '',
        otroGiro: '',
        empleados: '',
        telefono: '',
        responsable: '',
        estructura: {},
        num: '',
      });
      setPuestosSeleccionados([]);
      setPuestosExtra([]);
      setAdscripcionesSeleccionadas([]);
      setAdscripcionesExtra([]);
      setEmpleadosSeleccion('');
      setAdditionalQuestions([]);
      setAnswers({});
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <div className="formulario-container">

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="success-message" role="status">
          {success}
        </div>
      )}

      <main className="formulario-main">
        <h1 className="form-title">Nueva Empresa</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <GlassCard>
            <Typography variant="h5" color="primary" mb={2} fontWeight={700}>
              Información de la Empresa
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={3}>
              <TextField
                  id="nom_empresa"
                  name="nom_empresa"
                  label="Nombre de la empresa"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.nom_empresa}
                  onChange={handleChange}
                  error={!!formErrors.nom_empresa}
                  helperText={formErrors.nom_empresa}
              />

              <TextField
                  id="rfc_empresa"
                  name="rfc_empresa"
                  label="RFC de la empresa"
                  variant="outlined"
                  fullWidth
                  value={formData.rfc_empresa}
                  onChange={handleChange}
              />

              <FormControl fullWidth required error={!!formErrors.giro}>
                <InputLabel id="giro-label">Catálogo de giros</InputLabel>
                <Select
                    labelId="giro-label"
                    id="giro"
                    name="giro"
                    value={formData.giro}
                    label="Catálogo de giros"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, giro: val, subGiro: '', otroGiro: '' }));
                      setFormErrors(prev => ({ ...prev, giro: undefined }));
                    }}
                >
                  <MenuItem value="">
                    -- Selecciona un giro --
                  </MenuItem>
                  {Object.keys(girosCatalogo).map(giro => (
                      <MenuItem key={giro} value={giro}>
                        {giro}
                      </MenuItem>
                  ))}
                </Select>
                {formErrors.giro && (
                    <FormHelperText>{formErrors.giro}</FormHelperText>
                )}
              </FormControl>

              {girosCatalogo[formData.giro]?.length > 0 && (
                  <FormControl fullWidth required margin="normal" error={!!formErrors.subGiro}>
                    <InputLabel id="subGiro-label">Subcategoría</InputLabel>
                    <Select
                        labelId="subGiro-label"
                        id="subGiro"
                        name="subGiro"
                        value={formData.subGiro}
                        label="Subcategoría"
                        onChange={handleChange}
                    >
                      <MenuItem value="">-- Selecciona una subcategoría --</MenuItem>
                      {(girosCatalogo[formData.giro] || []).map(sub => (
                          <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                      ))}
                    </Select>
                    {formErrors.subGiro && (
                        <FormHelperText>{formErrors.subGiro}</FormHelperText>
                    )}
                  </FormControl>
              )}

              {formData.giro === 'Otros' && (
                  <TextField
                      id="otroGiro"
                      name="otroGiro"
                      label="Especifique el giro"
                      value={formData.otroGiro}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      error={!!formErrors.otroGiro}
                      helperText={formErrors.otroGiro}
                  />
              )}


              <FormControl fullWidth required margin="normal">
                <InputLabel id="empleadosSeleccion-label">Número de empleados</InputLabel>
                <Select
                    labelId="empleadosSeleccion-label"
                    id="empleadosSeleccion"
                    name="empleadosSeleccion"
                    value={empleadosSeleccion}
                    label="Número de empleados"
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmpleadosSeleccion(value);
                      if (value !== "Otros") {
                        setFormData(prev => ({ ...prev, empleados: value }));
                      } else {
                        setFormData(prev => ({ ...prev, empleados: "" }));
                      }
                    }}
                >
                  <MenuItem value="">-- Selecciona un rango --</MenuItem>
                  <MenuItem value="10-50">De 10 a 50</MenuItem>
                  <MenuItem value="51-100">De 51 a 100</MenuItem>
                  <MenuItem value="101-200">De 101 a 200</MenuItem>
                  <MenuItem value="201-300">De 201 a 300</MenuItem>
                  <MenuItem value="301-400">De 301 a 400</MenuItem>
                  <MenuItem value="401-500">De 401 a 500</MenuItem>
                  <MenuItem value="501-1000">De 501 a 1000</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>


              {empleadosSeleccion === "Otros" && (
                  <TextField
                      id="empleados"
                      type="number"
                      name="empleados"
                      label="Especifique el número de empleados"
                      value={formData.empleados}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      inputProps={{ min: 1 }}
                  />
              )}

            </Box>
          </GlassCard>

          <GlassCard>
            <Typography variant="h5" color="primary" mb={2} fontWeight={700}>
              Información de Contacto
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={3}>
              <TextField
                  id="telefono"
                  name="telefono"
                  label="Telefono"
                  variant="outlined"
                  fullWidth
                  value={formData.telefono}
                  onChange={handleChange}
              />
              <TextField
                  id="email_empresa"
                  name="email_empresa"
                  label="Email de la empresa"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.email_empresa}
                  onChange={handleChange}
                  error={!!formErrors.nom_empresa}
                  helperText={formErrors.nom_empresa}
              />
              <TextField
                  id="responsable"
                  name="responsable"
                  label="Responsable"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.responsable}
                  onChange={handleChange}
                  error={!!formErrors.nom_empresa}
                  helperText={formErrors.nom_empresa}
              />
              <TextField
                  id="direccion"
                  name="direccion"
                  label="Domicilio"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.direccion}
                  onChange={handleChange}
                  error={!!formErrors.nom_empresa}
                  helperText={formErrors.nom_empresa}
              />
              <TextField
                  id="num"
                  name="num"
                  label="Numero"
                  variant="outlined"
                  fullWidth
                  value={formData.num}
                  onChange={handleChange}
              />
              <TextField
                  id="cp"
                  name="cp"
                  label="Código postal"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.cp}
                  onChange={handleChange}
                  error={!!formErrors.nom_empresa}
                  helperText={formErrors.nom_empresa}
              />
              <TextField
                  id="estado"
                  name="estado"
                  label="Estado"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.estado}
                  onChange={handleChange}
                  error={!!formErrors.nom_empresa}
                  helperText={formErrors.nom_empresa}
              />
              <TextField
                  id="municipio"
                  name="municipio"
                  label="Municipio"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.municipio}
                  onChange={handleChange}
                  error={!!formErrors.nom_empresa}
                  helperText={formErrors.nom_empresa}
              />
            </Box>
          </GlassCard>

          <GlassCard>
            <Typography variant="h5" color="primary" mb={2} fontWeight={700}>
              Estructura Organizacional
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={3}>
              <Typography variant="body1" color="text.secondary">
                Niveles de puestos y número de ocupantes:
              </Typography>
              <FormGroup>
                {nivelesPuestos.map((puesto) => (
                    <Stack key={puesto} direction="row" alignItems="center" spacing={2} mb={1}>
                      <FormControlLabel
                          control={
                            <Checkbox
                                checked={puestosSeleccionados.includes(puesto)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setPuestosSeleccionados(prev =>
                                      checked
                                          ? [...prev, puesto]
                                          : prev.filter(p => p !== puesto)
                                  );
                                }}
                            />
                          }
                          label={puesto}
                      />
                      {puestosSeleccionados.includes(puesto) && (
                          <TextField
                              type="number"
                              name={puesto.toLowerCase()}
                              value={formData.estructura[puesto.toLowerCase()] || 0}
                              onChange={handleEstructuraChange}
                              label={`Nº de ${puesto}`}
                              size="small"
                              inputProps={{ min: 0 }}
                              sx={{ maxWidth: 120 }}
                          />
                      )}
                    </Stack>
                ))}
              </FormGroup>
              {puestosExtra.map((puesto, idx) => (
                  <Stack key={`puesto-extra-${idx}`} direction="row" alignItems="center" spacing={2} mb={1}>
                    <TextField
                        value={puesto.nombre}
                        onChange={(e) => {
                          const nuevoNombre = e.target.value;
                          setPuestosExtra(prev => {
                            const copy = [...prev];
                            copy[idx].nombre = nuevoNombre;
                            return copy;
                          });
                        }}
                        placeholder="Nombre"
                        aria-label="Nombre del puesto adicional"
                        size="small"
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        type="number"
                        value={puesto.numero}
                        onChange={(e) => {
                          const numero = parseInt(e.target.value) || 0;
                          setPuestosExtra(prev => {
                            const copy = [...prev];
                            copy[idx].numero = numero;
                            return copy;
                          });
                        }}
                        placeholder="Nº ocupantes"
                        aria-label="Número de ocupantes"
                        size="small"
                        inputProps={{ min: 0 }}
                        sx={{ width: 130 }}
                    />
                    <IconButton
                        onClick={() => {
                          setPuestosExtra(prev => prev.filter((_, i) => i !== idx));
                        }}
                        aria-label="Eliminar puesto"
                        color="error"
                        size="small"
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </Stack>
              ))}
              <Button
                  variant="outlined"
                  onClick={() => setPuestosExtra([...puestosExtra, { nombre: '', numero: 0 }])}
                  startIcon={<span style={{ fontWeight: "bold" }}>+</span>}
                  sx={{ alignSelf: "flex-start" }}
              >
                Agregar otro puesto
              </Button>
            </Box>
          </GlassCard>

          <GlassCard>
            <Typography variant="h5" color="primary" mb={2} fontWeight={700}>
              Adscripciones de la empresa
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={3}>
              <FormGroup>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Adscripciones:</Typography>
                <Stack spacing={1}>
                  {adscripcionesDisponibles.map((ads) => (
                      <Stack key={ads} direction="row" alignItems="center" spacing={2}>
                        <FormControlLabel
                            control={
                              <Checkbox
                                  checked={adscripcionesSeleccionadas.includes(ads)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setAdscripcionesSeleccionadas(prev =>
                                        checked
                                            ? [...prev, ads]
                                            : prev.filter(a => a !== ads)
                                    );
                                  }}
                              />
                            }
                            label={ads}
                        />
                      </Stack>
                  ))}
                </Stack>
              </FormGroup>

              {/* Adscripciones extra */}
              <Stack spacing={1} sx={{ mt: 2 }}>
                {adscripcionesExtra.map((ads, idx) => (
                    <Stack key={`ads-extra-${idx}`} direction="row" alignItems="center" spacing={2}>
                      <TextField
                          value={ads}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAdscripcionesExtra(prev => {
                              const copy = [...prev];
                              copy[idx] = val;
                              return copy;
                            });
                          }}
                          placeholder="Adscripción adicional"
                          aria-label="Adscripción adicional"
                          size="small"
                          sx={{ flex: 1 }}
                      />
                      <IconButton
                          onClick={() => {
                            setAdscripcionesExtra(prev => prev.filter((_, i) => i !== idx));
                          }}
                          aria-label="Eliminar adscripción"
                          color="error"
                          size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                ))}
              </Stack>

              {/* Botón para agregar nueva adscripción */}
              <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setAdscripcionesExtra([...adscripcionesExtra, ""])}
                  startIcon={<span style={{ fontWeight: "bold" }}>+</span>}
                  sx={{ mt: 2, alignSelf: "flex-start" }}
              >
                Agregar otra adscripción
              </Button>
            </Box>
          </GlassCard>

          <GlassCard>
            <Typography variant="h5" color="primary" mb={2} fontWeight={700}>
              Preguntas opcionales
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={3}>

              {additionalQuestions.map((question, index) => (
                <box key={index} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2, mb: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Chip
                        label={
                          question.type === "open"
                              ? "Abierta"
                              : question.type === "closed"
                                  ? "Cerrada (Sí/No)"
                                  : "Opción múltiple"
                        }
                        color={
                          question.type === "open"
                              ? "primary"
                              : question.type === "closed"
                                  ? "secondary"
                                  : "info"
                        }
                        size="small"
                    />
                    <IconButton
                        onClick={() => {
                          setAdditionalQuestions(prev => prev.filter((_, i) => i !== index));
                          const newAnswers = { ...answers };
                          delete newAnswers[index];
                          setAnswers(newAnswers);
                        }}
                        aria-label="Eliminar pregunta"
                        color="error"
                        size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <TextField
                      value={question.text}
                      onChange={(e) => {
                        const updatedQuestions = [...additionalQuestions];
                        updatedQuestions[index].text = e.target.value;
                        setAdditionalQuestions(updatedQuestions);
                      }}
                      fullWidth
                      placeholder="Escriba la pregunta"
                      required
                      size="small"
                      sx={{ mb: 2 }}
                  />

                  <Box className="answer-section">
                    {question.type === 'open' && (
                        <TextField
                            value={answers[index]?.answer || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder="Escriba su respuesta"
                            size="small"
                            required
                            fullWidth
                        />
                    )}

                    {question.type === 'closed' && (
                        <RadioGroup
                            row
                            name={`closed-${index}`}
                            value={answers[index]?.answer || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                        >
                          <FormControlLabel
                              value="Sí"
                              control={<Radio color="primary" />}
                              label="Sí"
                          />
                          <FormControlLabel
                              value="No"
                              control={<Radio color="primary" />}
                              label="No"
                          />
                        </RadioGroup>
                    )}

                    {question.type === 'multiple' && (
                        <RadioGroup
                            name={`multiple-${index}`}
                            value={answers[index]?.selectedOption || ''}
                            onChange={(e) => handleOptionSelect(index, e.target.value)}
                        >
                          {question.options.map((option, optIndex) => (
                              <FormControlLabel
                                  key={optIndex}
                                  value={option}
                                  control={<Radio color="primary" />}
                                  label={option}
                              />
                          ))}
                        </RadioGroup>
                    )}
                  </Box>
                  {question.type === 'multiple' && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                        {question.options.map((option, optIndex) => (
                            <Box key={optIndex} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <TextField
                                  value={option}
                                  onChange={(e) => {
                                    const updatedQuestions = [...additionalQuestions];
                                    updatedQuestions[index].options[optIndex] = e.target.value;
                                    setAdditionalQuestions(updatedQuestions);
                                  }}
                                  placeholder={`Opción ${optIndex + 1}`}
                                  size="small"
                                  required
                              />
                              <Button
                                  type="button"
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    const updatedQuestions = [...additionalQuestions];
                                    updatedQuestions[index].options = updatedQuestions[index].options.filter((_, i) => i !== optIndex);
                                    setAdditionalQuestions(updatedQuestions);
                                  }}
                              >
                                ×
                              </Button>
                            </Box>
                        ))}

                        <Button
                            type="button"
                            size="small"
                            variant="contained"
                            onClick={() => {
                              const updatedQuestions = [...additionalQuestions];
                              updatedQuestions[index].options = [...(updatedQuestions[index].options || []), ''];
                              setAdditionalQuestions(updatedQuestions);
                            }}
                            sx={{ width: "fit-content" }}
                        >
                          + Agregar opción
                        </Button>
                      </Box>
                  )}

                </box>
              ))}

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Select
                    value={newQuestionType}
                    onChange={(e) => setNewQuestionType(e.target.value)}
                    size="small"
                    displayEmpty
                    sx={{ minWidth: 180 }}
                >
                  <MenuItem value="open">Pregunta abierta</MenuItem>
                  <MenuItem value="closed">Pregunta cerrada (Sí/No)</MenuItem>
                  <MenuItem value="multiple">Opción múltiple</MenuItem>
                </Select>

                <Button
                    variant="outlined"
                    startIcon={<span style={{ fontWeight: "bold" }}>+</span>}
                    color="primary"
                    onClick={() => {
                      const newQuestion = {
                        text: "",
                        type: newQuestionType,
                        ...(newQuestionType === "multiple" ? { options: [""] } : {}),
                      };
                      setAdditionalQuestions([...additionalQuestions, newQuestion]);
                    }}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Agregar pregunta
                </Button>
              </Box>
            </Box>
          </GlassCard>

          <div className="form-actions">
            <button type="submit" className="submit-button">Guardar Empresa</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NuevoFormulario;