export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
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
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>
          🚀 ¡HOLA MUNDO!
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          La aplicación funciona en Railway
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
