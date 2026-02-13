from django.core.management.base import BaseCommand

from users.models import User


class Command(BaseCommand):
    help = "Creates a superuser."

    def handle(self, *args, **options):
        if not User.objects.filter(email="admin").exists():
            User.objects.create_superuser(
                name="Admin", email="admin", password="admin", is_staff=True
            )
        print("Superuser has been created.")
