import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: (credentials) => api.post('/auth/token/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getCurrentUser: () => api.get('/auth/me/'),
};

// Recipe services
export const recipeService = {
  getAll: () => api.get('/api/recipes/'),
  getById: (id) => api.get(`/api/recipes/${id}/`),
  findByIngredients: (ingredients) => 
    api.post('/api/recipes/find_by_ingredients/', { ingredients }),
  searchSpoonacular: (ingredients, number = 10) => 
    api.post('/api/recipes/search_spoonacular/', { ingredients, number }),
  getSpoonacularDetails: (recipeId) => 
    api.post(`/api/recipes/${recipeId}/get_spoonacular_details/`),
  saveSpoonacularToDb: (recipeId) => 
    api.post(`/api/recipes/${recipeId}/save_to_database/`),
  incrementView: (id) => api.post(`/api/recipes/${id}/increment_view/`),
  getMostViewed: () => api.get('/api/recipes/?ordering=-views'),
};

// Ingredient services
export const ingredientService = {
  getAll: () => api.get('/api/ingredients/'),
  search: (query) => api.get(`/api/ingredients/?search=${query}`),
};

// User Profile services
export const profileService = {
  getProfile: (id) => api.get(`/api/profiles/me/`),
  updateProfile: (id, data) => api.patch(`/api/profiles/me/`, data),
  saveRecipe: (profileId, recipeId) => 
    api.post(`/api/profiles/${profileId}/save_recipe/`, { recipe_id: recipeId }),
  unsaveRecipe: (profileId, recipeId) => 
    api.post(`/api/profiles/${profileId}/unsave_recipe/`, { recipe_id: recipeId }),
  saveSpoonacularRecipe: (profileId, spoonacularId) => 
    api.post(`/api/profiles/${profileId}/save_spoonacular_recipe/`, { spoonacular_id: spoonacularId }),
};

// Storage Tips services
export const storageTipService = {
  getAll: () => api.get('/api/storage-tips/'),
  getByCategory: (category) => api.get(`/api/storage-tips/?search=${category}`),
};

export default api;