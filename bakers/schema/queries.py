import graphene

from bakers.models import (
    Race,
    RaceDay,
    RaceTeamTime,
    Team,
    RaceTeam,
    RaceTeamMembership,
)
from bakers.schema.types import (
    RaceDayType,
    RaceSummaryType,
    RaceType,
    RaceTeamTimeType,
    TeamType,
    RaceTeamType,
    RaceTeamMembershipType,
)


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
    )

    @staticmethod
    def resolve_races(_, info: graphene.ResolveInfo):
        return Race.objects.all().order_by("-year")

    race_day = graphene.Field(
        RaceDayType,
        id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_day(_, info: graphene.ResolveInfo, id):
        try:
            return RaceDay.objects.get(id=id)
        except RaceDay.DoesNotExist:
            return None

    race_days = graphene.List(
        RaceDayType,
        race_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_days(_, info: graphene.ResolveInfo, race_id):
        return RaceDay.objects.filter(race_id=race_id)

    race_summary = graphene.List(
        RaceSummaryType,
        race_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_summary(_, info: graphene.ResolveInfo, race_id):
        return RaceTeamTime.objects.all()

        # return (
        #     RaceTeamTime.objects.filter(day__race_id=race_id)
        #     .values(
        #         team_id=F("race_team__team__id"), team_name=F("race_team__team__name")
        #     )
        #     .annotate(
        #         total_duration_hours=Sum(F("duration"), output_field=DurationField())
        #     )
        #     .order_by("total_duration_hours")
        # )

    race_team_time = graphene.Field(
        RaceTeamTimeType,
        race_id=graphene.String(required=True),
        day_id=graphene.String(required=True),
        race_team_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_team_time(
        _, info: graphene.ResolveInfo, race_id, day_id, race_team_id
    ):
        try:
            return RaceTeamTime.objects.get(
                race_id=race_id, day_id=day_id, race_team_id=race_team_id
            )
        except RaceTeamTime.DoesNotExist:
            return None

    race_team_times = graphene.List(
        RaceTeamTimeType,
        race_id=graphene.String(required=True),
        day_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_team_times(_, info: graphene.ResolveInfo, race_id, day_id):
        return RaceTeamTime.objects.filter(day__race_id=race_id, day__id=day_id)

    team = graphene.Field(TeamType, id=graphene.String(required=True))

    @staticmethod
    def resolve_team(_, info: graphene.ResolveInfo, id):
        try:
            return Team.objects.get(id=id)
        except Team.DoesNotExist:
            return None

    teams = graphene.List(
        TeamType,
    )

    @staticmethod
    def resolve_teams(_, info: graphene.ResolveInfo):
        return Team.objects.all()

    team_races = graphene.List(
        RaceTeamType,
        team_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_team_races(_, info: graphene.ResolveInfo, team_id):
        return RaceTeam.objects.filter(team=team_id)

    race_team_memberships = graphene.List(
        RaceTeamMembershipType,
        team_id=graphene.String(required=True),
        invited=graphene.Boolean(),
    )

    @staticmethod
    def resolve_race_team_memberships(
        _, info: graphene.ResolveInfo, team_id, invited=False
    ):
        memberships = RaceTeamMembership.objects.filter(team_id=team_id).order_by(
            "-race__year", "member__name"
        )

        if invited:
            memberships = memberships.filter(status=True)

        return memberships

    race_teams_without_times = graphene.List(
        RaceTeamType,
        race_id=graphene.String(required=True),
        day_id=graphene.String(required=True),
    )

    @staticmethod
    def resolve_race_teams_without_times(
        _, info: graphene.ResolveInfo, race_id, day_id
    ):
        existing_team_ids = RaceTeamTime.objects.filter(
            day__race_id=race_id, day_id=day_id
        ).values_list("race_team__team_id", flat=True)

        return RaceTeam.objects.exclude(team_id__in=existing_team_ids).order_by(
            "team__name"
        )
