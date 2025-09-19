import { useState } from 'react';
import FormularioCubierta from './FormularioCubierta';
import FormularioMontaje from './FormularioMontaje';
import ListaStockCubiertas from './ListaStockCubiertas';
import HistorialCubiertaTab from './HistorialCubiertaTab';

type TabKey = 'ingreso' | 'rotacion' | 'stock' | 'historial';

const tabMap: Record<string, TabKey> = {
  'Ingreso': 'ingreso',
  'Rotación': 'rotacion',
  'Stock': 'stock',
  'Historial': 'historial',
};

const opciones = ['Ingreso', 'Rotación', 'Stock', 'Historial'];

export default function GomeriaTabs() {
  const [tab, setTab] = useState<TabKey>('ingreso');
  return (
    <div className="w-full bg-white rounded-none shadow-none p-0">
  <div className="flex gap-4 border-b border-gray-200 pt-4 pb-2 justify-center items-center w-full">
        {opciones.map(opcion => (
          <button
            key={opcion}
            className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === tabMap[opcion] ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTab(tabMap[opcion])}
          >{opcion}</button>
        ))}
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
  );
}