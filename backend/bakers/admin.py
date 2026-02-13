from pprint import pprint

from django.conf import settings
from django.contrib import admin

from bakers.models import Team, TeamMembership
from bakers.models import Race, RaceDay, RaceTeam, RaceTeamTime


class TeamAdmin(admin.ModelAdmin):
    pass


class TeamMembershipAdmin(admin.ModelAdmin):
    pass


admin.site.register(Team, TeamAdmin)
admin.site.register(TeamMembership, TeamMembershipAdmin)


class RaceAdmin(admin.ModelAdmin):
    list_display = ("full_name",)


class RaceDayAdmin(admin.ModelAdmin):
    pass


class RaceTeamAdmin(admin.ModelAdmin):
    pass


class RaceTeamTimeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Race, RaceAdmin)
admin.site.register(RaceDay, RaceDayAdmin)
admin.site.register(RaceTeam, RaceTeamAdmin)
admin.site.register(RaceTeamTime, RaceTeamTimeAdmin)
