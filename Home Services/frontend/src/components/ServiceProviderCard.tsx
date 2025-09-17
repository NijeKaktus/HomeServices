'use client';

import { ServiceProvider } from '@/types';

interface ServiceProviderCardProps {
  serviceProvider: ServiceProvider;
  onClick: () => void;
}

export default function ServiceProviderCard({ serviceProvider, onClick }: ServiceProviderCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {serviceProvider.name}
          </h3>
          {serviceProvider.isVerified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
              Verifikovano
            </span>
          )}
        </div>
        {serviceProvider.rating && (
          <div className="flex items-center">
            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              {serviceProvider.rating.toFixed(1)}
            </div>
            {serviceProvider.totalReviews && (
              <span className="text-xs text-gray-500 ml-2">
                ({serviceProvider.totalReviews} ocena)
              </span>
            )}
          </div>
        )}
      </div>

      {serviceProvider.bio && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {serviceProvider.bio}
        </p>
      )}

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Usluge:</p>
        <div className="flex flex-wrap gap-1">
          {serviceProvider.categories.slice(0, 3).map((category) => (
            <span
              key={category.id}
              className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
            >
              {category.name}
            </span>
          ))}
          {serviceProvider.categories.length > 3 && (
            <span className="text-xs text-gray-500">
              +{serviceProvider.categories.length - 3} još
            </span>
          )}
        </div>
      </div>

      {serviceProvider.coverageAreas.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Pokriva:</p>
          <p className="text-sm text-gray-600">
            {serviceProvider.coverageAreas.slice(0, 2).join(', ')}
            {serviceProvider.coverageAreas.length > 2 && '...'}
          </p>
        </div>
      )}
    </div>
  );
}