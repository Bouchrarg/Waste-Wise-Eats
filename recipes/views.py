from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Recipe, Ingredient, UserProfile, FoodStorageTip
from .serializers import (
    RecipeSerializer, IngredientSerializer, 
    UserProfileSerializer, FoodStorageTipSerializer
)
from .spoonacular import SpoonacularClient

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'ingredients__name']
    ordering_fields = ['views', 'created_at']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'find_by_ingredients', 'search_spoonacular']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'])
    def find_by_ingredients(self, request):
        """Find recipes based on available ingredients"""
        ingredients = request.data.get('ingredients', [])
        if not ingredients:
            return Response({"error": "No ingredients provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find recipes in our database
        recipes = Recipe.objects.filter(ingredients__name__in=ingredients).distinct()
        serializer = self.get_serializer(recipes, many=True)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def search_spoonacular(self, request):
        """Search recipes from Spoonacular API"""
        ingredients = request.data.get('ingredients', [])
        if not ingredients:
            return Response({"error": "No ingredients provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get number of results to return
        number = request.data.get('number', 10)
        
        # Search Spoonacular API
        client = SpoonacularClient()
        results = client.search_recipes_by_ingredients(ingredients, number=number)
        
        if results is None:
            return Response({"error": "Failed to fetch recipes from external API"}, 
                           status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response(results)
    
    @action(detail=True, methods=['post'])
    def get_spoonacular_details(self, request, pk=None):
        """Get detailed recipe information from Spoonacular"""
        client = SpoonacularClient()
        details = client.get_recipe_information(pk)
        
        if details is None:
            return Response({"error": "Failed to fetch recipe details from external API"}, 
                           status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response(details)
    
    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        recipe = self.get_object()
        recipe.views += 1
        recipe.save()
        return Response({"status": "view count incremented"})
    
    @action(detail=True, methods=['post'])
    def save_to_database(self, request, pk=None):
        """Save a Spoonacular recipe to our database"""
        # Get recipe details from Spoonacular
        client = SpoonacularClient()
        recipe_data = client.get_recipe_information(pk)
        
        if recipe_data is None:
            return Response({"error": "Failed to fetch recipe details"}, 
                           status=status.HTTP_400_BAD_REQUEST)
            
        # Create or update recipe in our database
        recipe, created = Recipe.objects.update_or_create(
            title=recipe_data.get('title'),
            defaults={
                'description': recipe_data.get('summary', ''),
                'preparation_time': recipe_data.get('readyInMinutes', 0),
                'cooking_instructions': recipe_data.get('instructions', ''),
                'image': recipe_data.get('image', '')
            }
        )
        
        # Process ingredients
        for item in recipe_data.get('extendedIngredients', []):
            ingredient, _ = Ingredient.objects.get_or_create(
                name=item.get('name', ''),
                defaults={'category': item.get('aisle', '')}
            )
            
            # Add ingredient to recipe with quantity
            recipe.ingredients.add(
                ingredient,
                through_defaults={'quantity': f"{item.get('amount', '')} {item.get('unit', '')}"}
            )
        
        serializer = self.get_serializer(recipe)
        return Response(serializer.data)

class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    permission_classes = [AllowAny]

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
    @action(detail=True, methods=['post'])
    def save_recipe(self, request, pk=None):
        profile = self.get_object()
        recipe_id = request.data.get('recipe_id')
        
        try:
            recipe = Recipe.objects.get(id=recipe_id)
            profile.saved_recipes.add(recipe)
            return Response({"status": "recipe saved"})
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def unsave_recipe(self, request, pk=None):
        profile = self.get_object()
        recipe_id = request.data.get('recipe_id')
        
        try:
            recipe = Recipe.objects.get(id=recipe_id)
            profile.saved_recipes.remove(recipe)
            return Response({"status": "recipe removed from saved"})
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def save_spoonacular_recipe(self, request, pk=None):
        """Save a Spoonacular recipe to user's saved recipes"""
        profile = self.get_object()
        spoonacular_id = request.data.get('spoonacular_id')
        
        if not spoonacular_id:
            return Response({"error": "No recipe ID provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Get recipe details from Spoonacular
        client = SpoonacularClient()
        recipe_data = client.get_recipe_information(spoonacular_id)
        
        if recipe_data is None:
            return Response({"error": "Failed to fetch recipe details"}, 
                           status=status.HTTP_400_BAD_REQUEST)
            
        # Create or update recipe in our database
        recipe, created = Recipe.objects.update_or_create(
            title=recipe_data.get('title'),
            defaults={
                'description': recipe_data.get('summary', ''),
                'preparation_time': recipe_data.get('readyInMinutes', 0),
                'cooking_instructions': recipe_data.get('instructions', ''),
                'image': recipe_data.get('image', '')
            }
        )
        
        # Process ingredients
        for item in recipe_data.get('extendedIngredients', []):
            ingredient, _ = Ingredient.objects.get_or_create(
                name=item.get('name', ''),
                defaults={'category': item.get('aisle', '')}
            )
            
            # Add ingredient to recipe with quantity
            recipe.ingredients.add(
                ingredient,
                through_defaults={'quantity': f"{item.get('amount', '')} {item.get('unit', '')}"}
            )
        
        # Add to user's saved recipes
        profile.saved_recipes.add(recipe)
        return Response({
            "status": "recipe saved",
            "recipe": RecipeSerializer(recipe).data
        })
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        profile = self.get_queryset().get(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

class FoodStorageTipViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FoodStorageTip.objects.all()
    serializer_class = FoodStorageTipSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'category']
    permission_classes = [AllowAny]
class CurrentUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)