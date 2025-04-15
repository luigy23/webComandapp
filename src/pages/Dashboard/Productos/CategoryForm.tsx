import React, { useState, useEffect } from 'react';
import { Category, CreateCategoryData } from '../../../services/productsService';

interface CategoryFormProps {
    onSubmit: (data: CreateCategoryData) => void;
    onCancel: () => void;
    onDelete?: () => void;
    initialData?: Category;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, onCancel, onDelete, initialData }) => {
    const [formData, setFormData] = useState<CreateCategoryData>({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                    type="text"
                    value={formData.name}
                    placeholder="Nombre de la categoría"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full appearance-none rounded-lg bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    value={formData.description}
                    placeholder="Descripción de la categoría"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full appearance-none rounded-lg bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
                    rows={3}
                    required
                />
            </div>
            <div className="flex justify-end space-x-3">
                {onDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                )}
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    {initialData ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm; 