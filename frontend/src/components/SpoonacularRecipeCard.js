import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';

const SpoonacularRecipeCard = ({ recipe, onSave }) => {
  const { currentUser } = useAuth();
  
  const handleSave = async () => {
    if (!currentUser) return;
    
    try {
      await profileService.saveSpoonacularRecipe(currentUser.id, recipe.id);
      if (onSave) onSave(recipe.id);
    } catch (err) {
      console.error('Failed to save recipe', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/spoonacular/${recipe.id}`}>
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-40 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/spoonacular/${recipe.id}`}>
            <h3 className="text-lg font-medium">{recipe.title}</h3>
          </Link>
          {currentUser && (
            <button onClick={handleSave}>
              <svg 
                className="w-6 h-6 text-gray-400" 
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
        <p className="text-gray-600 mt-1">{recipe.readyInMinutes || recipe.usedIngredientCount + ' used ingredients'} min</p>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            <span className="text-green-500 font-medium">
              {recipe.usedIngredientCount} ingredient{recipe.usedIngredientCount !== 1 ? 's' : ''} used
            </span>
            {recipe.missedIngredientCount > 0 && (
              <span className="text-red-500 font-medium ml-2">
                {recipe.missedIngredientCount} missing
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpoonacularRecipeCard;