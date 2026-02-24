import graphene
from django.shortcuts import get_object_or_404
from graphql import GraphQLError

from bakers.models import Team, RaceTeamMembership, RaceTeam
from bakers.schema.types import TeamType, RaceTeamMembershipType, RaceTeamType
from users.models import Rider


class SaveTeamMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String()
        name = graphene.String(required=True)
        description = graphene.String()
        manager_id = graphene.String()

    team = graphene.Field(lambda: TeamType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        rider = info.context.user

        team_id = kwargs.pop("id", None)
        manager_id = kwargs.pop("manager_id", None)

        if manager_id:
            rider = Rider.objects.get(id=manager_id)

        if team_id:
            team = get_object_or_404(Team, id=team_id)

            if team.manager != info.context.user and not info.context.user.is_staff:
                raise GraphQLError(
                    "Only the team manager or staff may perform this action."
                )

        try:

            saved_team, created = Team.objects.update_or_create(
                id=team_id, defaults=kwargs | {"manager": rider}
            )

            return SaveTeamMutation(team=saved_team)
        except Exception as e:
            raise GraphQLError(str(e))


class RaceTeamMembershipInvitationMutation(graphene.Mutation):
    class Arguments:
        team_id = graphene.String(required=True)
        member_id = graphene.String(required=True)
        race_id = graphene.String(required=True)

    race_team_membership = graphene.Field(lambda: RaceTeamMembershipType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        team_id = kwargs.pop("team_id", None)
        race_id = kwargs.pop("race_id", None)
        member_id = kwargs.pop("member_id", None)

        team = Team.objects.get(id=team_id)

        if team.manager != info.context.user and not info.context.user.is_staff:
            raise GraphQLError(
                "Only the team manager or staff may perform this action."
            )

        saved_race_team_membership, _ = RaceTeamMembership.objects.update_or_create(
            team_id=team_id,
            race_id=race_id,
            member_id=member_id,
            defaults={"invited": True},
        )

        return RaceTeamMembershipInvitationMutation(
            race_team_membership=saved_race_team_membership
        )


class TeamRaceMutation(graphene.Mutation):
    class Arguments:
        team_id = graphene.String(required=True)
        race_id = graphene.String(required=True)

    team_race = graphene.Field(lambda: RaceTeamType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        team_id = kwargs.pop("team_id", None)
        race_id = kwargs.pop("race_id", None)

        team = Team.objects.get(id=team_id)

        if team.manager != info.context.user and not info.context.user.is_staff:
            raise GraphQLError(
                "Only the team manager or staff may perform this action."
            )

        saved_team_race, _ = RaceTeam.objects.update_or_create(
            team_id=team_id,
            race_id=race_id,
        )

        return TeamRaceMutation(team_race=saved_team_race)
