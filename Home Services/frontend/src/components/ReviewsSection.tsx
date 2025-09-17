'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customerName: string;
}

export default function ReviewsSection({ providerId }: { providerId: number }) {
  const { user } = useUser();
  const isCustomer = user?.role === 'CUSTOMER';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/reviews/provider/${providerId}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [providerId]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCustomer) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerUserId: user.id,
          serviceProviderId: providerId,
          rating,
          comment: comment.trim() || null
        })
      });

      if (response.ok) {
        const review = await response.json();
        setReviews(prev => [review, ...prev]);
        setRating(5);
        setComment('');
        setShowForm(false);
        alert('Ocena je uspešno dodana!');
      }
    } catch (error) {
      alert('Greška pri slanju ocene');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (starRating: number, interactive = false) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= starRating ? 'text-yellow-400' : 'text-gray-300'} ${
            interactive ? 'cursor-pointer hover:scale-110' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={interactive ? () => setRating(star) : undefined}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Ocene i komentari ({reviews.length})
        </h2>
        {isCustomer && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? 'Odustani' : 'Oceni majstora'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submitReview} className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ostavite ocenu</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ocena</label>
            {renderStars(rating, true)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Komentar (opcionalno)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Podelite vaše iskustvo..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
            >
              {submitting ? 'Šalje se...' : 'Pošalji ocenu'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Odustani
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            ⭐
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nema ocena</h3>
          <p className="text-gray-600">Budite prvi koji će oceniti ovog majstora</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-center space-x-2 mb-1">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gray-900">{review.customerName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('sr-RS')}
                </span>
              </div>
              {review.comment && <p className="text-gray-700 mt-2">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}