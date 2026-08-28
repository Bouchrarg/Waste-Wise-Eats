import React, { useState, useEffect } from 'react';
import { ingredientService } from '../services/api';

const IngredientInput = ({ onAddIngredient }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchIngredients = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await ingredientService.search(query);
        const results = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.results)
          ? response.data.results
          : [];
        setSuggestions(results);
      } catch (err) {
        console.error('Failed to fetch ingredients', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchIngredients, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (ingredient) => {
    onAddIngredient(ingredient);
    setQuery('');
    setSuggestions([]);
  };

  const handleManualAdd = () => {
    if (query.trim()) {
      onAddIngredient({ name: query.trim() });
      setQuery('');
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Add ingredients..."
          className="flex-1 p-2 border rounded-l"
        />
        <button
          onClick={handleManualAdd}
          className="bg-orange-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>
      
      {loading && <div className="mt-1 text-sm">Loading...</div>}
      
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((ingredient) => (
            <div
              key={ingredient.id}
              onClick={() => handleSelect(ingredient)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {ingredient.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientInput;
