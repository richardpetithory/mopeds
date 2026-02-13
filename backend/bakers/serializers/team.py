from rest_framework import serializers


class TeamSerializer(serializers.ModelSerializer):
    memberships = serializers.SerializerMethodField(read_only=True)
    captain = serializers.SerializerMethodField(read_only=True)
    is_captain = serializers.SerializerMethodField(read_only=True)

    @staticmethod
    def get_memberships(instance):
        return TeamMembershipSerializer(
            instance=instance.memberships.order_by("-race__year"),
            many=True,
            read_only=True,
        ).data

    @staticmethod
    def get_captain(instance):
        from users.serializers import UserSerializer

        return UserSerializer(instance.captain).data

    def get_is_captain(self, instance):
        if "request" not in self.context:
            return True

        return self.context["request"] == instance.captain

    class Meta:
        from ..models import Team

        model = Team
        fields = ("pk", "name", "description", "memberships", "captain", "is_captain")
        depth = 1


class TeamCreatorSerializer(serializers.ModelSerializer):
    class Meta:
        from ..models import Team

        model = Team
        fields = ("pk", "name", "captain")


class TeamMembershipSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()
    race = serializers.SerializerMethodField()

    @staticmethod
    def get_member(instance):
        from users.serializers import UserSerializer

        return UserSerializer(
            instance.member,
        ).data

    @staticmethod
    def get_race(instance):
        from .race import RaceSerializerMin

        return RaceSerializerMin(instance.race).data

    class Meta:
        from ..models import TeamMembership

        model = TeamMembership
        fields = ("pk", "member", "race")
        depth = 1
