'use client';

import { useState, useEffect } from 'react';

interface Conversation {
  id: string;
  lastMessage: string;
  lastMessageAt: string;
  customer?: {
    user: {
      id: string;
      name: string;
      phone: string;
    };
  };
  provider?: {
    user: {
      id: string;
      name: string;
      phone: string;
    };
  };
  messages: Array<{
    content: string;
    createdAt: string;
  }>;
}

export default function PorukePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/conversations/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Morate biti ulogovani
          </h1>
          <p className="text-gray-600 mb-6">
            Da biste pristupili porukama, molimo vas da se prijavite
          </p>
          <button
            onClick={() => window.location.href = '/prijava'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Prijavite se
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje poruka...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Moje poruke
          </h1>
          <p className="text-gray-600">
            Istorija svih vaših razgovora sa majstorima
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nemate poruke
            </h2>
            <p className="text-gray-600 mb-6">
              Kada kontaktirate majstora, vaši razgovori će se pojaviti ovde
            </p>
            <button
              onClick={() => window.location.href = '/majstori'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Pronađi majstora
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const otherUser = user.role === 'CUSTOMER'
                ? conversation.provider?.user
                : conversation.customer?.user;

              return (
                <div
                  key={conversation.id}
                  onClick={() => window.location.href = `/poruke/${conversation.id}`}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {otherUser?.name || 'Nepoznat korisnik'}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(conversation.lastMessageAt).toLocaleDateString('sr-RS', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-2">
                        {otherUser?.phone}
                      </p>

                      {conversation.lastMessage && (
                        <p className="text-gray-700 line-clamp-2">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}