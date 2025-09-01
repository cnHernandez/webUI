import FormularioCubierta from './Cubiertas/FormularioCubierta';
import FormularioMontaje from './Cubiertas/FormularioMontaje';
import Menu from './Layout/Menu';
import ListaStockCubiertas from './Cubiertas/ListaStockCubiertas';
import { useState } from 'react';
import HistorialCubiertaTab from './Cubiertas/HistorialCubiertaTab';

function App() {
  const [tab, setTab] = useState<'ingreso' | 'rotacion' | 'stock' | 'historial'>('ingreso');
  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      <Menu />
      <div className="w-screen bg-white rounded-none shadow-none p-0">
        <div className="flex gap-4 border-b border-gray-200 pt-4 pb-2 justify-center">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'ingreso' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTab('ingreso')}
          >Ingreso</button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'rotacion' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTab('rotacion')}
          >Rotación</button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'stock' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTab('stock')}
          >Stock</button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'historial' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTab('historial')}
          >Historial</button>
        </div>
        {tab === 'ingreso' && <FormularioCubierta />}
        {tab === 'rotacion' && <FormularioMontaje />}
        {tab === 'stock' && (
          <div className="py-8">
            <ListaStockCubiertas />
          </div>
        )}
        {tab === 'historial' && (
          <div className="py-8">
            <HistorialCubiertaTab />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
