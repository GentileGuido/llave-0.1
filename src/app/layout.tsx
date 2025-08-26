import Providers from "@/components/Providers";
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
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
