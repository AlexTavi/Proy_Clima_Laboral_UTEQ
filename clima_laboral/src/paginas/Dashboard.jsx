import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "../componentes/GlassCard2.jsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function Dashboard({ setPageTitle }) {
  const { id_formulario } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setPageTitle(`DASHBOARD #${id_formulario}`);

    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}api/dashboard/${id_formulario}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_formulario, setPageTitle, token, apiUrl]);

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-400">⚠️ Error: {error}</p>;
  if (!data.length) return <p className="text-yellow-400">Sin datos disponibles</p>;

  return (
      <GlassCard>
        <h2 className="text-2xl font-bold mb-6">📊 Resultados por Dimensión</h2>

        {/* Gráfico */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dimension" angle={-30} textAnchor="end" interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Insatisfecho" stackId="a" fill="#e53e3e" />
              <Bar dataKey="Indecisos" stackId="a" fill="#f6ad55" />
              <Bar dataKey="Satisfechos" stackId="a" fill="#48bb78" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg p-4 text-gray-800">
          <h3 className="text-lg font-semibold mb-4">Resumen</h3>
          <table className="w-full text-sm border">
            <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Dimensión</th>
              <th className="p-2 text-center">Insatisfecho (%)</th>
              <th className="p-2 text-center">Indecisos (%)</th>
              <th className="p-2 text-center">Satisfechos (%)</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{item.dimension}</td>
                  <td className="p-2 text-center">{item.Insatisfecho}</td>
                  <td className="p-2 text-center">{item.Indecisos}</td>
                  <td className="p-2 text-center">{item.Satisfechos}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
  );
}
