from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from recipes.views import CurrentUserProfileView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/profiles/me/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('api/', include('api.urls')),
    path('auth/', include('users.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)