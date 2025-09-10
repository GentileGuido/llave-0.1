import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Llave - Gestor de Contraseñas',
  description: 'El gestor de contraseñas que necesitabas',
  manifest: '/manifest.json',
  themeColor: '#00ff41',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Llave'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗝️</text></svg>" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                // Capture beforeinstallprompt as early as possible
                window.addEventListener('beforeinstallprompt', function(e){
                  console.log('beforeinstallprompt captured!');
                  e.preventDefault();
                  window.__bipEvent = e;
                  window.dispatchEvent(new Event('bip-ready'));
                });
                window.addEventListener('appinstalled', function(){
                  console.log('App installed!');
                  window.__bipEvent = null;
                });
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}