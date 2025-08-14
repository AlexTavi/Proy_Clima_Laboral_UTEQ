import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Colores dinámicos para las respuestas
const generateColors = (count) => {
  const baseColors = [
    "#e53e3e", "#fd7f28", "#fbd38d", "#68d391", "#38b2ac",
    "#4299e1", "#9f7aea", "#ed64a6", "#38b2ac", "#f56565"
  ];

  const colors = [];
  for (let i = 0; i < count; i++) {
    if (i < baseColors.length) {
      colors.push(baseColors[i]);
    } else {
      // Generar colores adicionales si son necesarios
      const hue = (i * 137.508) % 360;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
  }
  return colors;
};

// Componente de tarjeta con efecto glass
const GlassCard = ({ children, className = "", title }) => (
    <div className={`backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl ${className}`}>
      {title && <h3 className="text-xl font-bold text-white mb-4">{title}</h3>}
      {children}
    </div>
);

// Componente de loading
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <div className="text-white ml-4">Cargando dashboard...</div>
    </div>
);

// Componente de error
const ErrorMessage = ({ message }) => (
    <GlassCard className="text-center">
      <div className="text-red-400 text-lg font-semibold">⚠️ Error</div>
      <div className="text-gray-300 mt-2">{message}</div>
    </GlassCard>
);

// Validación de datos más flexible
const validateData = (data) => {
  if (!data || typeof data !== 'object') return false;
  return Object.keys(data).length > 0;
};

// Función para identificar campos numéricos (respuestas)
const extractNumericFields = (item) => {
  if (!item || typeof item !== 'object') return [];

  const excludeFields = ['dimension', 'area', 'respuesta', 'response', 'total', 'name', 'id'];
  return Object.keys(item).filter(key =>
      !excludeFields.includes(key.toLowerCase()) &&
      typeof item[key] === 'number' &&
      item[key] !== null &&
      item[key] !== undefined &&
      item[key] >= 0
  );
};

// Función para detectar automáticamente el tipo de datos
const detectDataType = (dataArray) => {
  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) return 'unknown';

  const firstItem = dataArray[0];
  if (!firstItem || typeof firstItem !== 'object') return 'unknown';

  if (firstItem.dimension) return 'dimension';
  if (firstItem.area && firstItem.dimension) return 'area_dimension';
  if (firstItem.respuesta || firstItem.response) return 'global';
  if (firstItem.total && (firstItem.respuesta || firstItem.response || firstItem.name)) return 'global';

  return 'custom';
};

// Procesador genérico para cualquier tipo de datos
const processGenericData = (dataArray, type) => {
  if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) return [];

  return dataArray.map((item, index) => {
    if (!item || typeof item !== 'object') return null;

    const numericFields = extractNumericFields(item);
    if (numericFields.length === 0 && type !== 'global') return null;

    const processedItem = { ...item };

    // Para datos globales, usar el campo 'total' si existe
    if (type === 'global') {
      const nameField = item.respuesta || item.response || item.name || `Item ${index + 1}`;
      const valueField = item.total || item.value || 0;

      if (valueField <= 0) return null;

      return {
        name: nameField,
        value: valueField,
        fill: generateColors(dataArray.length)[index]
      };
    }

    // Para otros tipos, calcular el total
    let total = 0;
    numericFields.forEach(field => {
      const value = item[field] || 0;
      total += value;
    });

    if (total <= 0) return null;

    processedItem.total = total;
    processedItem.index = index;

    return processedItem;
  }).filter(item => item !== null);
};

