'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  services: Array<{
    id: number;
    name: string;
    description: string;
    isActive: boolean;
  }>;
  serviceProviders: Array<{
    serviceProvider: {
      user: {
        name: string;
      };
    };
  }>;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      router.push('/prijava');
      return;
    }

    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Greška pri dohvatanju kategorija:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (categoryId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setCategories(categories.map(cat =>
          cat.id === categoryId ? { ...cat, isActive: !currentStatus } : cat
        ));
      }
    } catch (error) {
      console.error('Greška pri ažuriranju kategorije:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Upravljanje kategorijama</h1>
            <nav className="flex space-x-4">
              <a href="/admin" className="text-gray-600 hover:text-gray-900 px-4 py-2">Dashboard</a>
              <a href="/admin/korisnici" className="text-gray-600 hover:text-gray-900 px-4 py-2">Korisnici</a>
              <a href="/admin/kategorije" className="bg-blue-600 text-white px-4 py-2 rounded-md">Kategorije</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {category.icon || category.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {category.serviceProviders.length} majstora
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Aktivna' : 'Neaktivna'}
                    </span>

                    <button
                      onClick={() => handleToggleActive(category.id, category.isActive)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        category.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {category.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Usluge ({category.services.length})
                    </h4>
                    <div className="space-y-2">
                      {category.services.slice(0, 3).map((service) => (
                        <div key={service.id} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{service.name}</p>
                              <p className="text-xs text-gray-600">{service.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              service.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.isActive ? 'A' : 'N'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {category.services.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          ... i još {category.services.length - 3} usluga
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Majstori ({category.serviceProviders.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {category.serviceProviders.slice(0, 5).map((provider, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {provider.serviceProvider.user.name}
                        </span>
                      ))}
                      {category.serviceProviders.length > 5 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{category.serviceProviders.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nema dostupnih kategorija</p>
          </div>
        )}
      </div>
    </div>
  );
}