'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalCustomers: number;
    totalProviders: number;
    totalCategories: number;
    verifiedProviders: number;
    totalReviews: number;
    averageRating: number;
  };
  monthlyRegistrations: Array<{
    month: string;
    count: number;
  }>;
  recentProviders: Array<{
    id: number;
    user: {
      name: string;
      createdAt: string;
    };
    categories: Array<{
      category: {
        name: string;
      };
    }>;
    isVerified: boolean;
    rating: number;
    totalReviews: number;
  }>;
  popularCategories: Array<{
    id: number;
    name: string;
    serviceProviders: Array<any>;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      router.push('/prijava');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Greška pri dohvatanju statistika:', error);
    } finally {
      setLoading(false);
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

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Greška pri učitavanju podataka</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <nav className="flex space-x-4">
              <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md">Dashboard</a>
              <a href="/admin/korisnici" className="text-gray-600 hover:text-gray-900 px-4 py-2">Korisnici</a>
              <a href="/admin/kategorije" className="text-gray-600 hover:text-gray-900 px-4 py-2">Kategorije</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ukupno korisnika</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.overview.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.overview.totalCustomers} mušterija, {stats.overview.totalProviders} majstora
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recenzije</h3>
            <p className="text-3xl font-bold text-green-600">{stats.overview.totalReviews}</p>
            <p className="text-sm text-gray-500 mt-1">
              Ukupno ocena majstora
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Verifikovani majstori</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.overview.verifiedProviders}</p>
            <p className="text-sm text-gray-500 mt-1">
              od ukupno {stats.overview.totalProviders} majstora
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prosečna ocena</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.overview.averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.overview.totalCategories} kategorija usluga
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Novi majstori</h3>
            <div className="space-y-4">
              {stats.recentProviders.map((provider) => (
                <div key={provider.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{provider.user.name}</p>
                      <p className="text-sm text-gray-600">
                        {provider.categories.map(cat => cat.category.name).join(', ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Registrovan: {new Date(provider.user.createdAt).toLocaleDateString('sr-RS')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        provider.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {provider.isVerified ? 'Verifikovan' : 'Neproverjen'}
                      </span>
                      {provider.rating > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Ocena: {provider.rating.toFixed(1)} ({provider.totalReviews})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mesečne registracije majstora</h3>
            <div className="space-y-3">
              {stats.monthlyRegistrations.slice(0, 6).map((month, index) => (
                <div key={month.month} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((month.count / Math.max(...stats.monthlyRegistrations.map(m => m.count))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{month.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Najpopularnije kategorije</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.popularCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.serviceProviders.length} majstora</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}