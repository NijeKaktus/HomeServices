'use client';

import { useState, useEffect, use } from 'react';
import { ServiceProvider } from '@/types';
import ReviewsSection from '@/components/ReviewsSection';
import { useUser } from '@/hooks/useUser';

interface ServiceProviderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ServiceProviderPage({ params }: ServiceProviderPageProps) {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const isCustomer = user?.role === 'CUSTOMER';

  const resolvedParams = use(params);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/service-providers/${resolvedParams.id}`);
        if (response.ok) {
          const provider: ServiceProvider = await response.json();
          setProvider(provider);
        } else {
          setProvider(null);
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
        setProvider(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [resolvedParams.id]);

  const contactProvider = () => {
    if (provider) {
      window.location.href = `tel:${provider.phone}`;
    }
  };

  const startConversation = async () => {
    if (!provider || !isCustomer) return;

    try {
      const response = await fetch('http://localhost:5000/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerUserId: user.id,
          providerUserId: provider.userId
        }),
      });

      if (response.ok) {
        const conversation = await response.json();
        window.location.href = `/poruke/${conversation.id}`;
      } else {
        alert('Greška pri pokretanju razgovora');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Greška pri pokretanju razgovora');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje majstora...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Majstor nije pronađen
          </h1>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Vrati se na početnu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {provider.name}
                    </h1>
                    <div className="flex items-center space-x-4">
                      {provider.isVerified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verifikovano
                        </span>
                      )}
                      {provider.rating && (
                        <div className="flex items-center">
                          <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            {provider.rating.toFixed(1)}
                          </div>
                          {provider.totalReviews && (
                            <span className="text-sm text-gray-500 ml-2">
                              ({provider.totalReviews} ocena)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {provider.bio && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      O majstoru
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {provider.bio}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Iskustvo
                    </h3>
                    <p className="text-gray-600">
                      {provider.experience} godina rada
                    </p>
                  </div>

                  {user ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Telefon
                      </h3>
                      <p className="text-gray-600">
                        {provider.phone}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Telefon
                      </h3>
                      <p className="text-gray-600">
                        <span className="text-blue-600 cursor-pointer" onClick={() => window.location.href = '/prijava'}>
                          Prijavite se da vidite broj
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Usluge
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.categories.map((category) => (
                      <span
                        key={category.id}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-md"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>

                {provider.coverageAreas.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Oblasti rada
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.coverageAreas.map((area, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {provider.portfolio && provider.portfolio.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Portfolio radova
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {provider.portfolio.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                          <img
                            src={`http://localhost:5000${item.imageUrl}`}
                            alt={item.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Kontaktiraj majstora
                </h2>

                <div className="space-y-4">
                  {user ? (
                    <>
                      <button
                        onClick={contactProvider}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
                      >
                        Pozovi {provider.phone}
                      </button>

                      <button
                        onClick={startConversation}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium"
                      >
                        Pošalji poruku
                      </button>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Kontaktiranjem ovog majstora prihvatate uslove korišćenja platforme.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => window.location.href = '/prijava'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
                      >
                        Prijavite se za kontakt
                      </button>

                      <button
                        onClick={() => window.location.href = '/registracija'}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium"
                      >
                        Registrujte se
                      </button>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Morate biti ulogovani da kontaktirate majstora.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <ReviewsSection providerId={parseInt(resolvedParams.id)} />
          </div>
        </div>
      </div>
    </div>
  );
}