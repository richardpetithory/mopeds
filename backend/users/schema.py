import graphene
from graphene_django import DjangoObjectType

from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "name", "email", "is_staff", "is_active", "date_joined")


class Query(graphene.ObjectType):
    get_me = graphene.Field(UserType, name="me")

    @staticmethod
    def resolve_get_me(root: None, info: graphene.ResolveInfo):
        try:
            return User.objects.get(id=info.context.user.id)
        except User.DoesNotExist:
            return None

    get_users = graphene.List(UserType, name="users")

    @staticmethod
    def resolve_get_users(root: None, info: graphene.ResolveInfo):
        return User.objects.all()

    get_user = graphene.Field(UserType, name="user", id=graphene.String(required=True))

    @staticmethod
    def resolve_get_layout(root: None, info: graphene.ResolveInfo, id: str):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None
