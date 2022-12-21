from django.contrib import admin
from django.urls import reverse
from django.db import models
from django.utils.http import urlencode
from django.utils.html import format_html
from import_export.admin import ExportMixin

from .models import User
from .resources import UserResource
from photoalbum.models import Album


@admin.register(User)
class UserAdmin(ExportMixin, admin.ModelAdmin):
    list_display = ('photo_view', 'email_view', 'first_name', 'last_name', 'bio', 'album_view')
    search_fields = ('email', 'bio', 'first_name', 'last_name')
    resource_classes = [UserResource]

    def photo_view(self, obj):
        return format_html('<img height=40 src="{}" />', obj.photo.url)

    def email_view(self, obj):
        return format_html('<a href="{}/change">{}</a>', obj.id, obj.email)

    def album_view(self, obj):
        count = Album.objects.filter(owner=obj.id).count()

        url = (
            reverse("admin:photoalbum_album_changelist")
            + "?"
            + urlencode({"owner__id": f"{obj.id}"})
        )
        return format_html("<a href={}>{} Альбомов</a>", url, count)

    photo_view.short_description = 'Аватарка'
    email_view.short_description = 'Email'
    album_view.short_description = 'Альбомы'

# class CustomUserAdmin(UserAdmin):
#     add_form = CustomUserCreationForm
#     form = CustomUserChangeForm
#     model = User
#     list_display = ('email', 'is_staff', 'is_active',)
#     list_filter = ('email', 'is_staff', 'is_active',)
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
#         ),
#     )
#     search_fields = ('email',)
#     ordering = ('email',)

# admin.site.register(User, CustomUserAdmin)
