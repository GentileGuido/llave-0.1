import "./../styles/globals.css";

export const metadata = { title: "LLAVE", description: "Gestor E2E con biometría" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-white text-black">{children}</body>
    </html>
  );
}
