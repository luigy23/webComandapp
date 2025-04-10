import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import UserForm, { UserFormData } from './Usuarios/UserForm';
import { usersService } from '../../services/usersService';

// Definimos el tipo para nuestros usuarios
interface User {
  id: number;
  name: string;
  role: {
    name: string;
  };
  email: string;
  isActive: boolean;
}

// Componente principal
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Función para desactivar usuario
  const handleDeactivate = async (id: number) => {
    try {
      await usersService.deactivateUser(id);
      await loadUsers(); // Recargar la lista después de desactivar
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Función para abrir modal de edición
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Función para crear nuevo usuario
  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (userData: UserFormData) => {
    try {
      if (selectedUser) {
        await usersService.updateUser(selectedUser.id, userData);
      } else {
        await usersService.createUser(userData);
      }
      setIsModalOpen(false);
      await loadUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className='flex justify-end pb-2'>
        <button 
          onClick={handleCreate}
          className='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors cursor-pointer'
        >
          Crear Usuario
        </button>
      </div>
      
      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="text-center py-4">Cargando usuarios...</div>
      ) : (
        <UsersTable 
          users={filteredUsers} 
          onDeactivate={handleDeactivate} 
          onEdit={handleEdit} 
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Editar Usuario' : 'Registrar Usuario'}
      >
        <UserForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedUser ? {
            name: selectedUser.name,
            email: selectedUser.email,
            password: '',
            roleId: parseInt(selectedUser.role.name.split(':')[1])
          } : undefined}
        />
      </Modal>
    </div>
  );
};

// Componente para la barra de búsqueda
interface SearchBarProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="w-full mb-4">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Buscar"
          className="w-full p-3 border bg-white/75 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={onSearch}
        />
        <div className="absolute right-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Componente para la tabla de usuarios
interface UsersTableProps {
  users: User[];
  onDeactivate: (id: number) => void;
  onEdit: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onDeactivate, onEdit }) => {
  return (
    <div className="w-full">
      <div className="bg-gray-800 text-white py-4 px-6 grid grid-cols-4 rounded-t-lg">
        <div className="font-medium">Nombre</div>
        <div className="font-medium">Rol</div>
        <div className="font-medium">Correo</div>
        <div className="font-medium text-right">Acciones</div>
      </div>
      
      {users.map(user => (
        <UserRow 
          key={user.id} 
          user={user} 
          onDeactivate={() => onDeactivate(user.id)} 
          onEdit={() => onEdit(user)} 
        />
      ))}
    </div>
  );
};

// Componente para cada fila de usuario
interface UserRowProps {
  user: User;
  onDeactivate: () => void;
  onEdit: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onDeactivate, onEdit }) => {
  return (
    <div className="border-b border-l border-r border-gray-300 py-4 px-6 grid grid-cols-4 items-center">
      <div>{user.name}</div>
      <div>{user.role.name}</div>
      <div>{user.email}</div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onDeactivate}
          className="px-4 py-2 bg-red-200 text-red-700 rounded-lg hover:bg-red-300"
        >
          {user.isActive ? 'Desactivar' : 'Activar'}
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-300"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default UserManagement;