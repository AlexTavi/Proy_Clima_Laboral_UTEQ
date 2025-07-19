import { Paper } from "@mui/material";

export default function GlassCard({ children, sx = {}, ...props }) {
    return (
        <Paper
            elevation={8}
            sx={{
                backdropFilter: "blur(14px)",
                background: "rgba(234,235,238,0.57)",
                border: "1.5px solid #9a99d355",
                padding: 4,
                maxWidth: 500,
                margin: "2rem auto",
                borderRadius: 4,
                ...sx, // permite sobreescribir o extender estilos si lo necesitas
            }}
            {...props}
        >
            {children}
        </Paper>
    );
}

