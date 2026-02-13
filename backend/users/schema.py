import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = []
        exclude_fields = ("password",)
        interfaces = (relay.Node,)


class Queries(graphene.ObjectType):
    me = graphene.Field(UserType)
    user = relay.Node.Field(UserType)
    users = DjangoFilterConnectionField(UserType)

    @staticmethod
    def resolve_me(_, info):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None
