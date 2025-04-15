import React from 'react';
import { type Table, TableStatus } from '../../../services/tablesService';

interface ItemMesaProps {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (id: number) => void;
}

const ItemMesa: React.FC<ItemMesaProps> = ({ table, onEdit, onDelete }) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            onClick={() => onEdit(table)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(table.id)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemMesa; 