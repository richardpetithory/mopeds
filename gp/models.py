from django.db import models
from django.conf import settings


class Event(models.Model):
    name = models.CharField(
        blank=False,
        max_length=100,
    )


class BikeClass(models.Model):
    event = models.ForeignKey(
        to='Event',
        on_delete=models.CASCADE
    )

    name = models.CharField(
        blank=False,
        max_length=100
    )

    description = models.TextField(
        blank=True,
        default="",
    )


class RiderRegistration(models.Model):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    event = models.ForeignKey(
        to='Event',
        on_delete=models.CASCADE
    )

    bike_classes = models


class Heat(models.Model):
    class Meta:
        unique_together = ('bike_class', 'heat')

    bike_class = models.ForeignKey(
        to='BikeClass',
        on_delete=models.CASCADE
    )

    is_qualifying = models.BooleanField(
        default=False,
    )

    heat = models.IntegerField(
        null=False,
        default=1,
    )

