import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saved');

  useEffect(() => {
  const fetchProfile = async () => {
    if (!currentUser) return;
    
    try {
      // Appel sans id puisque getProfile ne prend plus d'argument
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [currentUser]);


  const handleSaveToggle = (recipeId) => {
    if (profile) {
      const updatedRecipes = profile.saved_recipes.filter(recipe => recipe.id !== recipeId);
      setProfile({
        ...profile,
        saved_recipes: updatedRecipes
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">My Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{profile.user?.username}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            {profile.nationality && (
              <div>
                <p className="text-gray-600">Nationality</p>
                <p className="font-medium">{profile.nationality}</p>
              </div>
            )}
            {profile.birth_date && (
              <div>
                <p className="text-gray-600">Birth Date</p>
                <p className="font-medium">{new Date(profile.birth_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'saved'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Recipes ({profile.saved_recipes?.length || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'saved' && (
              <div>
                {profile.saved_recipes && profile.saved_recipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.saved_recipes.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        isSaved={true}
                        onSaveToggle={handleSaveToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">You haven't saved any recipes yet.</p>
                    <p className="text-gray-600 mt-2">
                      <a href="/search" className="text-orange-600 hover:text-orange-500">
                        Search for recipes
                      </a> to get started!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;