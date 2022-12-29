from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from django.core import serializers
from django.db.models import Q, Count, Sum
from django.shortcuts import get_object_or_404
from django.utils.datastructures import MultiValueDictKeyError
from copy import copy

from rest_framework_simplejwt.tokens import AccessToken


from .models import Picture, Album, Author, Category, Subcategory
from .serializers import PictureListSerializer, AlbumSerializer, AuthorSerializer, CategorySerializer, SubcategorySerializer, AlbumListSerializer
from .pagination import StandardResultsSetPagination
from authentication.models import User

class PictureViewSet(ModelViewSet):
    parser_classes = (MultiPartParser, FormParser, FileUploadParser)
    queryset = Picture.objects.all()
    serializer_class = PictureListSerializer
    permission_classes = (IsAuthenticated,)
    search_fields = ['description']
    filter_backends = (SearchFilter,)
    # depth = 2
    # pagination_class = StandardResultsSetPagination

    def list(self, request):
        user = User.objects.get(id=request.user.id)
        queryset = Picture.objects.filter(owner=user).order_by('id')
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


    def retrieve(self, request, pk=None):
        user = User.objects.get(id=request.user.id)
        queryset = Picture.objects.all()
        picture = get_object_or_404(queryset, pk=pk, owner=user)
        serializer = PictureListSerializer(picture, context={'request': request})
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
        return Response(serialized)

    def partial_update(self, request, pk=None):
        user = User.objects.get(id=request.user.id)
        print(request.data)
        instance = Picture.objects.get(id=pk, owner=request.user.id)
        instance.description = request.data.get('description', instance.description)
        if request.data.get('author', ''):
            if request.data["author"] == 'undefined':
                instance.author = None
            else:
                author = Author.objects.get_or_create(nickname=request.data["author"])[0]
                instance.author = author
        if request.data.get('category', ''):
            if request.data["category"] == 'undefined':
                instance.category = None
            else:
                category = Category.objects.get_or_create(title=request.data['category'], owner=user)[0]
                instance.category = category
        if request.data.get('subcategory', ''):
            instance.subcategory.clear()
            for subcategory_name in request.data["subcategory"].split(','):
                subcategory = Subcategory.objects.get_or_create(title=subcategory_name, category=instance.category, owner=user)[0]
                instance.subcategory.add(subcategory)
        instance.save()

        serializer = PictureListSerializer(instance, context={'request': request})
        return Response(serializer.data)  

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
    search_fields = ['title', 'description']
    filter_backends = (SearchFilter,)

    @action(detail=False, methods=['GET'])
    def filled_albums(self, request):
        user = User.objects.get(id=request.user.id)
        filled = Album.objects.filter(Q(owner=user) & Q(picture__isnull=False)).distinct()
        queryset = self.filter_queryset(filled)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = AlbumListSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    def list(self, request):
        user = User.objects.get(id=request.user.id)
        queryset = Album.objects.filter(owner=user)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = AlbumListSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        user = User.objects.get(id=request.user.id)
        queryset = Album.objects.all()
        album = get_object_or_404(queryset, pk=pk, owner=user)
        serializer = AlbumSerializer(album, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        user = User.objects.get(id=request.user.id)
        cover = request.data.get("cover")
        if cover:
            album = Album.objects.create(
                title=request.data.get("title"),
                description=request.data.get("description"),
                cover=request.data.get("cover"),
                owner=user,
            )
        else:
            album = Album.objects.create(
                title=request.data.get("title"),
                description=request.data.get("description"),
                owner=user,
            )
        serializer = AlbumSerializer(album, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def add_images(self, request, pk=None):
        user = User.objects.get(id=request.user.id)

        request_data = request.data
        request_data["subcategory"] = request_data.getlist("subcategory")

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

        instance = Album.objects.get(pk=pk)
        instance.picture.add(picture)
        instance.save()

        serializer = AlbumSerializer(instance, context={'request': request})
        return Response(serializer.data)  
        print(pk)
        print(request.data)


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
