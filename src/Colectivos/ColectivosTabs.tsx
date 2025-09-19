
import { useState } from 'react';
import ListaColectivosVTV from './ListaColectivosVTV';
import HistorialVtvTab from './HistorialVtvTab';
import FormularioColectivo from './FormularioColectivo';

type TabKey = 'listado' | 'historial' | 'ingreso';

export default function ColectivosTabs() {
  const [tab, setTab] = useState<TabKey>('listado');
  return (
    <div className="w-full bg-white rounded-none shadow-none p-0">
      <div className="flex gap-4 pt-4 pb-2 justify-center items-center w-full">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'listado' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setTab('listado')}
        >Listado</button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'historial' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setTab('historial')}
        >Historial VTV</button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'ingreso' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setTab('ingreso')}
        >Ingreso</button>
      </div>
      {tab === 'listado' && (
        <div className="py-8">
          <ListaColectivosVTV />
        </div>
      )}
      {tab === 'historial' && (
        <div className="py-8">
          <HistorialVtvTab />
        </div>
      )}
      {tab === 'ingreso' && (
        <div className="py-8">
          <FormularioColectivo />
        </div>
      )}
    </div>
  );
}
