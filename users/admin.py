from django.contrib import admin

from .models import Rider


class RiderAdmin(admin.ModelAdmin):
    pass


admin.site.register(Rider, RiderAdmin)
