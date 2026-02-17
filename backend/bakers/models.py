from datetime import date, time

from django.conf import settings
from django.db import models
from django.utils.translation import gettext as _


class Race(models.Model):
    class Meta:
        verbose_name = _("Races")
        verbose_name_plural = _("Races")

    year = models.IntegerField(
        _("Year"), null=False, default=date.today().year, unique=True
    )

    name = models.CharField(
        _("Name"), max_length=100, blank=False, null=False, unique=False
    )

    def __str__(self):
        return f"{self.year}"

    @property
    def full_name(self):
        return f"{self} “{self.name}”"


class RaceDay(models.Model):
    class Meta:
        verbose_name = _("Races day")
        verbose_name_plural = _("Races days")
        unique_together = [("race", "day")]
        ordering = ["day"]

    race = models.ForeignKey(to="Race", on_delete=models.CASCADE, related_name="days")

    day = models.IntegerField(_("Day #"), null=True, blank=False)

    starting_time = models.TimeField(
        _("Starting time"), null=False, blank=False, default=time(10, 0)
    )

    def __str__(self):
        return f"Day {self.day} of {self.race.year}"


class RaceTeam(models.Model):
    class Meta:
        verbose_name = _("Participating team")
        verbose_name_plural = _("Participating teams")
        unique_together = [("race", "team")]

    race = models.ForeignKey(to="Race", on_delete=models.CASCADE)

    team = models.ForeignKey(to="Team", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.team} for {self.race.year}"


class RaceTeamTime(models.Model):
    class Meta:
        verbose_name = _("Races time")
        verbose_name_plural = _("Races times")
        unique_together = [("day", "race_team")]
        ordering = ["duration"]

    day = models.ForeignKey(
        to="RaceDay", on_delete=models.CASCADE, related_name="times"
    )

    race_team = models.ForeignKey(to="RaceTeam", on_delete=models.CASCADE)

    duration = models.DurationField(_("Minutes Total"), null=True, blank=True)

    dnf = models.BooleanField(_("DNF"), null=False, default=False)

    @property
    def result(self):
        if self.dnf:
            return "DNF"
        else:
            return f"{self.duration}"

    def __str__(self):
        return f"Time for {self.race_team.team} on {self.day}: {self.result}"


def upload_to(instance, filename):
    return "images/{filename}".format(filename=filename)


class Team(models.Model):
    class Meta:
        verbose_name = _("Teams")
        verbose_name_plural = _("Teams")

    name = models.CharField(
        _("Name"), max_length=100, blank=False, null=False, unique=True
    )

    description = models.TextField(_("Description"), blank=True, null=False, default="")

    logo = models.ImageField(upload_to=upload_to, blank=True, null=True)

    captain = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING
    )

    def __str__(self):
        return self.name


class TeamMembership(models.Model):
    class Meta:
        verbose_name = _("Teams Member")
        verbose_name_plural = _("Teams Members")
        unique_together = ("team", "member", "race")

    team = models.ForeignKey(
        to="Team", on_delete=models.CASCADE, related_name="memberships"
    )

    member = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    race = models.ForeignKey(to="Race", on_delete=models.CASCADE, related_name="bakers")

    def __str__(self):
        return f"{self.member} in {self.team} for {self.race}"
