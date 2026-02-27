from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.mail import send_mail
from django.core.validators import MinLengthValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _

from .managers import RiderManager


class Rider(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = _("Rider")
        verbose_name_plural = _("Riders")

    name = models.CharField(
        _("Name"),
        max_length=100,
        blank=False,
        null=False,
        validators=[MinLengthValidator(1)],
    )

    email = models.EmailField(_("Email Address"), unique=True, blank=False, null=False)

    is_staff = models.BooleanField(
        _("Staff Status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )

    is_active = models.BooleanField(
        _("Active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = RiderManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name
