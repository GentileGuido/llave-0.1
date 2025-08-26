export const metadata = { 
  title: "LLAVE - Deploy Exitoso", 
  description: "Aplicación funcionando en Railway" 
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
