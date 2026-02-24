from datetime import date

from django.conf import settings
from django.db import models
from django.utils import timezone
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

    description = models.TextField(_("Description"), blank=True, null=False, default="")

    def __str__(self):
        return f"{self.year}"

    @property
    def full_name(self):
        return f"{self} “{self.name}”"


class RaceDay(models.Model):
    class Meta:
        verbose_name = _("Races day")
        verbose_name_plural = _("Races days")
        unique_together = [("race", "day_number")]
        ordering = ["day_number"]

    race = models.ForeignKey(to="Race", on_delete=models.CASCADE, related_name="days")

    day_number = models.IntegerField(_("Day #"), null=True, blank=False)

    description = models.TextField(_("Description"), blank=True, null=False, default="")

    starting_datetime = models.DateTimeField(
        _("Starting Date & Time"),
        blank=True,
        null=False,
        default=timezone.now().replace(hour=10, minute=0, second=0, microsecond=0),
    )

    starting_address = models.TextField(
        _("Starting Line Address"), blank=True, null=False, default=""
    )

    starting_address_coordinates = models.CharField(
        _("Starting line location longitude and lattitude"),
        max_length=100,
        blank=True,
        null=False,
        default="",
    )

    starting_location = models.CharField(
        _("Starting Line Short Name"),
        max_length=50,
        blank=True,
        null=False,
        default="",
    )

    finishing_address = models.TextField(
        _("Finish Line Address"), blank=True, null=False, default=""
    )

    finishing_address_coordinates = models.CharField(
        _("Finish line location longitude and lattitude"),
        max_length=100,
        blank=True,
        null=False,
        default="",
    )

    finishing_location = models.CharField(
        _("Finish Line Short Name"), max_length=100, blank=True, null=False, default=""
    )

    commentary = models.TextField(
        _("Day Commentary"), blank=True, null=False, default=""
    )

    def __str__(self):
        return f"Day {self.day_number} of {self.race.year}"


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
        ordering = ["finish_time"]

    day = models.ForeignKey(
        to="RaceDay", on_delete=models.CASCADE, related_name="times"
    )

    race_team = models.ForeignKey(to="RaceTeam", on_delete=models.CASCADE)

    finish_time = models.TimeField(_("Finish Time"), null=True, blank=True)

    dnf = models.BooleanField(_("DNF"), null=False, default=False)

    commentary = models.TextField(
        _("Team's Day Commentary"), blank=True, null=False, default=""
    )

    @property
    def result(self):
        if self.dnf:
            return "DNF"
        else:
            return f"{self.finish_time}"

    def __str__(self):
        return f"{self.id}: Time for {self.race_team.team} on {self.day.day_number}: {self.result}"


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

    manager = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING
    )

    def __str__(self):
        return self.name


class RaceTeamMembership(models.Model):
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

    invited = models.BooleanField(_("Invited"), null=False, default=True)

    def __str__(self):
        return f"{self.member} in {self.team} for {self.race}"
