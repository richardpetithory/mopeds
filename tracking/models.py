from django.db import models


class UserLocation(models.Model):
    user = models.ForeignKey(to="users.Rider", on_delete=models.CASCADE)
