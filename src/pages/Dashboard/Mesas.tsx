import React, { useState, useEffect } from 'react';
import { tablesService, tableCategoriesService, type Table, type TableCategory, TableStatus } from '../../services/tablesService';
import Modal from '../../components/Modal';
import TableForm from './Mesas/TableForm';
import ItemMesa from './Mesas/ItemMesa';

const Mesas: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [categories, setCategories] = useState<TableCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTables();
    loadCategories();
  }, []);

  const loadTables = async () => {
    try {
      const data = await tablesService.getTables();
      setTables(data);
    } catch (error) {
      console.error('Error al cargar mesas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await tableCategoriesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleCategoryChange = async (categoryId: number | 'all') => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    try {
      const data = await tablesService.getTables(categoryId === 'all' ? undefined : categoryId);
      setTables(data);
    } catch (error) {
      console.error('Error al filtrar mesas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreate = () => {
    setSelectedTable(null);
    setIsModalOpen(true);
  };

  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta mesa?')) {
      try {
        await tablesService.deleteTable(id);
        await loadTables();
      } catch (error) {
        console.error('Error al eliminar mesa:', error);
      }
    }
  };

  const handleSubmit = async (formData: { number: string; description: string; capacity: number; status: TableStatus; categoryId?: number }) => {
    try {
      if (selectedTable) {
        await tablesService.updateTable(selectedTable.id, formData);
      } else {
        await tablesService.createTable(formData);
      }
      setIsModalOpen(false);
      await loadTables();
    } catch (error) {
      console.error('Error al guardar mesa:', error);
    }
  };

  const filteredTables = tables.filter(table => 
    table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Mesas</h1>
        <button
          onClick={handleCreate}
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
        >
          Crear Mesa
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Filtro por categoría */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
        >
          <option value="all">Todas las zonas</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar mesas..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Cargando mesas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map(table => (
            <ItemMesa
              key={table.id}
              table={table}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTable ? 'Editar Mesa' : 'Crear Mesa'}
      >
        <TableForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          categories={categories}
          initialData={selectedTable || undefined}
        />
      </Modal>
    </div>
  );
};

export default Mesas;
