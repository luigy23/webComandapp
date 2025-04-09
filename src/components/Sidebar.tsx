import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed top-0 left-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">ComandAPP</h1>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 py-4">
          <div className='gap-10'>
            <Link to="/productos" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3">🍔</span>
              <span>Productos</span>
            </Link>
            
            <Link to="/usuarios" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3">👥</span>
              <span>Usuarios</span>
            </Link>

            <Link to="/caja" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3">💰</span>
              <span>Caja</span>
            </Link>

            <Link to="/reportes" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3">📊</span>
              <span>Reportes</span>
            </Link>

            <Link to="/configuracion" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3">⚙️</span>
              <span>Configuración</span>
            </Link>
          </div>
        </nav>

        {/* Botón de cerrar sesión */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 