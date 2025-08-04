import React from "react";
import { Box, TextField, Select, MenuItem } from "@mui/material";

export default function PreguntaForm({
  preguntaData,
  dimensiones,
  escalas,
  onChange,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
      <TextField
        fullWidth
        size="small"
        label="Pregunta"
        value={preguntaData.pregunta}
        onChange={(e) => onChange("pregunta", e.target.value)}
        sx={{ mb: 1 }}
      />

      <Select
        size="small"
        value={preguntaData.id_dimension}
        onChange={(e) => onChange("id_dimension", e.target.value)}
        sx={{ mb: 1 }}
      >
        {dimensiones.map((d) => (
          <MenuItem key={d.id_dimension} value={d.id_dimension}>
            {d.nombre}
          </MenuItem>
        ))}
      </Select>

      <Select
        size="small"
        value={preguntaData.id_escala}
        onChange={(e) => onChange("id_escala", e.target.value)}
        sx={{ mb: 1 }}
      >
        {escalas.map((e) => (
          <MenuItem key={e.id_escala} value={e.id_escala}>
            {e.nombre}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
