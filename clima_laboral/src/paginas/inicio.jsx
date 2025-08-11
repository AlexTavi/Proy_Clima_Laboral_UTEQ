import React, {useEffect} from "react";
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Box, Typography } from "@mui/material";
import GlassCard from "../componentes/GlassCard"; // ✅ USAMOS EL COMPONENTE PARA DISEÑO

// Colores para las gráficas
const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"];

// Datos de ejemplo
const dataClima = [
  { name: "Comunicación", porcentaje: 85 },
  { name: "Liderazgo", porcentaje: 72 },
  { name: "Crecimiento", porcentaje: 65 },
  { name: "Ambiente", porcentaje: 90 },
];

const dataSatisfaccion = [
  { name: "Muy Satisfecho", value: 400 },
  { name: "Satisfecho", value: 300 },
  { name: "Neutral", value: 200 },
  { name: "Insatisfecho", value: 100 },
];

const dataTendencia = [
  { mes: "Ene", clima: 70 },
  { mes: "Feb", clima: 75 },
  { mes: "Mar", clima: 80 },
  { mes: "Abr", clima: 78 },
  { mes: "May", clima: 85 },
];

const dataParticipacion = [
  { name: "Área A", porcentaje: 90 },
  { name: "Área B", porcentaje: 75 },
  { name: "Área C", porcentaje: 60 },
  { name: "Área D", porcentaje: 45 },
];

const dataComparativa = [
  { dimension: "Comunicación", 2024: 70, 2025: 85 },
  { dimension: "Liderazgo", 2024: 68, 2025: 72 },
  { dimension: "Crecimiento", 2024: 60, 2025: 65 },
  { dimension: "Ambiente", 2024: 82, 2025: 90 },
];

const dataRadar = [
  { subject: "Comunicación", A: 120, fullMark: 150 },
  { subject: "Liderazgo", A: 98, fullMark: 150 },
  { subject: "Crecimiento", A: 86, fullMark: 150 },
  { subject: "Ambiente", A: 130, fullMark: 150 },
  { subject: "Satisfacción", A: 99, fullMark: 150 },
];

export default function Inicio({setPageTitle}) {
  useEffect(() => {
    setPageTitle("DASHBOARDS - Clima Laboral");
  }, [setPageTitle]);
  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 4,
        }}
      >
        {/* ✅ 1. BARRA: DIMENSIONES DEL CLIMA LABORAL */}
        <GlassCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Dimensiones del Clima Laboral
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataClima}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="porcentaje" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ✅ 2. PIE: SATISFACCIÓN GENERAL */}
        <GlassCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Satisfacción General
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataSatisfaccion}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {dataSatisfaccion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ✅ 3. LINE: TENDENCIA DEL CLIMA */}
        <GlassCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Tendencia del Clima Laboral
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dataTendencia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clima"
                stroke="#2196F3"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ✅ 4. BARRA HORIZONTAL: PARTICIPACIÓN POR ÁREA */}
        <GlassCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Participación por Área
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={dataParticipacion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="porcentaje" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ✅ 5. ÁREA: COMPARATIVA 2024 VS 2025 */}
        <GlassCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Comparativa 2024 vs 2025
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dataComparativa}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dimension" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="2024" stroke="#9C27B0" fill="#9C27B0" fillOpacity={0.3} />
              <Area type="monotone" dataKey="2025" stroke="#00BCD4" fill="#00BCD4" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* ✅ 6. RADAR: VISUALIZACIÓN GLOBAL */}
        <GlassCard>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Evaluación Global por Dimensión
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Clima Laboral"
                dataKey="A"
                stroke="#F44336"
                fill="#F44336"
                fillOpacity={0.4}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>
      </Box>
    </Box>
  );
}
