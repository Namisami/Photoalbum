from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from photoalbum.urls import router as photo_router
from authentication.urls import router as auth_router

router = DefaultRouter()

router.registry.extend(photo_router.registry)
router.registry.extend(auth_router.registry)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
