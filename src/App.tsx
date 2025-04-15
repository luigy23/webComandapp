import {  Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './pages/Login'; // Asegúrate que la ruta sea correcta
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard/Dashboard';
import Usuarios from './pages/Dashboard/Usuarios';
import TabsLayout from './components/Tabs';
import Roles from './pages/Dashboard/Usuarios/Roles';
import Mesas from './pages/Dashboard/Mesas';
import Zonas from './pages/Dashboard/Mesas/Zonas';
import Productos from './pages/Dashboard/Productos';
import Categorias from './pages/Dashboard/Productos/Categorias';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoutes = ({children}: {children: React.ReactNode}) => {
  const {isAuthenticated, isInitialized} = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={
          <div>
            <h1>Register</h1>
          </div>
        } />
        <Route path="/" element={
          <PrivateRoutes>
            <Dashboard></Dashboard>
          </PrivateRoutes>
        } />
        <Route path="/dashboard" element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        } />

        <Route path="/usuarios/*" element={
          <PrivateRoutes>
            <Dashboard>
              <TabsLayout tabs={[
                { label: 'Usuarios', path: '/usuarios' },
                { label: 'Roles', path: '/usuarios/roles' }
              ]}>

                <Routes>
                  <Route path="/" element={<Usuarios />} />
                  <Route path="/roles" element={<Roles />} />
                </Routes>
              </TabsLayout>
            </Dashboard>
          </PrivateRoutes>
        } />

        <Route path="/mesas/*" element={
          <PrivateRoutes>
            <Dashboard>
              <TabsLayout tabs={[
                { label: 'Mesas', path: '/mesas' },
                { label: 'Zonas', path: '/mesas/zonas' }
              ]}>
                <Routes>
                  <Route path="/" element={<Mesas />} />
                  <Route path="/zonas" element={<Zonas />} />
                </Routes>
              </TabsLayout>
            </Dashboard>
          </PrivateRoutes>
        } />


        {/* Rutas para productos y categorías */}
        <Route path="/productos" element={
          <PrivateRoutes>
            <Dashboard>
              <TabsLayout tabs={[
                { label: 'Productos', path: '/productos' },
                { label: 'Categorias', path: '/categorias' }
              ]}>
               <Productos />
              </TabsLayout>
            </Dashboard>
          </PrivateRoutes>
        } />

        <Route path="/categorias" element={
          <PrivateRoutes>
            <Dashboard>
              <TabsLayout tabs={[
                { label: 'Productos', path: '/productos' },
                { label: 'Categorias', path: '/categorias' }
              ]}>
                <Categorias />
              </TabsLayout>
            </Dashboard>
          </PrivateRoutes>
        } />
      </Routes>
    </>
  )
}

export default App
