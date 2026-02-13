import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import Race, RaceDay, RaceTeam, RaceTeamTime, Team, TeamMembership


class RaceType(DjangoObjectType):
    class Meta:
        model = Race
        filter_fields = []
        interfaces = (relay.Node,)


class RaceDayType(DjangoObjectType):
    class Meta:
        model = RaceDay
        filter_fields = []
        interfaces = (relay.Node,)


class RaceTeamType(DjangoObjectType):
    class Meta:
        model = RaceTeam
        filter_fields = ("race", "team")
        interfaces = (relay.Node,)


class RaceTeamTimeType(DjangoObjectType):
    class Meta:
        model = RaceTeamTime
        filter_fields = []
        interfaces = (relay.Node,)


class TeamType(DjangoObjectType):
    class Meta:
        model = Team
        filter_fields = []
        interfaces = (relay.Node,)

    logo_url = graphene.String()

    def resolve_logo_url(self, info):
        if self.logo:
            return info.context.build_absolute_uri(self.logo.url)
        return None


class TeamMembershipType(DjangoObjectType):
    class Meta:
        model = TeamMembership
        filter_fields = []
        interfaces = (relay.Node,)


class Queries(graphene.ObjectType):
    race = relay.Node.Field(RaceType)
    races = DjangoFilterConnectionField(RaceType)

    race_day = relay.Node.Field(RaceDayType)
    race_days = DjangoFilterConnectionField(RaceDayType)


class SaveRaceMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        year = graphene.String(required=True)
        name = graphene.String(required=True)

    race = graphene.Field(lambda: RaceType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        saved_race, created = Race.objects.update_or_create(
            id=kwargs.pop("id", None), defaults=kwargs
        )

        return SaveRaceMutation(race=saved_race)


class Mutations(graphene.ObjectType):
    save_race = SaveRaceMutation.Field()
