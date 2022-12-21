from django.contrib import admin
from django.urls import reverse
from django.db import models
from django.utils.http import urlencode
from django.utils.html import format_html

from import_export.admin import ExportMixin
from simple_history.admin import SimpleHistoryAdmin

from .models import Album, Author, Picture, Category, Subcategory
from .resources import AlbumResource, AuthorResource, PictureResource, CategoryResource, SubcategoryResource
from .history import HistoryChanges


def custom_titled_filter(title):
    class Wrapper(admin.FieldListFilter):
        def __new__(cls, *args, **kwargs):
            instance = admin.FieldListFilter.create(*args, **kwargs)
            instance.title = title
            return instance
    return Wrapper


@admin.register(Album)
class AlbumAdmin(ExportMixin, SimpleHistoryAdmin, HistoryChanges):
    list_display = ('title', 'cover_view', 'picture_view', 'owner_view')
    # ordering = ('picture',)
    list_filter = ('owner',)
    search_fields = ("title", )
    resource_classes = [AlbumResource]

    def cover_view(self, obj):
        return format_html('<img height=40 src="{}" />', obj.cover.url)
    
    def picture_view(self, obj):
        count = obj.picture.count()
        url = (
            reverse("admin:photoalbum_picture_changelist")
            + "?"
            + urlencode({"album__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">{} Изображения</a>', url, count)

    def owner_view(self, obj):
        url = (
            reverse("admin:authentication_user_changelist")
            + f"{obj.owner.id}"
        )
        return format_html('<a href="{}">{}</a>', url, obj.owner.email)

    picture_view.short_description = "Изображения"
    cover_view.short_description = 'Обложка'
    cover_view.allow_tags = True
    owner_view.short_description = 'Владелец'

@admin.register(Author)
class AuthorAdmin(ExportMixin, SimpleHistoryAdmin, HistoryChanges):
    list_display = ('nickname', 'bio_view', 'picture_view')
    search_fields = ('nickname',)
    resource_classes = [AuthorResource]

    def picture_view(self, obj):
        count = Picture.objects.filter(author=obj.id).count()

        url = (
            reverse("admin:photoalbum_picture_changelist")
            + "?"
            + urlencode({"author__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">{} Изображения</a>', url, count)

    def bio_view(self, obj):
        url = (
            reverse("admin:photoalbum_author_change", args=(obj.id,))
        )
        if obj.bio:
            return format_html("<a href={}>{}</a>", url, obj.bio)
        else:
            return format_html("<a href={}>Нет описания</a>", url)

    bio_view.short_description = "О авторе"
    picture_view.short_description = "Изображения"

@admin.register(Picture)
class PictureAdmin(ExportMixin, SimpleHistoryAdmin, HistoryChanges):
    list_display = ('photo_view', 'description_view', 'author_view', 'category_view', 'owner_view')
    list_filter = (
        'owner', 
        ('category__title', custom_titled_filter('Категория')),
        ('author__nickname', custom_titled_filter('Автор'))
    )
    search_fields = ("description", "category__title", 'author__nickname', 'subcategory__title')
    resource_classes = [PictureResource]

    def photo_view(self, obj):
        url = (
            reverse("admin:photoalbum_picture_change", args=(obj.id,))
        )
        return format_html('<a href={}><img height=40 src="{}" /></a>', url, obj.photo_file.url)

    def author_view(self, obj):
        if obj.author:
            url = (
                reverse("admin:photoalbum_author_change", args=(obj.author.id,))
            )
            return format_html("<a href={}>{}</a>", url, obj.author.nickname)
        else:
            return format_html("Нет автора")

    def description_view(self, obj):
        description = obj.description if obj.description else "Нет описания"

        url = (
            reverse("admin:photoalbum_picture_change", args=(obj.id,))
        )
        return format_html('<a href={}>{}</a>', url, description)

    def category_view(self, obj):
        if obj.category:
            url = (
                reverse("admin:photoalbum_category_change", args=(obj.category.id,))
            )
            return format_html('<a href="{}">{}</a>', url, obj.category.title)
        else:
            return format_html('Нет категории')

    def owner_view(self, obj):
        url = (
            reverse("admin:authentication_user_changelist")
            + f"{obj.owner.id}"
        )
        return format_html('<a href="{}">{}</a>', url, obj.owner.email)
    
    photo_view.short_description = 'Изображение'
    description_view.short_description = 'Описание'
    author_view.short_description = 'Автор'
    category_view.short_description = 'Категория'
    owner_view.short_description = 'Владелец'

@admin.register(Category)
class CategoryAdmin(ExportMixin, SimpleHistoryAdmin, HistoryChanges):
    list_display = ("title", "description_view", 'picture_view', 'subcategory_view', "owner_view")
    list_filter = ("owner",)
    search_fields = ("title", "description")
    resource_classes = [CategoryResource]

    def description_view(self, obj):
        description = obj.description if obj.description else "Нет описания"

        url = (
            reverse("admin:photoalbum_category_change", args=(obj.id,))
        )
        return format_html('<a href={}>{}</a>', url, description)

    def picture_view(self, obj):
        count = Picture.objects.filter(category=obj.id).count()

        url = (
            reverse("admin:photoalbum_picture_changelist")
            + "?"
            + urlencode({"category__id": f"{obj.id}"})
        )
        return format_html('<a href={}>{} Изображения</a>', url, count)

    def subcategory_view(self, obj):
        count = Subcategory.objects.filter(category=obj.id).count()

        url = (
            reverse("admin:photoalbum_subcategory_changelist")
            + "?"
            + urlencode({"category__id": f"{obj.id}"})
        )
        return format_html('<a href={}>{} Подкатегории</a>', url, count)

    def owner_view(self, obj):
        url = (
            reverse("admin:authentication_user_changelist")
            + f"{obj.owner.id}"
        )
        return format_html('<a href="{}">{}</a>', url, obj.owner.email)

    description_view.short_description = "Описание"
    picture_view.short_description = "Изображения"
    subcategory_view.short_description = "Подкатегории"
    owner_view.short_description = "Владелец"

@admin.register(Subcategory)
class SubcategoryAdmin(ExportMixin, SimpleHistoryAdmin, HistoryChanges):
    list_display = ('title', 'description_view', 'category_view', 'owner_view')
    list_filter = (
        ('category__title', custom_titled_filter('Категория')),
        'owner'
    )
    search_fields = ('title', 'description', 'category_view')
    resource_classes = [SubcategoryResource]

    def description_view(self, obj):
        description = obj.description if obj.description else "Нет описания"

        url = (
            reverse("admin:photoalbum_category_change", args=(obj.id,))
        )
        return format_html('<a href={}>{}</a>', url, description)

    def category_view(self, obj):
        if obj.category:
            url = (
                reverse("admin:photoalbum_category_change", args=(obj.category.id,))
            )
            return format_html('<a href="{}">{}</a>', url, obj.category.title)
        else:
            return format_html('Нет категории')

    def owner_view(self, obj):
        url = (
            reverse("admin:authentication_user_changelist")
            + f"{obj.owner.id}"
        )
        return format_html('<a href="{}">{}</a>', url, obj.owner.email)

    description_view.short_description = 'Описание'
    category_view.short_description = 'Категория'
    owner_view.short_description = 'Владелец'
