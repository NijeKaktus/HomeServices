'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  customer?: {
    id: number;
    address?: string;
    city?: string;
  };
  serviceProvider?: {
    id: number;
    bio?: string;
    experience: number;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    categories: Array<{
      category: {
        name: string;
      };
    }>;
  };
  admin?: {
    id: number;
    permissions: string;
  };
}

interface UserResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      router.push('/prijava');
      return;
    }

    fetchUsers();
  }, [router, currentPage, roleFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        role: roleFilter,
        search: searchQuery
      });

      const response = await fetch(`http://localhost:5000/api/admin/users?${params}`);
      const data: UserResponse = await response.json();

      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Greška pri dohvatanju korisnika:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user.id === userId && user.serviceProvider
            ? { ...user, serviceProvider: { ...user.serviceProvider, isVerified: !currentStatus } }
            : user
        ));
      }
    } catch (error) {
      console.error('Greška pri ažuriranju verifikacije:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Greška pri brisanju korisnika:', error);
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'Mušterija';
      case 'SERVICE_PROVIDER': return 'Majstor';
      case 'ADMIN': return 'Administrator';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800';
      case 'SERVICE_PROVIDER': return 'bg-green-100 text-green-800';
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Upravljanje korisnicima</h1>
            <nav className="flex space-x-4">
              <a href="/admin" className="text-gray-600 hover:text-gray-900 px-4 py-2">Dashboard</a>
              <a href="/admin/korisnici" className="bg-blue-600 text-white px-4 py-2 rounded-md">Korisnici</a>
              <a href="/admin/kategorije" className="text-gray-600 hover:text-gray-900 px-4 py-2">Kategorije</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Pretraži korisnike..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Svi korisnici</option>
            <option value="CUSTOMER">Mušterije</option>
            <option value="SERVICE_PROVIDER">Majstori</option>
            <option value="ADMIN">Administratori</option>
          </select>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleText(user.role)}
                          </span>
                          {user.serviceProvider?.isVerified && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Verifikovan
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{user.email}</span>
                          <span>{user.phone}</span>
                          <span>@{user.username}</span>
                        </div>

                        {user.serviceProvider && (
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <span>Ocena: {user.serviceProvider.rating.toFixed(1)} ({user.serviceProvider.totalReviews} recenzija)</span>
                              <span>Iskustvo: {user.serviceProvider.experience} godina</span>
                            </div>
                            {user.serviceProvider.categories.length > 0 && (
                              <div className="mt-1">
                                <span>Kategorije: </span>
                                {user.serviceProvider.categories.map((cat, index) => (
                                  <span key={index} className="text-blue-600">
                                    {cat.category.name}{index < user.serviceProvider!.categories.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {user.customer && (
                          <div className="mt-2 text-sm text-gray-600">
                            {user.customer.address && (
                              <span>{user.customer.address}, {user.customer.city}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {user.serviceProvider && (
                      <button
                        onClick={() => handleVerifyToggle(user.id, user.serviceProvider!.isVerified)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          user.serviceProvider.isVerified
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {user.serviceProvider.isVerified ? 'Ukloni verifikaciju' : 'Verifikuj'}
                      </button>
                    )}

                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                      >
                        Obriši
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prethodna
              </button>

              <span className="px-3 py-2 text-sm text-gray-700">
                Stranica {currentPage} od {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sledeća
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}