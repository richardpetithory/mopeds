from django.contrib import admin

from .models import Layout


class LayoutAdmin(admin.ModelAdmin):
    list_display = ['id', 'slug', 'homepage']


admin.site.register(Layout, LayoutAdmin)
