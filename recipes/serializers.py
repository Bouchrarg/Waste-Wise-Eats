from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient, UserProfile, FoodStorageTip

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'category']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.ReadOnlyField(source='ingredient.name')
    
    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient', 'ingredient_name', 'quantity']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(source='recipeingredient_set', many=True, read_only=True)
    
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'ingredients', 'preparation_time', 
                  'cooking_instructions', 'image', 'views']

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    saved_recipes = RecipeSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'saved_recipes']

class FoodStorageTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodStorageTip
        fields = ['id', 'title', 'description', 'category']