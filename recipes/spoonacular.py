import requests
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

class SpoonacularClient:
    BASE_URL = "https://api.spoonacular.com"
    
    def __init__(self, api_key=None):
        self.api_key = api_key or settings.SPOONACULAR_API_KEY
    
    def _make_request(self, endpoint, params=None):
        """Make a request to the Spoonacular API with caching"""
        if params is None:
            params = {}
        
        # Add API key to parameters
        params['apiKey'] = self.api_key
        
        # Create cache key based on endpoint and parameters
        cache_key = f"spoonacular_{endpoint}_{str(sorted(params.items()))}"
        cached_response = cache.get(cache_key)
        
        if cached_response:
            return cached_response
        
        url = f"{self.BASE_URL}/{endpoint}"
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Cache the response for 1 hour
            cache.set(cache_key, data, 3600)
            
            return data
        except requests.exceptions.RequestException as e:
            logger.error(f"Spoonacular API error: {e}")
            return None
    
    def search_recipes_by_ingredients(self, ingredients, number=10, ranking=1, ignore_pantry=True):
        """
        Search for recipes by ingredients
        
        Args:
            ingredients (list): List of ingredient names
            number (int): Number of results to return
            ranking (int): 1 = maximize used ingredients, 2 = minimize missing ingredients
            ignore_pantry (bool): Whether to ignore typical pantry items
            
        Returns:
            list: List of recipe data
        """
        endpoint = "recipes/findByIngredients"
        params = {
            'ingredients': ','.join(ingredients),
            'number': number,
            'ranking': ranking,
            'ignorePantry': ignore_pantry
        }
        
        return self._make_request(endpoint, params)
    
    def get_recipe_information(self, recipe_id, include_nutrition=False):
        """Get detailed information about a recipe"""
        endpoint = f"recipes/{recipe_id}/information"
        params = {
            'includeNutrition': include_nutrition
        }
        
        return self._make_request(endpoint, params)
    
    def search_recipes_complex(self, query=None, cuisine=None, diet=None, 
                              intolerances=None, include_ingredients=None, 
                              exclude_ingredients=None, type=None, 
                              max_ready_time=None, number=10, offset=0):
        """
        Complex recipe search with multiple parameters
        """
        endpoint = "recipes/complexSearch"
        params = {
            'query': query,
            'cuisine': cuisine,
            'diet': diet,
            'intolerances': intolerances,
            'includeIngredients': ','.join(include_ingredients) if include_ingredients else None,
            'excludeIngredients': ','.join(exclude_ingredients) if exclude_ingredients else None,
            'type': type,
            'maxReadyTime': max_ready_time,
            'number': number,
            'offset': offset,
            'addRecipeInformation': True,
            'fillIngredients': True
        }
        
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}
        
        return self._make_request(endpoint, params)