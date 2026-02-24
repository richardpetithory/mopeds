import graphene
from graphene_django import DjangoObjectType

from bakers.models import (
    Race,
    RaceDay,
    RaceTeam,
    RaceTeamTime,
    Team,
    RaceTeamMembership,
)


class RaceType(DjangoObjectType):
    class Meta:
        model = Race


class RaceDayType(DjangoObjectType):
    class Meta:
        model = RaceDay


class RaceTeamType(DjangoObjectType):
    class Meta:
        model = RaceTeam


class RaceSummaryType(graphene.ObjectType):
    team_id = graphene.Int()
    team_name = graphene.String()
    total_duration_hours = graphene.String()


class RaceTeamTimeType(DjangoObjectType):
    class Meta:
        model = RaceTeamTime


class TeamType(DjangoObjectType):
    class Meta:
        model = Team


class RaceTeamMembershipType(DjangoObjectType):
    class Meta:
        model = RaceTeamMembership
