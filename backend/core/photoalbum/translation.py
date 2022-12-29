from modeltranslation.translator import register, TranslationOptions
from .models import Author, Picture, Album, Category, Subcategory


@register(Author)
class AuthorTranslationOptions(TranslationOptions):
    fields = ('bio',)


@register(Picture)
class PictureTranslationOptions(TranslationOptions):
    fields = ('description',)


@register(Album)
class AlbumTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(Subcategory)
class SubcategoryTranslationOptions(TranslationOptions):
    fields = ('title', 'description')
