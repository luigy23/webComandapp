import React, { useState, useEffect } from 'react';
import { tableCategoriesService, type TableCategory, TableCategoryStatus } from '../../../services/tablesService';
import Modal from '../../../components/Modal';
import ZonaForm from './ZonaForm';

const Zonas: React.FC = () => {
  const [categories, setCategories] = useState<TableCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TableCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await tableCategoriesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar zonas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: TableCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta zona? Las mesas asociadas quedarán sin zona asignada.')) {
      try {
        await tableCategoriesService.deleteCategory(id);
        await loadCategories();
      } catch (error) {
        console.error('Error al eliminar zona:', error);
      }
    }
  };

  const handleSubmit = async (formData: { name: string; description: string; status: TableCategoryStatus }) => {
    try {
      if (selectedCategory) {
        await tableCategoriesService.updateCategory(selectedCategory.id, formData);
      } else {
        await tableCategoriesService.createCategory(formData);
      }
      setIsModalOpen(false);
      await loadCategories();
    } catch (error) {
      console.error('Error al guardar zona:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: TableCategoryStatus) => {
    switch (status) {
      case TableCategoryStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case TableCategoryStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TableCategoryStatus) => {
    switch (status) {
      case TableCategoryStatus.ACTIVE:
        return 'Activa';
      case TableCategoryStatus.INACTIVE:
        return 'Inactiva';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Zonas</h1>
        <button
          onClick={handleCreate}
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
        >
          Crear Zona
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar zonas..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Cargando zonas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(category.status)}`}>
                    {getStatusText(category.status)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                {category.tables && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">
                      {category.tables.length} mesas asignadas
                    </span>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? 'Editar Zona' : 'Crear Zona'}
      >
        <ZonaForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedCategory || undefined}
        />
      </Modal>
    </div>
  );
};

export default Zonas; 