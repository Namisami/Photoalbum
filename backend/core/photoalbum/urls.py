from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import PictureViewSet, AlbumViewSet, AuthorViewSet, CategoryViewSet, SubcategoryViewSet

router = DefaultRouter()
router.register(r'pictures', PictureViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubcategoryViewSet, basename='subcategory')

urlpatterns = router.urls