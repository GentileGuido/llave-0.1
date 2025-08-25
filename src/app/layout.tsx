import "./../styles/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers";

export const metadata = { title: "LLAVE", description: "Gestor E2E con biometría" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="es">
      <body className="min-h-dvh bg-white text-black">
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
