import {  Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './pages/Login'; // Asegúrate que la ruta sea correcta
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard/Dashboard';
import Usuarios from './pages/Dashboard/Usuarios';

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
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={
        <div>
          <h1>Register</h1>
        </div>
      } />
      <Route path="/" element={
        <PrivateRoutes>
          <div>
            <h1>Home</h1>
          </div>
        </PrivateRoutes>
      } />
      <Route path="/dashboard" element={
        <PrivateRoutes>
          <Dashboard />
        </PrivateRoutes>
      } />

      <Route path="/usuarios" element={
        <PrivateRoutes>
          <Dashboard>
            <Usuarios />
          </Dashboard>
        </PrivateRoutes>
      } />
    </Routes>
  )
}

export default App
