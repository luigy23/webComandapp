import React, { useState } from 'react';

// Definimos el tipo para nuestros usuarios
interface User {
  id: number;
  nombre: string;
  rol: string;
  correo: string;
  activo: boolean;
}

// Datos mock
const mockUsers: User[] = [
  { id: 1, nombre: 'Luigy', rol: 'ADMIN:1', correo: 'luigy@pp.com', activo: true },
  { id: 2, nombre: 'Luigy', rol: 'ADMIN:1', correo: 'luigy@pp.com', activo: true },
  { id: 3, nombre: 'Luigy', rol: 'ADMIN:1', correo: 'luigy@pp.com', activo: true },
  { id: 4, nombre: 'Luigy', rol: 'ADMIN:1', correo: 'luigy@pp.com', activo: true },
  { id: 5, nombre: 'Ana', rol: 'USER:2', correo: 'ana@pp.com', activo: true },
  { id: 6, nombre: 'Carlos', rol: 'USER:3', correo: 'carlos@pp.com', activo: false },
];

// Componente principal
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Función para manejar la búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Función para desactivar usuario
  const handleDeactivate = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, activo: !user.activo } : user
    ));
  };

  // Función para editar usuario (simulada)
  const handleEdit = (id: number) => {
    alert(`Editando usuario con ID: ${id}`);
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className='flex justify-end pb-2'>
        <button className='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors cursor-pointer'>
          Crear Usuario
        </button>
      </div>
      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
      <UsersTable 
        users={filteredUsers} 
        onDeactivate={handleDeactivate} 
        onEdit={handleEdit} 
      />
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  onEdit: (id: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onDeactivate, onEdit }) => {
  return (
    <div className="w-full">
      <div className="bg-gray-800 text-white py-4 px-6 grid grid-cols-4 rounded-t-lg">
        <div className="font-medium">Nombre</div>
        <div className="font-medium">Rol;id</div>
        <div className="font-medium">correo</div>
        <div className="font-medium text-right">Acciones</div>
      </div>
      
      {users.map(user => (
        <UserRow 
          key={user.id} 
          user={user} 
          onDeactivate={() => onDeactivate(user.id)} 
          onEdit={() => onEdit(user.id)} 
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
      <div>{user.nombre}</div>
      <div>{user.rol}</div>
      <div>{user.correo}</div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onDeactivate}
          className="px-4 py-2 bg-red-200 text-red-700 rounded-lg hover:bg-red-300"
        >
          Desactivar
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