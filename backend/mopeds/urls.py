from django.contrib import admin
from django.urls import re_path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from .schema import schema

urlpatterns = [
    re_path(r"admin/?", admin.site.urls),
    re_path("graphql/?", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
]
