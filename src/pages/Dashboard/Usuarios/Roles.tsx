import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { rolesService, type Role, type Permission } from '../../../services/rolesService';
import RoleForm from './RoleForm';

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await rolesService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      try {
        await rolesService.deleteRole(id);
        await loadRoles();
      } catch (error) {
        console.error('Error al eliminar rol:', error);
      }
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: { name: string; description: string; permissions: Permission[] }) => {
    try {
      if (selectedRole) {
        await rolesService.updateRole(selectedRole.id, formData);
      } else {
        await rolesService.createRole(formData);
      }
      setIsModalOpen(false);
      await loadRoles();
    } catch (error) {
      console.error('Error al guardar rol:', error);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Roles</h1>
        <button
          onClick={handleCreate}
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
        >
          Crear Rol
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar roles..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Cargando roles...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-800 text-white p-4">
            <div>Nombre</div>
            <div>Descripción</div>
            <div className="text-right">Acciones</div>
          </div>

          {filteredRoles.map(role => (
            <div key={role.id} className="grid grid-cols-3 p-4 border-b items-center">
              <div>{role.name}</div>
              <div>{role.description}</div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? 'Editar Rol' : 'Crear Rol'}
      >
        <RoleForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedRole ? {
            name: selectedRole.name,
            description: selectedRole.description,
            permissions: selectedRole.permissions
          } : undefined}
        />
      </Modal>
    </div>
  );
};

export default Roles; 