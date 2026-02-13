from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class Layout(models.Model):
    slug = models.SlugField(
        help_text="Unique name for this template when including it",
        blank=False,
        unique=True,
    )

    content = models.TextField(
        default="",
        blank=True,
        null=False,
    )

    homepage = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.slug

    def clean(self):
        if self.homepage:
            if Layout.objects.all().exclude(id=self.pk).filter(homepage=True):
                raise ValidationError({'homepage': _("Another layout is already set to be the homepage")})


@receiver(pre_save, sender=Layout)
def validate_model(sender, instance, *args, **kwargs):
    instance.clean()
