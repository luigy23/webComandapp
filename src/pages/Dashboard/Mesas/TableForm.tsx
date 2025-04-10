import React, { useState } from 'react';
import { TableStatus, type Table, type TableCategory } from '../../../services/tablesService';

interface TableFormProps {
  onSubmit: (data: {
    number: string;
    description: string;
    capacity: number;
    status: TableStatus;
    categoryId?: number;
  }) => void;
  onCancel: () => void;
  categories: TableCategory[];
  initialData?: Table;
}

const TableForm: React.FC<TableFormProps> = ({
  onSubmit,
  onCancel,
  categories,
  initialData
}) => {
  const [formData, setFormData] = useState({
    number: initialData?.number || '',
    description: initialData?.description || '',
    capacity: initialData?.capacity || 4,
    status: initialData?.status || TableStatus.AVAILABLE,
    categoryId: initialData?.categoryId || undefined
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : 
              name === 'categoryId' ? (value === '' ? undefined : Number(value)) : 
              value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número de Mesa
        </label>
        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Capacidad
        </label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          min={1}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
        >
          <option value={TableStatus.AVAILABLE}>Disponible</option>
          <option value={TableStatus.OCCUPIED}>Ocupada</option>
          <option value={TableStatus.BILL_PENDING}>Pendiente de Pago</option>
          <option value={TableStatus.DISABLED}>Deshabilitada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Zona/Categoría
        </label>
        <select
          name="categoryId"
          value={formData.categoryId || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none"
        >
          <option value="">Sin categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
        >
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default TableForm; 