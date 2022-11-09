from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer

from .models import Picture, Album, Author, Category, Subcategory


class PictureListSerializer(HyperlinkedModelSerializer):
    # def __init__(self, *args, request_user=None, **kwargs):
    #     fields = super(PictureListSerializer, self).get_fields(*args, **kwargs)
    #     fields['subcategory'].queryset = Subcategory._default_manager.filter(category=request_user.category)
    #     return fields
    id = serializers.ReadOnlyField()

    class Meta:
        model = Picture
        fields = '__all__'


class PictureCreateSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Picture
        exclude = ['subcategory']


class PictureDetailSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Picture
        fields = '__all__'


class AlbumSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'


class AuthorSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


class CategorySerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SubcategorySerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Subcategory
        fields = '__all__'
