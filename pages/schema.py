import graphene
from graphene_django import DjangoObjectType

from .models import Layout


class LayoutType(DjangoObjectType):
    class Meta:
        model = Layout
        fields = ("id", "slug")


class Query(graphene.ObjectType):
    get_layouts = graphene.List(LayoutType, name="layouts")

    @staticmethod
    def resolve_get_layouts(root: None, info: graphene.ResolveInfo):
        return Layout.objects.all()

    get_layout = graphene.Field(LayoutType, name="layout", slug=graphene.String(required=True))

    @staticmethod
    def resolve_get_layout(root: None, info: graphene.ResolveInfo, slug: str):
        try:
            return Layout.objects.get(slug=slug)
        except Layout.DoesNotExist:
            return None
