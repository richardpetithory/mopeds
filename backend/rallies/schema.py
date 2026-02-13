import graphene
from graphene_django import DjangoObjectType

from .models import Rally


class RallyType(DjangoObjectType):
    class Meta:
        model = Rally
        fields = ("id", "name", "url_slug", "email_required", "phone_required")


class Query(graphene.ObjectType):
    get_rallies = graphene.List(RallyType, name="rallies")

    @staticmethod
    def resolve_get_rallies(root: None, info: graphene.ResolveInfo):
        return Rally.objects.all()

    get_rally = graphene.Field(RallyType, name="rally", id=graphene.String(required=True))

    @staticmethod
    def resolve_get_rally(root: None, info: graphene.ResolveInfo, id: str):
        try:
            return Rally.objects.get(id=id)
        except Rally.DoesNotExist:
            return None