// Componente para gráfico de barras genérico
const GenericBarChart = ({ data, title, labelKey = "dimension" }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-400 text-center py-8">No hay datos disponibles para {title}</div>;
  }

  const numericFields = extractNumericFields(data[0]);
  const colors = generateColors(numericFields.length);

  // Preparar datos para el gráfico
  const chartData = data.map(item => {
    const chartItem = {
      [labelKey]: item[labelKey] || item.name || `Item ${item.index + 1}`,
    };

    numericFields.forEach(field => {
      chartItem[field] = item[field] || 0;
    });

    return chartItem;
  });

  return (
      <div className="bg-white rounded-lg p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
                dataKey={labelKey}
                stroke="#374151"
                angle={-45}
                textAnchor="end"
                height={120}
                fontSize={11}
                interval={0}
            />
            <YAxis stroke="#374151" />
            <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#374151',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
            />
            <Legend />
            {numericFields.map((field, index) => (
                <Bar
                    key={field}
                    dataKey={field}
                    fill={colors[index]}
                    name={field}
                />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
  );
};

// Componente para gráfico circular genérico
const GenericPieChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-400 text-center py-8">No hay datos disponibles para {title}</div>;
  }

  const renderLabel = (entry) => `${entry.name}: ${entry.value}`;

  return (
      <div className="bg-white rounded-lg p-4">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
            >
              {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#374151',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
            />
            <Legend
                wrapperStyle={{ color: '#374151' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
  );
};

// Componente para mostrar datos agrupados por área
const AreaGroupedData = ({ data }) => {
  if (!data || data.length === 0) return null;

  const groupedByArea = {};

  data.forEach(item => {
    if (!item.area) return;

    if (!groupedByArea[item.area]) {
      groupedByArea[item.area] = [];
    }
    groupedByArea[item.area].push(item);
  });

  const areas = Object.keys(groupedByArea);
  if (areas.length === 0) return null;

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {areas.map(area => (
            <GlassCard key={area} title={`📍 ${area}`} className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="space-y-3">
                {groupedByArea[area].map((item, index) => {
                  const numericFields = extractNumericFields(item);
                  const colors = generateColors(numericFields.length);

                  return (
                      <div key={index} className="bg-black/20 rounded-lg p-3">
                        <div className="text-white font-medium mb-2">
                          {item.dimension || item.name || `Item ${index + 1}`}
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          Total: {item.total || 'N/A'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {numericFields.map((field, fieldIndex) => (
                              item[field] > 0 && (
                                  <span
                                      key={field}
                                      className="px-2 py-1 rounded text-xs text-white font-medium"
                                      style={{ backgroundColor: colors[fieldIndex] }}
                                  >
                          {field}: {item[field]}
                        </span>
                              )
                          ))}
                        </div>
                      </div>
                  );
                })}
              </div>
            </GlassCard>
        ))}
      </div>
  );
};

// Componente principal del Dashboard
export default function Dashboard({ setPageTitle }) {
  const { id_formulario } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setPageTitle("DASHBOARD #" + id_formulario);

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}api/dashboard/${id_formulario}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Error al cargar los datos del dashboard: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_formulario, setPageTitle, token, apiUrl]);

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <LoadingSpinner />
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <ErrorMessage message={error} />
        </div>
    );
  }

  if (!validateData(data)) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <ErrorMessage message="Los datos recibidos no tienen el formato esperado" />
        </div>
    );
  }

  // Procesar dinámicamente todos los arrays en la respuesta
  const sections = [];

  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key]) && data[key].length > 0) {
      const dataType = detectDataType(data[key]);
      const processedData = processGenericData(data[key], dataType);

      if (processedData.length > 0) {
        sections.push({
          key,
          title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: dataType,
          data: processedData,
          original: data[key]
        });
      }
    }
  });

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-8">

          {sections.length === 0 ? (
              <GlassCard className="text-center">
                <div className="text-yellow-400 text-lg font-semibold">⚠️ Sin datos</div>
                <div className="text-gray-300 mt-2">No se encontraron datos válidos para mostrar</div>
              </GlassCard>
          ) : (
              sections.map(section => (
                  <div key={section.key}>
                    {/* Datos globales - Gráfico circular */}
                    {section.type === 'global' && (
                        <GlassCard className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                          <h2 className="text-2xl font-bold text-white mb-6">
                            📊 {section.title}
                          </h2>
                          <GenericPieChart data={section.data} title={section.title} />
                        </GlassCard>
                    )}

                    {/* Datos por dimensión - Gráfico de barras */}
                    {section.type === 'dimension' && (
                        <GlassCard className="bg-gradient-to-br from-green-500/20 to-blue-500/20">
                          <h2 className="text-2xl font-bold text-white mb-6">
                            📈 {section.title}
                          </h2>
                          <GenericBarChart
                              data={section.data}
                              title={section.title}
                              labelKey="dimension"
                          />
                        </GlassCard>
                    )}

                    {/* Datos por área y dimensión */}
                    {section.type === 'area_dimension' && (
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-6">
                            🏢 {section.title}
                          </h2>
                          <AreaGroupedData data={section.data} />
                        </div>
                    )}

                    {/* Datos personalizados - Gráfico de barras genérico */}
                    {section.type === 'custom' && (
                        <GlassCard className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                          <h2 className="text-2xl font-bold text-white mb-6">
                            🔧 {section.title}
                          </h2>
                          <GenericBarChart
                              data={section.data}
                              title={section.title}
                              labelKey={Object.keys(section.original[0]).find(k => typeof section.original[0][k] === 'string') || 'name'}
                          />
                        </GlassCard>
                    )}
                  </div>
              ))
          )}

        </div>
      </div>
  );
}