import React, { useState, useEffect } from 'react';
import IngredientInput from '../components/IngredientInput';
import RecipeCard from '../components/RecipeCard';
import SpoonacularRecipeCard from '../components/SpoonacularRecipeCard';
import { recipeService, profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SearchPage = () => {
  const { currentUser } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [localRecipes, setLocalRecipes] = useState([]);
  const [spoonacularRecipes, setSpoonacularRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'local', 'spoonacular'

  useEffect(() => {
    if (currentUser) {
      const fetchSavedRecipes = async () => {
        try {
          const response = await profileService.getProfile(currentUser.id);
          setSavedRecipes(response.data.saved_recipes.map(recipe => recipe.id));
        } catch (err) {
          console.error('Failed to fetch saved recipes', err);
        }
      };
      fetchSavedRecipes();
    }
  }, [currentUser]);

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    try {
      // Search local database
      const localResponse = await recipeService.findByIngredients(
        ingredients.map(ing => ing.name)
      );
      setLocalRecipes(localResponse.data);
      
      // Search Spoonacular API
      const spoonacularResponse = await recipeService.searchSpoonacular(
        ingredients.map(ing => ing.name)
      );
      setSpoonacularRecipes(spoonacularResponse.data);
    } catch (err) {
      console.error('Failed to search recipes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (recipeId) => {
    if (savedRecipes.includes(recipeId)) {
      setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
    } else {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  const handleSpoonacularSave = (recipeId) => {
    // Just trigger a refetch of saved recipes
    if (currentUser) {
      profileService.getProfile(currentUser.id)
        .then(response => {
          setSavedRecipes(response.data.saved_recipes.map(recipe => recipe.id));
        })
        .catch(err => {
          console.error('Failed to fetch saved recipes', err);
        });
    }
  };

  const handleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const ingredientsFromSpeech = transcript
        .split(',')
        .map(item => ({ name: item.trim() }))
        .filter(item => item.name);
      
      setIngredients([...ingredients, ...ingredientsFromSpeech]);
    };

    recognition.start();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Search Recipes by Ingredients</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="mb-4">
          Please write down or record the ingredients you currently have:
        </p>
        
        <div className="mb-4">
          <IngredientInput onAddIngredient={handleAddIngredient} />
        </div>
        
        <div className="flex items-center mb-6">
          <button 
            onClick={handleSpeechRecognition}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 mr-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <div className="flex flex-wrap">
            {ingredients.map((ingredient, index) => (
              <div 
                key={index} 
                className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
              >
                {ingredient.name}
                <button 
                  onClick={() => handleRemoveIngredient(index)}
                  className="ml-2 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleSearch}
          disabled={ingredients.length === 0}
          className={`w-full py-2 rounded font-medium ${
            ingredients.length === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          Find Recipes
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for recipes...</p>
        </div>
      ) : (
        <>
          {(localRecipes.length > 0 || spoonacularRecipes.length > 0) && (
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'all'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    All Recipes ({spoonacularRecipes.length + localRecipes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('spoonacular')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'spoonacular'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Discover New ({spoonacularRecipes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('local')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'local'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Saved Recipes ({localRecipes.length})
                  </button>
                </nav>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'all' && (
                  <>
                    {spoonacularRecipes.map(recipe => (
                      <SpoonacularRecipeCard 
                        key={`spoon-${recipe.id}`} 
                        recipe={recipe} 
                        onSave={handleSpoonacularSave}
                      />
                    ))}
                    {localRecipes.map(recipe => (
                      <RecipeCard 
                        key={`local-${recipe.id}`} 
                        recipe={recipe} 
                        isSaved={savedRecipes.includes(recipe.id)}
                        onSaveToggle={handleSaveToggle}
                      />
                    ))}
                  </>
                )}
                
                {activeTab === 'spoonacular' && (
                  <>
                    {spoonacularRecipes.map(recipe => (
                      <SpoonacularRecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onSave={handleSpoonacularSave}
                      />
                    ))}
                  </>
                )}
                
                {activeTab === 'local' && (
                  <>
                    {localRecipes.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        isSaved={savedRecipes.includes(recipe.id)}
                        onSaveToggle={handleSaveToggle}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
          
          {!loading && localRecipes.length === 0 && spoonacularRecipes.length === 0 && ingredients.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No recipes found with those ingredients. Try different ingredients!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;