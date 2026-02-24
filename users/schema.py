import graphene
import graphql_jwt
from graphene_django import DjangoObjectType

from bakers.models import RaceTeamMembership
from bakers.schema.types import RaceTeamMembershipType
from .models import Rider


class RiderType(DjangoObjectType):
    class Meta:
        model = Rider
        exclude_fields = ("password",)


class Queries(graphene.ObjectType):
    rider = graphene.Field(RiderType, id=graphene.String(required=True))

    @staticmethod
    def resolve_rider(_, info: graphene.ResolveInfo, id):
        try:
            return Rider.objects.get(id=id)
        except Rider.DoesNotExist:
            return None

    riders = graphene.List(
        RiderType,
        name_search=graphene.String(),
        exclude_ids=graphene.List(graphene.String),
    )

    @staticmethod
    def resolve_riders(
        _, info: graphene.ResolveInfo, name_search=None, exclude_ids=None
    ):
        riders = Rider.objects.all()

        if exclude_ids:
            riders = riders.exclude(id__in=exclude_ids)

        if name_search is not None:
            riders = riders.filter(name__icontains=name_search).order_by("name")[:10]

        return riders

    current_rider = graphene.Field(RiderType)

    @staticmethod
    def resolve_current_rider(_, info: graphene.ResolveInfo):
        rider = info.context.user
        if rider.is_authenticated:
            return rider
        return None

    #
    # rider = graphene.Field(RiderType, id=graphene.String(required=True))
    #
    # @staticmethod
    # def resolve_rider(_, info: graphene.ResolveInfo, id):
    #     try:
    #         return Rider.objects.filter(memberships__isnull=False).distinct().get(id=id)
    #     except Rider.DoesNotExist:
    #         return None
    #
    # riders = graphene.List(RiderType)
    #
    # @staticmethod
    # def resolve_riders(_, info: graphene.ResolveInfo):
    #     return Rider.objects.filter(memberships__isnull=False).distinct()

    team_members = graphene.List(
        RaceTeamMembershipType,
        team_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_team_members(_, info: graphene.ResolveInfo, team_id):
        return RaceTeamMembership.objects.filter(team_id=team_id).distinct()


class Mutations(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
