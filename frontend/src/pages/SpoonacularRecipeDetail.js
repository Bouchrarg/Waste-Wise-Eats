import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { recipeService } from '../services/api';

const SpoonacularRecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getSpoonacularDetails(id);
        setRecipe(response.data);
      } catch (err) {
        setError('Failed to load recipe details');
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error || 'Recipe not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-64 object-cover"
          />
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-100 rounded">
                <div className="text-2xl font-bold text-orange-500">{recipe.readyInMinutes}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded">
                <div className="text-2xl font-bold text-orange-500">{recipe.servings}</div>
                <div className="text-sm text-gray-600">Servings</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded">
                <div className="text-2xl font-bold text-orange-500">{recipe.healthScore}</div>
                <div className="text-sm text-gray-600">Health Score</div>
              </div>
            </div>

            {recipe.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">About This Recipe</h2>
                <p className="text-gray-700">{stripHtml(recipe.summary)}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.extendedIngredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      <span className="font-medium mr-2">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                      <span>{ingredient.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                  <ol className="space-y-4">
                    {recipe.analyzedInstructions[0].steps.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-1">
                          {step.number}
                        </span>
                        <span className="text-gray-700">{step.step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="text-gray-600">
                    {recipe.instructions ? stripHtml(recipe.instructions) : 'No instructions available'}
                  </div>
                )}
              </div>
            </div>

            {recipe.diets && recipe.diets.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.diets.map((diet, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpoonacularRecipeDetail;