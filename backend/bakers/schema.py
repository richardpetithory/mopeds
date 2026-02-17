import graphene
from django.db.models import Sum, F
from django.db.models.fields import DurationField
from graphene_django import DjangoObjectType

from .models import Race, RaceDay, RaceTeam, RaceTeamTime, Team, TeamMembership


class RaceType(DjangoObjectType):
    class Meta:
        model = Race


class RaceDayType(DjangoObjectType):
    class Meta:
        model = RaceDay


class RaceTeamType(DjangoObjectType):
    class Meta:
        model = RaceTeam


class RaceSummary(graphene.ObjectType):
    team_name = graphene.String()
    total_duration_hours = graphene.String()


class RaceTeamTimeType(DjangoObjectType):
    duration = graphene.String()

    class Meta:
        model = RaceTeamTime


class TeamType(DjangoObjectType):
    class Meta:
        model = Team


class TeamMembershipType(DjangoObjectType):
    class Meta:
        model = TeamMembership


class Queries(graphene.ObjectType):
    race = graphene.Field(RaceType, pk=graphene.String(required=True))

    @staticmethod
    def resolve_race(_, info: graphene.ResolveInfo, pk):
        try:
            return Race.objects.get(pk=pk)
        except Race.DoesNotExist:
            return None

    races = graphene.List(
        RaceType,
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_races(_, info: graphene.ResolveInfo, offset, limit):
        return Race.objects.all()[offset : offset + limit]

    race_day = graphene.Field(RaceDayType, pk=graphene.String(required=True))

    @staticmethod
    def resolve_race_day(_, info: graphene.ResolveInfo, pk):
        try:
            return Race.objects.get(id=pk)
        except Race.DoesNotExist:
            return None

    race_days = graphene.List(
        RaceDayType,
        race_pk=graphene.String(required=True),
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_race_days(_, info: graphene.ResolveInfo, race_pk, offset, limit):
        return RaceDay.objects.filter(race_id=race_pk)[offset : offset + limit]

    race_summary = graphene.List(
        RaceSummary,
        race_pk=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_summary(_, info: graphene.ResolveInfo, race_pk):

        return (
            RaceTeamTime.objects.filter(day__race_id=race_pk)
            .values(team_name=F("race_team__team__name"))
            .annotate(
                total_duration_hours=Sum(F("duration"), output_field=DurationField())
            )
            .order_by("total_duration_hours")
        )

    race_team_time = graphene.Field(RaceTeamTimeType, pk=graphene.String(required=True))

    @staticmethod
    def resolve_race_team_time(_, info: graphene.ResolveInfo, pk):
        try:
            return RaceTeamTime.objects.get(id=pk)
        except RaceTeamTime.DoesNotExist:
            return None

    race_team_times = graphene.List(
        RaceTeamTimeType,
        race_pk=graphene.String(required=True),
        race_day=graphene.String(required=True),
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_race_team_times(
        _, info: graphene.ResolveInfo, race_pk, race_day, offset, limit
    ):
        return RaceTeamTime.objects.filter(day__race=race_pk, day__day=race_day)[
            offset : offset + limit
        ]

    team = graphene.Field(TeamType, pk=graphene.String(required=True))

    @staticmethod
    def resolve_team(_, info: graphene.ResolveInfo, pk):
        try:
            return Team.objects.get(pk=pk)
        except Team.DoesNotExist:
            return None

    teams = graphene.List(
        TeamType,
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_teams(_, info: graphene.ResolveInfo, offset, limit):
        return Team.objects.all()[offset : offset + limit]

    # race = relay.Node.Field(RaceType)
    # races = DjangoFilterConnectionField(RaceType)
    #
    # race_day = relay.Node.Field(RaceDayType)
    # race_days = DjangoFilterConnectionField(RaceDayType)
    #
    # race_team = relay.Node.Field(RaceTeamType)
    # race_teams = DjangoFilterConnectionField(RaceTeamType)
    #
    # race_team_time = relay.Node.Field(RaceTeamTimeType)
    # race_team_times = DjangoFilterConnectionField(RaceTeamTimeType)
    #
    # team = relay.Node.Field(TeamType)
    # teams = DjangoFilterConnectionField(TeamType)


# class SaveRaceMutation(graphene.Mutation):
#     class Arguments:
#         id = graphene.ID()
#         year = graphene.String(required=True)
#         name = graphene.String(required=True)
#
#     race = graphene.Field(lambda: RaceType)
#
#     @classmethod
#     def mutate(cls, root, info, **kwargs):
#         saved_race, created = Race.objects.update_or_create(
#             id=kwargs.pop("id", None), defaults=kwargs
#         )
#
#         return SaveRaceMutation(race=saved_race)


# class Mutations(graphene.ObjectType):
#     save_race = SaveRaceMutation.Field()
