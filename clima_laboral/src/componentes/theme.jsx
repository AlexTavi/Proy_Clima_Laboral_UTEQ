// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#2a28be" },
        secondary: { main: "#4946a9" },
        background: { default: "#eaebee" },
        info: { main: "#9a99d3" },
    },
    shape: { borderRadius: 16 },
    typography: { fontFamily: "'Poppins', 'Segoe UI', sans-serif" }
});

export default theme;
