import FormularioCubierta from './Cubiertas/FormularioCubierta';
import FormularioMontaje from './Cubiertas/FormularioMontaje';
import Menu from './Layout/Menu';
import ListaStockCubiertas from './Cubiertas/ListaStockCubiertas';
import { useState } from 'react';

function App() {
  const [tab, setTab] = useState<'ingreso' | 'rotacion' | 'stock'>('ingreso');
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Menu />
      <div style={{ width: '100vw', background: '#fff', borderRadius: '0', boxShadow: 'none', padding: '0' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', padding: '1rem 0 0.5rem 0', justifyContent: 'center' }}>
          <button
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem 0.5rem 0 0', fontWeight: '600', background: tab === 'ingreso' ? '#dbeafe' : '#f3f4f6', color: tab === 'ingreso' ? '#1d4ed8' : '#4b5563', border: 'none' }}
            onClick={() => setTab('ingreso')}
          >Ingreso</button>
          <button
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem 0.5rem 0 0', fontWeight: '600', background: tab === 'rotacion' ? '#dbeafe' : '#f3f4f6', color: tab === 'rotacion' ? '#1d4ed8' : '#4b5563', border: 'none' }}
            onClick={() => setTab('rotacion')}
          >Rotación</button>
          <button
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem 0.5rem 0 0', fontWeight: '600', background: tab === 'stock' ? '#dbeafe' : '#f3f4f6', color: tab === 'stock' ? '#1d4ed8' : '#4b5563', border: 'none' }}
            onClick={() => setTab('stock')}
          >Stock</button>
        </div>
        {tab === 'ingreso' && <FormularioCubierta />}
        {tab === 'rotacion' && <FormularioMontaje />}
        {tab === 'stock' && (
          <div style={{ padding: '2rem 0' }}>
            <ListaStockCubiertas />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
