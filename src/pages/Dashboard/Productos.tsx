import React, { useState, useEffect } from 'react';

import { Category, productsService, type Product, type UpdateProductData, ProductStatus, productCategoriesService, CreateProductData } from '../../services/productsService';
import ItemProduct from './Productos/ItemProduct';
import Modal from '../../components/Modal';
import ProductForm from './Productos/ProductForm';





const Productos: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);



  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productCategoriesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };


  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updateData: UpdateProductData = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        status: product.status === ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE
      };
      await productsService.updateProduct(product.id, updateData);
      await loadProducts();
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error);
    }
  };

  // Mapeo de estados para mostrar en la interfaz de usuario
  const getStatusLabel = (status: ProductStatus): string => {
    const statusMap = {
      [ProductStatus.ACTIVE]: 'Activo',
      [ProductStatus.INACTIVE]: 'Inactivo',
      [ProductStatus.OUT_OF_STOCK]: 'Sin Stock'
    };
    return statusMap[status] || status;
  };

  const handleSubmit = async (product: CreateProductData) => {
    try {
      if (selectedProduct) {
        // Actualizar producto existente
        await productsService.updateProduct(selectedProduct.id, product);
      } else {
        // Crear nuevo producto
        await productsService.createProduct(product);
      }
      await loadProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await productsService.deleteProduct(product.id);
      await loadProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

const filteredProducts = products.filter(product => 
  product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (selectedCategory === 'all' || product.categoryId === parseInt(selectedCategory)) &&
  (selectedStatus === 'all' || product.status === selectedStatus) );

  return (
    <>
    <div className="max-w-7xl mx-auto p-6">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Filtro de Categoría */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-full bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
            >
              <option value="all">Categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filtro de Estado */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-full bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
            >
              <option value="all">Estado</option>
              {Object.values(ProductStatus).map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>


        </div>

        {/* Botón Agregar Producto */}
        <button onClick={handleCreate} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Agregar producto
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-gray-400"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map(product => (
          <ItemProduct
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? "Editar Producto" : "Agregar Producto"}
      >
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          onDelete={selectedProduct ? () => handleDelete(selectedProduct) : undefined}
          categories={categories}
          initialData={selectedProduct || undefined}
        />
      </Modal>
    </>
  );
};

export default Productos;