from django.db import models


class Rally(models.Model):
    name = models.CharField(
        blank=False,
        max_length=100,
    )

    url_slug = models.SlugField(
        blank=False,
        max_length=100,
    )

    email_required = models.BooleanField(
        default=True,
    )

    phone_required = models.BooleanField(
        default=True,
    )


class Registrant(models.Model):
    rally = models.ForeignKey(
        to="Rally",
        on_delete=models.CASCADE,
    )

    name = models.CharField(
        blank=False,
        max_length=100,
    )

    email = models.EmailField(
        blank=True,
        default="",
    )

    phone = models.CharField(
        blank=True,
        max_length=20,
        default="",
    )

    def __str__(self):
        return self.name


QUESTION_TYPES = (
    ('BOOLEAN', 'Yes/No'),
    ('CHAR', 'Small amount of text'),
    ('TEXT', 'Bigger text entry'),
    ('CHOICE', 'Multiple Choice'),
)


class CustomQuestion(models.Model):
    rally = models.ForeignKey(
        to="Rally",
        on_delete=models.CASCADE,
    )

    question_title = models.CharField(
        name="Title",
        blank=False,
        max_length=200,
    )

    question_type = models.CharField(
        choices=QUESTION_TYPES,
        blank=False,
        max_length=10
    )

    required = models.BooleanField(
        default=False,
    )

    def __str__(self):
        return self.question_title


class QuestionResponse(models.Model):
    question = models.ForeignKey(
        to="CustomQuestion",
        on_delete=models.CASCADE
    )

    value = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.value
