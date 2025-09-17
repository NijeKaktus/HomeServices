'use client';

import { useState, useEffect, useRef } from 'react';

interface Category {
  id: string;
  name: string;
}

interface SearchFiltersProps {
  initialFilters?: {
    search: string;
    category: string;
    city: string;
    sortBy: string;
  };
  onFiltersChange: (filters: {
    search: string;
    category: string;
    city: string;
    sortBy: string;
  }) => void;
}

export default function SearchFilters({ initialFilters, onFiltersChange }: SearchFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || '');
  const [selectedCity, setSelectedCity] = useState(initialFilters?.city || '');
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'rating');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const cities = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Pančevo'];

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onFiltersChange({
        search,
        category: selectedCategory,
        city: selectedCity,
        sortBy
      });
    }, search !== initialFilters?.search ? 500 : 0);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, selectedCategory, selectedCity, sortBy, onFiltersChange, initialFilters?.search]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedCity('');
    setSortBy('rating');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pretraži
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ime majstora ili opis..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategorija
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">Sve kategorije</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grad
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">Svi gradovi</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sortiraj po
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="rating">Oceni (najveća)</option>
            <option value="experience">Iskustvu (najviše)</option>
            <option value="reviews">Broju ocena</option>
            <option value="name">Imenu (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={clearFilters}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Obriši filtere
        </button>
      </div>
    </div>
  );
}