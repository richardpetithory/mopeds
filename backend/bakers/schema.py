import graphene
from django.db import IntegrityError
from django.db.models import Sum, F
from django.db.models.fields import DurationField
from graphene_django import DjangoObjectType
from graphql import GraphQLError

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
    team_id = graphene.Int()
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
    race = graphene.Field(RaceType, id=graphene.String(required=True))

    @staticmethod
    def resolve_race(_, info: graphene.ResolveInfo, id):
        try:
            return Race.objects.get(id=id)
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

    race_day = graphene.Field(RaceDayType, id=graphene.String(required=True))

    @staticmethod
    def resolve_race_day(_, info: graphene.ResolveInfo, id):
        try:
            return Race.objects.get(id=id)
        except Race.DoesNotExist:
            return None

    race_days = graphene.List(
        RaceDayType,
        race_id=graphene.String(required=True),
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_race_days(_, info: graphene.ResolveInfo, race_id, offset, limit):
        return RaceDay.objects.filter(race_id=race_id)[offset : offset + limit]

    race_summary = graphene.List(
        RaceSummary,
        race_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_summary(_, info: graphene.ResolveInfo, race_id):
        return (
            RaceTeamTime.objects.filter(day__race_id=race_id)
            .values(
                team_id=F("race_team__team__id"), team_name=F("race_team__team__name")
            )
            .annotate(
                total_duration_hours=Sum(F("duration"), output_field=DurationField())
            )
            .order_by("total_duration_hours")
        )

    race_team_time = graphene.Field(RaceTeamTimeType, id=graphene.String(required=True))

    @staticmethod
    def resolve_race_team_time(_, info: graphene.ResolveInfo, id):
        try:
            return RaceTeamTime.objects.get(id=id)
        except RaceTeamTime.DoesNotExist:
            return None

    race_team_times = graphene.List(
        RaceTeamTimeType,
        race_id=graphene.String(required=True),
        race_day=graphene.String(required=True),
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_race_team_times(
        _, info: graphene.ResolveInfo, race_id, race_day, offset, limit
    ):
        return RaceTeamTime.objects.filter(day__race=race_id, day__day=race_day)[
            offset : offset + limit
        ]

    team = graphene.Field(TeamType, id=graphene.String(required=True))

    @staticmethod
    def resolve_team(_, info: graphene.ResolveInfo, id):
        try:
            return Team.objects.get(id=id)
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

    team_races = graphene.List(
        RaceTeamType,
        team_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_team_races(_, info: graphene.ResolveInfo, team_id):
        return RaceTeam.objects.filter(team=team_id)


class SaveRaceMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String()
        year = graphene.String(required=True)
        name = graphene.String(required=True)

    race = graphene.Field(lambda: RaceType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user

        if not user.is_staff:
            raise GraphQLError("Only staff may perform this action.")

        id = kwargs.pop("id", None)
        year = kwargs.get("year")

        try:
            saved_race, created = Race.objects.update_or_create(id=id, defaults=kwargs)

            return SaveRaceMutation(race=saved_race)
        except IntegrityError:
            raise GraphQLError(f"A race already exists for {year}")
        except Exception as e:
            raise GraphQLError(str(e))


class Mutations(graphene.ObjectType):
    save_race = SaveRaceMutation.Field()
