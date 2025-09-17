export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'service_provider' | 'admin';
}

export interface ServiceProvider {
  id: number;
  userId: number;
  name: string;
  phone: string;
  bio?: string;
  experience: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  categories: Category[];
  coverageAreas: string[];
  portfolio?: PortfolioItem[];
  reviews?: Review[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  icon?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    name: string;
  };
}