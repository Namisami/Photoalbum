from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from django.core import serializers
from django.shortcuts import get_object_or_404

from rest_framework_simplejwt.tokens import AccessToken


from .models import Picture, Album, Author, Category, Subcategory
from .serializers import PictureListSerializer, PictureDetailSerializer, PictureCreateSerializer, AlbumSerializer, AuthorSerializer, CategorySerializer, SubcategorySerializer
from .pagination import StandardResultsSetPagination
from authentication.models import User

class PictureViewSet(ModelViewSet):
    parser_classes = (MultiPartParser, FormParser, FileUploadParser)
    queryset = Picture.objects.all()
    serializer_class = PictureListSerializer
    permission_classes = (IsAuthenticated,)
    search_fields = ['description']
    filter_backends = (SearchFilter,)
    # pagination_class = StandardResultsSetPagination

    def list(self, request):
        user = User.objects.get(id=request.user.id)
        queryset = Picture.objects.filter(owner=user)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


    def retrieve(self, request, pk=None):
        user = User.objects.get(id=request.user.id)
        queryset = Picture.objects.all()
        album = get_object_or_404(queryset, pk=pk, owner=user)
        serializer = PictureListSerializer(album, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        request_data = request.data
        request_data["subcategory"] = request_data.getlist("subcategory")
        # request_data.pop("subcategory")
        # serializer = self.get_serializer(data=request_data)
        # print("============================")
        # print(serializer.is_valid())
        # print(serializer.errors)
        # print(serializer.initial_data)
        # print("============================")
        # if serializer.is_valid():
        #     print(serializer.validated_data)
        #     serializer.save()
        #     return Response(serializer.data)
        # return Response({
        #     "error": "invalid data",
        # });
        # authr_nickname = 0 | request_data["author.nickname"]
        # print(authr_nickname)
        # user = User.objects.get(id=request.user)
        user = User.objects.get(id=request.user.id)
        author = Author.objects.get_or_create(
            nickname=request_data["author.nickname"]
        )[0]
        category = Category.objects.get_or_create(
            title=request_data["category.title"],
            owner=user,
        )[0]
        subcategories = []
        for subcategory in request_data["subcategory"]:
            subcategory = Subcategory.objects.get_or_create(
                title=subcategory,
                category=category,
                owner=user,
            )[0]
            subcategories.append(subcategory.id)
        picture = Picture.objects.create(
            photo_file=request_data["photo_file"],
            description=request_data["description"],
            author=author,
            category=category,
            owner=user,
        )
        for subcategory in subcategories:
            picture.subcategory.add(subcategory)
        serialized = serializers.serialize('json', [picture, ])
        # serializer = self.get_serializer(data=picture)
        # print(serializer.is_valid())
        return Response(serialized)
        return Response({
            "error": "invalid data",
        });

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
    permission_classes = (IsAuthenticated,)
    search_fields = ['title']
    filter_backends = (SearchFilter,)

    def list(self, request):
        user = User.objects.get(id=request.user.id)
        queryset = Album.objects.filter(owner=user)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        user = User.objects.get(id=request.user.id)
        queryset = Album.objects.all()
        album = get_object_or_404(queryset, pk=pk, owner=user)
        serializer = AlbumSerializer(album, context={'request': request})
        return Response(serializer.data)


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
