import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta name="theme-color" content="#00ff41" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Llave" />
        <link rel="manifest" href="/manifest.json" />
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
