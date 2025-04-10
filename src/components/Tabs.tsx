import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Tab {
  label: string;
  path: string;
}

interface TabsLayoutProps {
  children: ReactNode;
  tabs: Tab[];
}

const TabsLayout = ({ children, tabs }: TabsLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de pestañas */}
      <div className="flex bg-white shadow-md">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-8 py-4 text-xl font-medium transition-colors duration-200 
              ${location.pathname === tab.path 
                ? 'bg-gray-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-6">
        {children}
      </div>


    </div>
  );
};

export default TabsLayout;
