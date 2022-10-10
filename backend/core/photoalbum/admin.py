from django.contrib import admin
from .models import Album, Author, Picture, Category, Subcategory


admin.site.register(Album)
admin.site.register(Author)
admin.site.register(Picture)
admin.site.register(Category)
admin.site.register(Subcategory)
