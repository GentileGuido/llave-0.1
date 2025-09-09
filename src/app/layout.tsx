import "@/styles/pixel-art.css";
import "@/styles/characters.css";
import "@/styles/logo.css";

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="es">
      <head>
        <title>Llave - Gestor de Contraseñas</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗝️</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
