import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const HomePage = () => {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const response = await recipeService.getMostViewed();
        setPopularRecipes(response.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch popular recipes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRecipes();
  }, []);

   return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold mb-5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
          Waste Wise Eats
        </h1>
        <p className="text-lg font-poppins text-gray-700 mb-8 tracking-wide">Eat smart, waste less</p>
        
        <div className="bg-orange-50 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-3 text-orange-600">Did You Know?</h2>
          <p className="mb-5 text-gray-700 leading-relaxed">
            One-third of all food produced globally goes to waste. 
            Meanwhile, over 800 million people go to bed hungry every night.
          </p>
          <p className="text-xl font-semibold text-orange-700 mb-6">
            But what if you have the power to make a difference?
          </p>
          <Link 
            to="/search" 
            className="inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-orange-600 transition-colors duration-300"
          >
            Take Action
          </Link>
        </div>
      </div>
      
      
      <div className="bg-green-50 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Turn Leftovers into Delicious Meals!</h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Find delicious recipes by simply entering the ingredients you ALREADY have in your kitchen.
        </p>
        <Link 
          to="/search" 
          className="inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-orange-600 transition-colors duration-300"
        >
          Get Started
        </Link>
      </div>
      <br></br>
      <div className="bg-yellow-50 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto mb-16 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-700">🧊 Food Storage Tips</h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Learn how to store food properly to reduce waste, save money, and keep your ingredients fresh longer.
        </p>
        <Link 
          to="/tips" 
          className="inline-block bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-300"
        >
          Explore Tips
        </Link>
      </div>
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Most Popular Recipes</h2>
          <Link to="/recipes" className="text-orange-500 font-semibold hover:underline">
            See all
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500 italic">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};


export default HomePage;
