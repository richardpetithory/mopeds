import graphene
from graphene import relay
from graphene_django import DjangoObjectType

from .models import Race, RaceDay, RaceTeam, RaceTeamTime, Team, TeamMembership


class RaceType(DjangoObjectType):
    class Meta:
        model = Race


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

    logo = graphene.String()

    def resolve_logo(self, info):
        if self.logo:
            return info.context.build_absolute_uri(self.logo.url)
        return None


class TeamMembershipType(DjangoObjectType):
    class Meta:
        model = TeamMembership
        filter_fields = []
        interfaces = (relay.Node,)


class Queries(graphene.ObjectType):
    race = graphene.Field(RaceType, pk=graphene.String(required=True))
    races = graphene.List(
        RaceType,
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_race(_, info: graphene.ResolveInfo, pk):
        try:
            return Race.objects.get(pk=pk)
        except Race.DoesNotExist:
            return None

    @staticmethod
    def resolve_races(_, info: graphene.ResolveInfo, offset, limit):
        return Race.objects.all()[offset : offset + limit]

    race_day = graphene.Field(RaceDayType, pk=graphene.String(required=True))
    race_days = graphene.List(
        RaceDayType,
        race_pk=graphene.String(required=True),
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_race_day(_, info: graphene.ResolveInfo, pk):
        try:
            return Race.objects.get(id=pk)
        except Race.DoesNotExist:
            return None

    @staticmethod
    def resolve_race_days(_, info: graphene.ResolveInfo, race_pk, offset, limit):
        return RaceDay.objects.filter(race_id=race_pk)[offset : offset + limit]

    race_team_time = graphene.Field(RaceTeamTimeType, pk=graphene.String(required=True))
    race_team_times = graphene.List(
        RaceTeamTimeType,
        race_pk=graphene.String(required=True),
        race_day=graphene.String(required=True),
        offset=graphene.Int(0),
        limit=graphene.Int(10),
    )

    @staticmethod
    def resolve_race_team_time(_, info: graphene.ResolveInfo, pk):
        try:
            return RaceTeamTime.objects.get(id=pk)
        except RaceTeamTime.DoesNotExist:
            return None

    @staticmethod
    def resolve_race_team_times(
        _, info: graphene.ResolveInfo, race_pk, race_day, offset, limit
    ):
        return RaceTeamTime.objects.filter(day__race=race_pk, day__day=race_day)[
            offset : offset + limit
        ]

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
