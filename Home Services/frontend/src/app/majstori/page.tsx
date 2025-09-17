'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchFilters from '@/components/SearchFilters';
import { ServiceProvider } from '@/types';

export default function MajstoriPage() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const [currentFilters, setCurrentFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('categoryId') || '',
    city: searchParams.get('city') || '',
    sortBy: searchParams.get('sortBy') || 'rating'
  });

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentFilters.search) params.append('search', currentFilters.search);
        if (currentFilters.category) params.append('categoryId', currentFilters.category);
        if (currentFilters.city) params.append('city', currentFilters.city);
        if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);

        const response = await fetch(`http://localhost:5000/api/service-providers?${params}`);
        if (response.ok) {
          const data = await response.json();
          setProviders(data);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [currentFilters.search, currentFilters.category, currentFilters.city, currentFilters.sortBy]);

  const handleFiltersChange = useCallback((filters: typeof currentFilters) => {
    setCurrentFilters(filters);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Pretražujem majstore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pronađi majstora
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pretražite majstore po kategoriji, gradu ili iskustvu
          </p>
        </div>

        <SearchFilters initialFilters={currentFilters} onFiltersChange={handleFiltersChange} />

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Pronađeno {providers.length} majstora
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nema rezultata
            </h3>
            <p className="text-gray-600">
              Pokušajte sa drugim filterima pretrage
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => window.location.href = `/majstor/${provider.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {provider.name}
                      </h3>
                      <div className="flex items-center space-x-3">
                        {provider.isVerified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verifikovano
                          </span>
                        )}
                        {provider.rating > 0 && (
                          <div className="flex items-center">
                            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              ⭐ {provider.rating.toFixed(1)}
                            </div>
                            <span className="text-sm text-gray-500 ml-1">
                              ({provider.totalReviews})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {provider.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {provider.bio}
                    </p>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Iskustvo:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {provider.experience} godina
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Usluge:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.categories.map((category) => (
                        <span
                          key={category.id}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {provider.coverageAreas.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Oblasti rada:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.coverageAreas.slice(0, 3).map((area, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                          >
                            {area}
                          </span>
                        ))}
                        {provider.coverageAreas.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{provider.coverageAreas.length - 3} još
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}