import logo from '../assets/logo.png';

export default function Menu() {
  return (
    <div className="w-full bg-white flex items-center h-20 shadow-md">
      <img src={logo} alt="Logo Gomería" className="h-20 w-20 object-contain ml-5" />
      <div className="flex-1 flex justify-center items-center">
        <span className="font-bold text-3xl text-gray-900 tracking-widest -ml-24">GOMERIA</span>
      </div>
    </div>
  );
}
