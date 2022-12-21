from .models import Album, Author, Picture, Category, Subcategory
from import_export import resources

class PictureResource(resources.ModelResource):
    
    class Meta:
        model = Picture


class AlbumResource(resources.ModelResource):
    
    class Meta:
        model = Album


class AuthorResource(resources.ModelResource):
    
    class Meta:
        model = Author


class CategoryResource(resources.ModelResource):
    
    class Meta:
        model = Category


class SubcategoryResource(resources.ModelResource):
    
    class Meta:
        model = Subcategory