'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useUser();

  const navLinks = [
    { href: '/majstori', text: 'Majstori' },
    { href: '/kako-funkcionise', text: 'Kako funkcioniše' }
  ];

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    const baseClass = mobile
      ? "block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
      : "text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium";

    const primaryClass = mobile
      ? "block w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium"
      : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium";

    if (isLoggedIn) {
      const userIcon = (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );

      return (
        <>
          {mobile && (
            <div className="px-3 py-2">
              <div className="flex items-center">
                {userIcon}
                <span className="ml-2 text-gray-700 text-base">
                  <span className="font-medium">{user.name}</span>
                </span>
              </div>
            </div>
          )}
          {!mobile && (
            <button
              onClick={() => window.location.href = '/profil'}
              className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-150 group"
            >
              {userIcon}
              <span className="ml-2 font-medium group-hover:font-bold transition-all duration-150">{user.name}</span>
            </button>
          )}
          {user.role === 'ADMIN' && (
            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin Panel
            </button>
          )}
          <button onClick={() => window.location.href = '/poruke'} className={baseClass}>
            {!mobile && (
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            )}
            Poruke
          </button>
          {mobile && (
            <button onClick={() => window.location.href = '/profil'} className={baseClass}>
              Moj profil
            </button>
          )}
          {mobile && user.role === 'ADMIN' && (
            <button onClick={() => window.location.href = '/admin'} className="block w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-base font-medium">
              Admin Panel
            </button>
          )}
          <button onClick={logout} className={baseClass}>
            Odjavi se
          </button>
        </>
      );
    }

    return (
      <>
        <button onClick={() => window.location.href = '/prijava'} className={baseClass}>
          Prijavi se
        </button>
        <button onClick={() => window.location.href = '/registracija'} className={primaryClass}>
          Registruj se
        </button>
      </>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              Home Services
            </a>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                {link.text}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                  {link.text}
                </a>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <AuthButtons mobile />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}