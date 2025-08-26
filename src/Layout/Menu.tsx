import logo from '../assets/logo.png';

export default function Menu() {
  return (
    <div style={{ width: '100%', background: '#fff', display: 'flex', alignItems: 'center', height: '80px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
  <img src={logo} alt="Logo Gomería" style={{ height: '80px', width: '80px', objectFit: 'contain', marginLeft: '20px' }} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <span style={{ fontWeight: 'bold', fontSize: '2rem', color: '#111', letterSpacing: '0.1em', marginLeft: '-100px' }}>GOMERIA</span>
      </div>
    </div>
  );
}
