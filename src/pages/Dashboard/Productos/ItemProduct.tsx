import React from 'react';
import { type Product } from '../../../services/productsService';

interface ItemProductProps {
  product: Product;
  onEdit: (product: Product) => void;
  onToggleActive: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ItemProduct: React.FC<ItemProductProps> = ({ product, onEdit, onToggleActive }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 w-full max-w-2xl">
      {/* Imagen del producto */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>
        <div className="space-y-1">
          <p className="text-gray-600">
            Precio: ${product.price}
          </p>
          <p className="text-gray-600">
            Stock: {product.stock}
          </p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {product.category.name}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onToggleActive(product)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${product.status === 'ACTIVE'
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
        >
          {product.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
        </button>
        <button
          onClick={() => onEdit(product)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default ItemProduct; 