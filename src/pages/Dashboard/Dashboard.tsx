import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/Sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const Dashboard = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      {/* Contenido principal */}
      <div className="md:ml-64 p-8">
        {/* Header con información del usuario */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Bienvenido, {user?.name}</h2>
              <p className="text-gray-600">Rol: {user?.role.name}</p>
            </div>
          </div>
        </div>
        
        {/* Contenido dinámico */}
        {children}
      </div>
    </div>
  );
};

export default Dashboard;