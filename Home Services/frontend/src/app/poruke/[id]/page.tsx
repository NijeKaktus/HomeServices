'use client';

import { useState, useEffect, use } from 'react';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
}

interface ConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const resolvedParams = use(params);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/conversations/${resolvedParams.id}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchConversation = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/conversations/${user.id}`);
        if (response.ok) {
          const conversations = await response.json();
          const currentConversation = conversations.find((c: any) => c.id === resolvedParams.id);
          if (currentConversation) {
            if (user.role === 'CUSTOMER') {
              setOtherUser(currentConversation.provider.user);
            } else {
              setOtherUser(currentConversation.customer.user);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchMessages();
    fetchConversation();
  }, [resolvedParams.id, user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const response = await fetch('http://localhost:5000/api/messages/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: resolvedParams.id,
          senderId: user.id,
          content: newMessage.trim()
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      } else {
        alert('Greška pri slanju poruke');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Greška pri slanju poruke');
    }
  };

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
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              ← Nazad
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Razgovor sa {otherUser?.name || 'korisnik'}
              </h1>
              <p className="text-sm text-gray-500">
                {otherUser?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Još nema poruka u ovom razgovoru.</p>
                <p className="text-sm">Budite prvi koji će poslati poruku!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString('sr-RS', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Unesite poruku..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
              >
                Pošalji
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}