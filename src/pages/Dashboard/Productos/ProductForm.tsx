import React, { useState, useEffect } from 'react';
import { Category, CreateProductData, type Product, ProductStatus } from '../../../services/productsService';
import { IconPicture } from '../../../assets/Icons/IconPicture';
import Select from '../../../components/Select';

interface ProductFormProps {
    onSubmit: (data: CreateProductData) => void;
    onCancel: () => void;
    onDelete?: () => void;
    categories: Category[];
    initialData?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({
    onSubmit,
    onCancel,
    onDelete,
    categories,
    initialData
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        status: initialData?.status || ProductStatus.ACTIVE,
        categoryId: initialData?.categoryId || 0,
        imageUrl: initialData?.imageUrl || '',
        stock: initialData?.stock || 0,
    });
    const [image, setImage] = useState<File | null>(null);
    const [displayPrice, setDisplayPrice] = useState(formatPrice(formData.price));
    const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            file: image || undefined
        });
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            // Crear URL para la previsualización
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        const numberValue = parseInt(numericValue) || 0;
        
        setFormData(prev => ({ ...prev, price: numberValue }));
        setDisplayPrice(formatPrice(numberValue));
    };

    // Limpiar la URL de la previsualización cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    function formatPrice(price: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    const getImagePreview = () => {
        if (image) return URL.createObjectURL(image);
        if (initialData?.imageUrl) return initialData.imageUrl;
        return '';
    };

    const getLabelStatus = (status: ProductStatus) => {
        switch (status) {
            case ProductStatus.ACTIVE:
                return 'Activo';
            case ProductStatus.INACTIVE:
                return 'Inactivo';
            case ProductStatus.OUT_OF_STOCK:
                return 'Agotado';
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-row gap-4 ">
                {/* 1ra Columna */}
                <div className="flex flex-col gap-4 w-1/2">
                    {/* Imagen del producto */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg w-56 h-56 border-2 text-gray-400 border-gray-400 relative overflow-hidden cursor-pointer"
                        style={{
                            backgroundImage: `url(${getImagePreview()})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="flex flex-col items-center justify-center">
                            {
                                !getImagePreview() && (
                                    <>
                                        <IconPicture className="w-12 h-12 " />
                                        <p className="text-sm">Imagen del producto</p>
                                    </>
                                )
                            }

                            <span className="px-3.5 py-1.5 mt-2   bg-wasabi-600 text-white rounded-md">Cambiar imagen</span>
                            <input
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                type="file" id="image" name="image" onChange={handleImageChange} />
                        </div>
                    </div>
                    {/* Categoria del producto */}
                    <div className="w-full">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <Select
                            value={formData.categoryId?.toString() || ''}
                            onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                            options={categories.map((category) => ({ value: category.id.toString(), label: category.name }))}
                        />
                    </div>
                    {/* Precio del producto */}
                    <div className="w-full">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={displayPrice}
                                onChange={handlePriceChange}
                                className="w-full appearance-none rounded-lg bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
                                placeholder="$ 0"
                            />
                        </div>
                    </div>
                </div>
                {/* 2da Columna */}
                <div className="flex flex-col gap-4 w-1/2">
                    {/* Nombre del producto */}
                    <div>
                        <label htmlFor="name">Nombre</label>
                        <input 
                        placeholder="Nombre del producto"
                        className="w-full appearance-none rounded-lg bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
                        type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    {/* Descripción del producto */}
                    <div>
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            placeholder="Descripción del producto"
                            className="w-full appearance-none rounded-lg bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Stock del producto */}
                    <div>
                        <label htmlFor="stock">Stock</label>
                        <input 
                        placeholder="Stock del producto"
                        className="w-full appearance-none rounded-lg bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none"
                        type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} />
                    </div>
                    {/* Estado del producto */}
                    <div>
                        <label htmlFor="status">Estado</label>
                        

                        <Select
                            value={formData.status.toString()}
                            onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) as unknown as ProductStatus })}
                            options={Object.values(ProductStatus).map((status) => ({ value: status.toString(), label: getLabelStatus(status) }))}
                        />
                    </div>
                    {/* Botones de acción */}
                    <div className="flex flex-row gap-4">
                        <button type="button" className="bg-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-300 cursor-pointer transition-colors" onClick={onCancel}>Cancelar</button>
                        {initialData && onDelete && (
                            <button 
                                type="button" 
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer transition-colors" 
                                onClick={() => {
                                    if (window.confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
                                        onDelete();
                                    }
                                }}
                            >
                                Eliminar
                            </button>
                        )}
                        <button type="submit" className="bg-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-300 cursor-pointer transition-colors">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;

