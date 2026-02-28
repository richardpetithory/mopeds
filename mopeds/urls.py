from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import re_path
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView

from . import views
from .schema import schema

urlpatterns = [
    re_path(r"admin/?", admin.site.urls),
    re_path(
        "graphql/?",
        csrf_exempt(
            FileUploadGraphQLView.as_view(graphiql=settings.DEBUG, schema=schema)
        ),
    ),
    re_path(r"^.*$", views.index),
]

urlpatterns += static("media/", document_root=settings.MEDIA_ROOT)
