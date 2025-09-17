'use client';

import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-center mb-4">
        {category.icon && (
          <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-3">
            {category.icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-800">
          {category.name}
        </h3>
      </div>
      <p className="text-gray-600 text-sm">
        {category.description}
      </p>
      <div className="mt-4 text-blue-600 font-medium text-sm">
        Pogledaj majstore →
      </div>
    </div>
  );
}