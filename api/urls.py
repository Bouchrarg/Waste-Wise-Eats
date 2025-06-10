from django.urls import path, include
from rest_framework.routers import DefaultRouter
from recipes.views import (
    RecipeViewSet, IngredientViewSet, 
    UserProfileViewSet, FoodStorageTipViewSet
)

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'ingredients', IngredientViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'storage-tips', FoodStorageTipViewSet)

urlpatterns = [
    path('', include(router.urls)),
]