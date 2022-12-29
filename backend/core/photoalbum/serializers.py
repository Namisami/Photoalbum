from django.core.paginator import Paginator
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.serializers import HyperlinkedModelSerializer, ListSerializer, SlugRelatedField, ReadOnlyField, IntegerField, SerializerMethodField

from .pagination import StandardResultsSetPagination
from .models import Picture, Album, Author, Category, Subcategory
from authentication.serializers import UserSerializer


class AuthorSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Author
        fields = ['url', 'id', 'nickname', 'bio']

    # def to_representation(self, value):
    #     print(value)
    #     return f'{value}8'
        # return super().to_representation(instance)


class CategorySerializer(HyperlinkedModelSerializer):
    owner = UserSerializer
    class Meta:
        model = Category
        fields = ['url', 'id', 'title', 'description', 'owner']


# class SubcategoryListSerializer(ListSerializer):
#     def validate(self, data):
#         print(data)
#         return data


class SubcategorySerializer(HyperlinkedModelSerializer):
    owner = UserSerializer
    class Meta:
        model = Subcategory
        fields = '__all__'
        # depth = 0
        # list_serializer_class = SubcategoryListSerializer
    
    # def validate(self, data):
    #     print(data)
    #     return data

    # def validate_title(self, value):
    #     print(value)
    #     return value


class PictureListSerializer(HyperlinkedModelSerializer):
    # def __init__(self, request):
    #     print(request)
    # def __init__(self, *args, request_user=None, **kwargs):
    #     fields = super(PictureListSerializer, self).get_fields(*args, **kwargs)
    #     print(fields)
        # fields['subcategory'].queryset = Subcategory._default_manager.filter(category=request_user.category)
        # return fields

    # id = IntegerField(read_only=True)
    # author = AuthorSerializer()
    # category = CategorySerializer()
    # subcategory = SubcategorySerializer(many=True)
    owner = UserSerializer

    
    class Meta:
        model = Picture
        fields = ['url', 'id', 'photo_file', 'description', 'upload_date', 
                'author', 'category', 'subcategory', 'owner']
        # fields = '__all__'
        depth = 1

    # def get(self, request, format=None):
    #     print(request)

    # def update(self, instance, validated_data):
    #     print(validated_data)

    # def validate(self, data):
    #     print(data)
    #     return data

    # def validate_author(self, value):
    #     author_object = {
    #         'nickname': value['nickname'],
    #         'bio': value['bio'] if 'bio' in value.keys() else ""
    #     }
    #     return author_object

    # def validate_subcategory(self, value):
    #     print(111111111, value)
    #     return {
    #         'title': value['title']
    #     }
        # subcategories = []
        # # print(value)
        # # for subcategory in value["title"].split(','):
        # #     # print(subcategory, self.category[0])
        # #     subcategory_object = Subcategory.objects.get_or_create(title=subcategory, category=self.category)[0]
        # #     subcategories.append(subcategory_object)
        # for subcategory in value["title"].split():
        #     subcategory_object = {
        #         'title': subcategory,
        #     }
        #     subcategories.append(subcategory_object)
        # return subcategories
        # return value

    # def create(self, validated_data):
    #     print(111111111111111111)
    #     print(validated_data)
    #     author_data = validated_data.pop("author")
    #     category_data = validated_data.pop("category")
    #     if "subcategory" in validated_data.keys():
    #         subcategory_data = validated_data.pop("subcategory")

    #     author = Author.objects.get_or_create(**author_data)[0]
    #     category = Category.objects.get_or_create(**category_data)[0]

    #     picture = Picture.objects.create(**validated_data, author=author, category=category)

    #     if "subcategory" in validated_data.keys():
    #         subcategories = []
    #         for subcategory in subcategory_data:
    #             subcategory_object = Subcategory.objects.get_or_create(**subcategory, category=category)[0]
    #             subcategories.append(subcategory_object)
    #         picture.subcategory.add(subcategories)
    #     # print(picture)
    #     # print(Picture.objects.get(id=picture))
    #     return picture

    # def to_representation(self, value):
    #     print(111111111111111111111111111)
    #     print(value.author)
    #     # return Picture.objects.all()
    #     # serializer = PictureListSerializer(value)
    #     # print(serializer)
    #     return Response({
    #         'id': value,
    #         # 'url': value.url,
    #         'author': value.author,
    #         'category': value.category,
    #         'description': value.description,
    #         'subcategory': value.subcategory,
    #     })


class AlbumSerializer(HyperlinkedModelSerializer):
    # id = IntegerField(read_only=True)
    picture = SerializerMethodField('paginated_picture')
    owner = UserSerializer

    class Meta:
        model = Album
        fields = ['url', 'id', 'title', 'description', 'cover', 'created_at', 'picture', 'owner']
        # depth = 1

    def paginated_picture(self, obj):
            page_size = self.context['request'].query_params.get('size') or 9
            paginator = Paginator(obj.picture.all(), page_size)
            page = self.context['request'].query_params.get('page') or 1
            picture = paginator.page(page)

            serializer = PictureListSerializer(picture, many=True, context={'request': self.context['request']})
            count = len(obj.picture.all())
            previous = None
            if picture.has_previous():
                previous = self.context['request'].build_absolute_uri(self.context['request'].path) + '?page=' + str(picture.previous_page_number())
            next = None
            if picture.has_next():
                next = self.context['request'].build_absolute_uri(self.context['request'].path) + '?page=' + str(picture.next_page_number())
            
            return {
                'count': count,
                'next': next,
                'previous': previous,
                'results': serializer.data
                };
                

class AlbumListSerializer(HyperlinkedModelSerializer):
    owner = UserSerializer

    class Meta:
        model = Album
        fields = ['url', 'id', 'title', 'description', 'cover', 'created_at', 'owner']
