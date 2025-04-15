{/* <div className="relative min-w-[200px]">
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
</div> */}

import React from 'react';

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  minWidth?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar',
  className = '',
  minWidth = '200px',
}) => {
  return (
    <div className={`relative ${minWidth ? `min-w-[${minWidth}]` : 'min-w-[200px]'}`}>
      <select
        value={value}
        onChange={onChange}
        className={`w-full appearance-none rounded-lg bg-white px-4 py-2.5 text-gray-700 shadow-sm border border-gray-200 focus:border-gray-400 focus:outline-none ${className}`}
      >
        <option value="all">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default Select;
