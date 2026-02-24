from django.contrib import admin

from .models import Rally


class RallyAdmin(admin.ModelAdmin):
    list_display = ("name", "url_slug", "email_required", "phone_required")


admin.site.register(Rally, RallyAdmin)
