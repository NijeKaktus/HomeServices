'use client';

import { useState, useEffect } from 'react';

import { Category } from '@/types';

export default function QuickSearch() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica'];

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedCategory) params.append('categoryId', selectedCategory);
    if (selectedCity) params.append('city', selectedCity);

    window.location.href = `/majstori${params.toString() ? `?${params}` : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 -mt-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Šta tražite?"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder:text-black"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">Izaberite kategoriju</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="">Izaberite grad</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium"
          >
            Pretraži
          </button>
        </div>
      </div>
    </div>
  );
}