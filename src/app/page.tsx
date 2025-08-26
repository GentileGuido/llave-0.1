export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>
          🚀 ¡LLAVE FUNCIONA!
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          La aplicación está desplegada correctamente en Railway
        </p>
        <div style={{ 
          backgroundColor: '#dcfce7', 
          border: '1px solid #22c55e',
          borderRadius: '5px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <p style={{ color: '#166534', margin: 0 }}>
            ✅ Deploy exitoso<br/>
            ✅ Next.js funcionando<br/>
            ✅ Railway conectado<br/>
            ✅ Listo para agregar funcionalidades
          </p>
        </div>
      </div>
    </div>
  );
}
