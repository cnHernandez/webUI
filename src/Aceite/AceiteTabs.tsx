import { useState } from 'react';
import ListaColectivos from './ListaColectivos';
import HistorialCambioAceiteTab from './HistorialCambioAceiteTab';

type AceiteTabKey = 'listado' | 'historial';

export default function AceiteTabs() {
  const [tab, setTab] = useState<AceiteTabKey>('listado');
  return (
    <div className="w-full bg-white rounded-none shadow-none p-0">
      <div className="flex gap-4 pt-4 pb-2 justify-center">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'listado' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setTab('listado')}
        >Listado</button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'historial' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setTab('historial')}
        >Historial</button>
      </div>
      {tab === 'listado' && (
        <div className="py-8">
          <ListaColectivos tab={tab} />
        </div>
      )}
      {tab === 'historial' && (
        <div className="py-8">
          <HistorialCambioAceiteTab />
        </div>
      )}
    </div>
  );
}