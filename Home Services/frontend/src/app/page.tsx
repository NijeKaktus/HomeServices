'use client';

import { useState, useEffect } from 'react';
import CategoryCard from '@/components/CategoryCard';
import QuickSearch from '@/components/QuickSearch';
import { Category } from '@/types';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  serviceProvider: {
    id: number;
    name: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/service-providers/portfolio/latest`);
        if (response.ok) {
          const data = await response.json();
          setPortfolioItems(data);
        } else {
          console.error('Failed to fetch portfolio');
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchCategories();
    fetchPortfolio();
  }, []);
  const selectCategory = (category: Category) => {
    window.location.href = `/majstori?categoryId=${category.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-28">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Pronađi najboljeg majstora u svom gradu
            </h1>
            <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
              Poveži se sa proverenim majstorima u tvom okruženju.
              Brzo, jednostavno i sigurno.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickSearch />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Izaberi vrstu usluge
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Imamo majstore za sve vrste kućnih poslova i popravki
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              ))
            ) : (
              categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => selectCategory(category)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Galerija radova
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pogledaj najnovije radove naših majstora
            </p>
          </div>

          {portfolioLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : portfolioItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={`${API_BASE_URL}${item.imageUrl}`}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-xs text-blue-600 font-medium">
                      {item.serviceProvider.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Trenutno nema radova u galeriji</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kako funkcioniše?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">1. Pretraži</h3>
              <p className="text-black">Izaberi kategoriju usluge koju trebaš</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">2. Kontaktiraj</h3>
              <p className="text-black">Pošalji zahtev majstorima u tvom gradu</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">3. Završi posao</h3>
              <p className="text-black">Majstor dolazi i završava posao profesionalno</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
