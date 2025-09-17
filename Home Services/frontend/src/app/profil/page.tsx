'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  serviceProvider?: {
    id: number;
    bio: string;
    experience: number;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    categories: Array<{
      id: number;
      name: string;
    }>;
    coverageAreas: string[];
    portfolio?: PortfolioItem[];
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    experience: 0,
    categories: [] as number[],
    coverageAreas: [''] as string[]
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    description: '',
    image: null as File | null
  });
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/prijava');
      return;
    }

    fetchProfile();
    fetchCategories();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name,
          phone: data.phone,
          bio: data.serviceProvider?.bio || '',
          experience: data.serviceProvider?.experience || 0,
          categories: data.serviceProvider?.categories?.map((cat: any) => cat.id) || [],
          coverageAreas: data.serviceProvider?.coverageAreas || ['']
        });
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/prijava');
      }
    } catch (error) {
      console.error('Greška pri učitavanju profila:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Greška pri učitavanju kategorija:', error);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const addCoverageArea = () => {
    setFormData(prev => ({
      ...prev,
      coverageAreas: [...prev.coverageAreas, '']
    }));
  };

  const updateCoverageArea = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      coverageAreas: prev.coverageAreas.map((area, i) =>
        i === index ? value : area
      )
    }));
  };

  const removeCoverageArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coverageAreas: prev.coverageAreas.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');

      const hasPasswordChange = passwordData.oldPassword || passwordData.newPassword || passwordData.confirmPassword;

      if (hasPasswordChange) {
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          alert('Molimo unesite sva polja za promenu šifre');
          setSaving(false);
          return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert('Nova šifra i ponovna šifra se ne poklapaju');
          setSaving(false);
          return;
        }

        if (passwordData.newPassword.length < 6) {
          alert('Nova šifra mora imati minimum 6 karaktera');
          setSaving(false);
          return;
        }
      }

      const updateData = {
        ...formData,
        coverageAreas: formData.coverageAreas.filter(area => area.trim() !== ''),
        ...(hasPasswordChange && {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        alert('Profil uspešno ažuriran!');
        setEditing(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        fetchProfile();
      } else {
        const error = await response.json();
        alert(error.error || 'Greška pri ažuriranju profila');
      }
    } catch (error) {
      console.error('Greška:', error);
      alert('Greška pri ažuriranju profila');
    } finally {
      setSaving(false);
    }
  };

  const handlePortfolioUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!portfolioForm.title || !portfolioForm.description || !portfolioForm.image) {
      alert('Molimo unesite sve podatke i izaberite sliku');
      return;
    }

    setUploadingPortfolio(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', portfolioForm.title);
      formData.append('description', portfolioForm.description);
      formData.append('image', portfolioForm.image);

      const response = await fetch(`${API_BASE_URL}/api/service-providers/${profile?.serviceProvider?.id}/portfolio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Slika uspešno dodana u portfolio!');
        setPortfolioForm({ title: '', description: '', image: null });
        fetchProfile();
      } else {
        const error = await response.json();
        alert(error.error || 'Greška pri kačenju slike');
      }
    } catch (error) {
      console.error('Error uploading portfolio:', error);
      alert('Greška pri kačenju slike');
    } finally {
      setUploadingPortfolio(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Greška</h1>
          <p className="text-gray-600">Nije moguće učitati profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-blue-100">
                  {profile.role === 'SERVICE_PROVIDER' ? 'Majstor' : 'Korisnik'}
                  {profile.serviceProvider?.isVerified && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Verifikovan
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md text-sm font-medium"
              >
                {editing ? 'Odustani' : 'Uredi profil'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {!editing ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Osnovne informacije</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Telefon</label>
                      <p className="mt-1 text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                </div>

                {profile.serviceProvider && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">O majstoru</h3>
                      <p className="text-gray-700">{profile.serviceProvider.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Iskustvo</label>
                        <p className="mt-1 text-gray-900">{profile.serviceProvider.experience} godina</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Ocena</label>
                        <p className="mt-1 text-gray-900">{profile.serviceProvider.rating}/5.0</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Recenzije</label>
                        <p className="mt-1 text-gray-900">{profile.serviceProvider.totalReviews}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Usluge</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.serviceProvider.categories.map((cat) => (
                          <span key={cat.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Područja rada</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.serviceProvider.coverageAreas.map((area, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Portfolio radova</h3>
                      {profile.serviceProvider.portfolio && profile.serviceProvider.portfolio.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {profile.serviceProvider.portfolio.map((item) => (
                            <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                              <img
                                src={`${API_BASE_URL}${item.imageUrl}`}
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
                      ) : (
                        <p className="text-gray-500 text-sm">Nema dodanih radova u portfolio</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ime i prezime
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {profile.role === 'SERVICE_PROVIDER' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        O meni
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Godine iskustva
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Izaberite godine iskustva</option>
                        <option value="1">1 godina</option>
                        <option value="2">2 godine</option>
                        <option value="3">3 godine</option>
                        <option value="4">4 godine</option>
                        <option value="5">5 godina</option>
                        <option value="6">6 godina</option>
                        <option value="7">7 godina</option>
                        <option value="8">8 godina</option>
                        <option value="9">9 godina</option>
                        <option value="10">10 godina</option>
                        <option value="11">11 godina</option>
                        <option value="12">12 godina</option>
                        <option value="13">13 godina</option>
                        <option value="14">14 godina</option>
                        <option value="15">15 godina</option>
                        <option value="16">16 godina</option>
                        <option value="17">17 godina</option>
                        <option value="18">18 godina</option>
                        <option value="19">19 godina</option>
                        <option value="20">20 godina</option>
                        <option value="21">21 godina</option>
                        <option value="22">22 godine</option>
                        <option value="23">23 godine</option>
                        <option value="24">24 godine</option>
                        <option value="25">25 godina</option>
                        <option value="26">26 godina</option>
                        <option value="27">27 godina</option>
                        <option value="28">28 godina</option>
                        <option value="29">29 godina</option>
                        <option value="30">30+ godina</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vrste usluga koje pružam
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-start p-2 border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.categories.includes(category.id)}
                              onChange={() => handleCategoryChange(category.id)}
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {category.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gradovi u kojima radim
                      </label>
                      {formData.coverageAreas.map((area, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={area}
                            onChange={(e) => updateCoverageArea(index, e.target.value)}
                            placeholder="Unesite naziv grada"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.coverageAreas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCoverageArea(index)}
                              className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCoverageArea}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        + Dodaj grad
                      </button>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Dodaj rad u portfolio</h3>
                      <form onSubmit={handlePortfolioUpload} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Naziv rada
                          </label>
                          <input
                            type="text"
                            value={portfolioForm.title}
                            onChange={(e) => setPortfolioForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="npr. Renoviranje kupatila"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opis rada
                          </label>
                          <textarea
                            value={portfolioForm.description}
                            onChange={(e) => setPortfolioForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Kratko opišite izvršeni rad..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slika rada
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setPortfolioForm(prev => ({ ...prev, image: file }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Maksimalna veličina: 5MB. Dozvoljeni formati: JPG, PNG, GIF
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={uploadingPortfolio}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        >
                          {uploadingPortfolio ? 'Kačim sliku...' : 'Dodaj u portfolio'}
                        </button>
                      </form>
                    </div>
                  </>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Promena šifre</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stara šifra
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                          className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showOldPassword ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-0.415-0.415m4.242 4.242L15.536 15.536M14.122 14.122l-0.415-0.415m0 6.364L15.536 15.536m-4.243 4.243L8.464 15.536m4.243 4.243L8.464 8.464M15.536 15.536L8.464 8.464M15.536 15.536l-4.243 4.243" />
                            ) : (
                              <>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={showOldPassword ? 3 : 2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={showOldPassword ? 3 : 2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova šifra
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showNewPassword ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-0.415-0.415m4.242 4.242L15.536 15.536M14.122 14.122l-0.415-0.415m0 6.364L15.536 15.536m-4.243 4.243L8.464 15.536m4.243 4.243L8.464 8.464M15.536 15.536L8.464 8.464M15.536 15.536l-4.243 4.243" />
                            ) : (
                              <>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ponovi novu šifru
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showConfirmPassword ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-0.415-0.415m4.242 4.242L15.536 15.536M14.122 14.122l-0.415-0.415m0 6.364L15.536 15.536m-4.243 4.243L8.464 15.536m4.243 4.243L8.464 8.464M15.536 15.536L8.464 8.464M15.536 15.536l-4.243 4.243" />
                            ) : (
                              <>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    {saving ? 'Čuvam...' : 'Sačuvaj izmene'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Odustani
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}