import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';

const RecipeCard = ({ recipe, isSaved, onSaveToggle }) => {
  const { currentUser } = useAuth();
  
  const handleSaveToggle = async () => {
    if (!currentUser) return;
    
    try {
      if (isSaved) {
        await profileService.unsaveRecipe(currentUser.id, recipe.id);
      } else {
        await profileService.saveRecipe(currentUser.id, recipe.id);
      }
      if (onSaveToggle) onSaveToggle(recipe.id);
    } catch (err) {
      console.error('Failed to toggle recipe save status', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/recipes/${recipe.id}`}>
        <img 
          src={recipe.image || '/placeholder-food.jpg'} 
          alt={recipe.title} 
          className="w-full h-40 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/recipes/${recipe.id}`}>
            <h3 className="text-lg font-medium">{recipe.title}</h3>
          </Link>
          {currentUser && (
            <button onClick={handleSaveToggle}>
              <svg 
                className={`w-6 h-6 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-1">{recipe.preparation_time} min</p>
      </div>
    </div>
  );
};

export default RecipeCard;
