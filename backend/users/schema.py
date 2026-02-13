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
    user = relay.Node.Field(UserType)
    users = DjangoFilterConnectionField(UserType)
