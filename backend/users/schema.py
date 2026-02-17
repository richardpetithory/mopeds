import graphene
import graphql_jwt
from graphene_django import DjangoObjectType

from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude_fields = ("password",)


class Queries(graphene.ObjectType):
    current_user = graphene.Field(UserType)
    user = graphene.Field(UserType, id=graphene.String(required=True))
    users = graphene.List(UserType)

    @staticmethod
    def resolve_user(_, info: graphene.ResolveInfo, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

    @staticmethod
    def resolve_users(_, info: graphene.ResolveInfo):
        return User.objects.all()

    @staticmethod
    def resolve_current_user(_, info: graphene.ResolveInfo):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None


class Mutations(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
