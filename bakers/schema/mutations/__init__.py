import graphene

from .races import (
    SaveRaceMutation,
    DeleteRaceMutation,
    SaveRaceDayMutation,
    DeleteRaceDayMutation,
    SaveRaceTeamTimeMutation,
)
from .teams import (
    SaveTeamMutation,
    RaceTeamMembershipInvitationMutation,
    TeamRaceMutation,
)


class Mutations(graphene.ObjectType):
    save_race = SaveRaceMutation.Field()
    delete_race = DeleteRaceMutation.Field()
    save_race_day = SaveRaceDayMutation.Field()
    delete_race_day = DeleteRaceDayMutation.Field()
    save_race_team_time = SaveRaceTeamTimeMutation.Field()
    save_team = SaveTeamMutation.Field()
    save_team_race = TeamRaceMutation.Field()
    save_team_race_membership = RaceTeamMembershipInvitationMutation.Field()
