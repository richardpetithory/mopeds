from django.core.management.base import BaseCommand

from users.models import Rider


class Command(BaseCommand):
    help = "Creates a superuser."

    def handle(self, *args, **options):
        if not Rider.objects.filter(email="admin@mopeds.lol").exists():
            Rider.objects.create_superuser(
                name="Admin", email="admin@mopeds.lol", password="admin", is_staff=True
            )
        print("Superuser has been created.")
