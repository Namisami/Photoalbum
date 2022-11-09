from unicodedata import category
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Picture, Album, Author, Category, Subcategory
from .serializers import PictureListSerializer, PictureDetailSerializer, PictureCreateSerializer, AlbumSerializer, AuthorSerializer, CategorySerializer, SubcategorySerializer


class PictureViewSet(ModelViewSet):
    queryset = Picture.objects.filter()
    serializer_class = PictureListSerializer
    # action_serializers = {
    #     'retrieve': PictureDetailSerializer,
    #     'create': PictureCreateSerializer,
    # }

    # def get_serializer_class(self):

    #     if hasattr(self, 'action_serializers'):
    #         return self.action_serializers.get(self.action, self.serializer_class)

    #     return super(PictureViewSet, self).get_serializer_class()

    # def get_queryset(self):
    #     print('============================')
    #     print(self.request.data)
    #     # category = self.request.category
    #     # subcategory = Subcategory.objects.filter(category=category)
    #     # return Picture.objects.filter(subcategory=subcategory)


class AlbumViewSet(ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubcategoryViewSet(ModelViewSet):
    queryset = Subcategory.objects.all()
    # queryset = Subcategory.objects.filter(category=None)
    serializer_class = SubcategorySerializer
