import React, { useState, useEffect } from 'react';
import { Category, CreateCategoryData, productCategoriesService } from '../../../services/productsService';
import { toast } from 'react-toastify';
import Modal from '../../../components/Modal';
import CategoryForm from './CategoryForm';

const Categorias: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await productCategoriesService.getCategories();
            setCategories(data);
        } catch {
            toast.error('Error al cargar las categorías');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (data: CreateCategoryData) => {
        try {
            await productCategoriesService.createCategory(data);
            toast.success('Categoría creada exitosamente');
            setIsFormOpen(false);
            fetchCategories();
        } catch {
            toast.error('Error al crear la categoría');
        }
    };

    const handleUpdate = async (data: CreateCategoryData) => {
        if (!selectedCategory) return;
        try {
            await productCategoriesService.updateCategory(selectedCategory.id, data);
            toast.success('Categoría actualizada exitosamente');
            setIsFormOpen(false);
            setSelectedCategory(null);
            fetchCategories();
        } catch {
            toast.error('Error al actualizar la categoría');
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        try {
            await productCategoriesService.deleteCategory(selectedCategory.id);
            toast.success('Categoría eliminada exitosamente');
            setIsFormOpen(false);
            setSelectedCategory(null);
            fetchCategories();
        } catch {
            toast.error('Error al eliminar la categoría');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categorías de Productos</h1>
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Nueva Categoría
                </button>
            </div>

            <Modal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedCategory(null);
                }}
                title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            >
                <CategoryForm
                    onSubmit={selectedCategory ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setSelectedCategory(null);
                    }}
                    onDelete={selectedCategory ? handleDelete : undefined}
                    initialData={selectedCategory || undefined}
                />
            </Modal>

            {isLoading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                                setSelectedCategory(category);
                                setIsFormOpen(true);
                            }}
                        >
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                            <p className="text-gray-600 mt-2">{category.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categorias;
