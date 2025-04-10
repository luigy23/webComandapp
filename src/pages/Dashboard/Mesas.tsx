import React, { useState, useEffect } from 'react';
import { tablesService, tableCategoriesService, type Table, type TableCategory, TableStatus } from '../../services/tablesService';
import Modal from '../../components/Modal';
import TableForm from './Mesas/TableForm';

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

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case TableStatus.OCCUPIED:
        return 'bg-red-100 text-red-800';
      case TableStatus.BILL_PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TableStatus.DISABLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'Disponible';
      case TableStatus.OCCUPIED:
        return 'Ocupada';
      case TableStatus.BILL_PENDING:
        return 'Pendiente de Pago';
      case TableStatus.DISABLED:
        return 'Deshabilitada';
      default:
        return status;
    }
  };

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
            <div key={table.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">Mesa {table.number}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(table.status)}`}>
                    {getStatusText(table.status)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{table.description}</p>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Capacidad: {table.capacity} personas
                  </span>
                </div>
                {table.category && (
                  <div className="mb-4">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {table.category.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(table)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
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
