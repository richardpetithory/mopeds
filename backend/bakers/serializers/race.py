from rest_framework import serializers


class RaceSerializerFull(serializers.ModelSerializer):
    days = serializers.SerializerMethodField()

    @staticmethod
    def get_days(instance):
        return RaceDaySerializer(instance.days, many=True).data

    class Meta:
        from ..models import Race

        model = Race
        fields = ("pk", "year", "name", "days")


class RaceSerializerMin(serializers.ModelSerializer):
    class Meta:
        from ..models import Race

        model = Race
        fields = ("pk", "year", "name")


class RaceDaySerializer(serializers.ModelSerializer):
    times = serializers.SerializerMethodField()

    @staticmethod
    def get_times(instance):
        return RaceTeamTimeSerializer(instance.times, many=True).data

    class Meta:
        from ..models import RaceDay

        model = RaceDay
        fields = ("pk", "day", "starting_time", "times")


class RaceTeamTimeSerializer(serializers.ModelSerializer):
    race_team = serializers.SerializerMethodField()

    @staticmethod
    def get_race_team(instance):
        return RaceTeamSerializer(instance.race_team).data

    class Meta:
        from ..models import RaceTeamTime

        model = RaceTeamTime
        fields = ("pk", "hours", "minutes", "dnf", "race_team")


class RaceTeamSerializer(serializers.ModelSerializer):
    team = serializers.SerializerMethodField(read_only=True)

    @staticmethod
    def get_team(instance):
        from bakers.serializers import TeamSerializer

        return TeamSerializer(instance.team).data

    class Meta:
        from ..models import RaceTeam

        model = RaceTeam
        fields = ("pk", "team")


#
#
# class RaceDaySerializer(serializers.ModelSerializer):
#     times = serializers.SerializerMethodField(many=True)
#
#     @staticmethod
#     def get_times(instance):
#         return RaceTeamTimeSerializer(instance.times)
#
#     class Meta:
#         model = RaceDay
#         fields = ('pk', 'day', 'starting_time', 'times')
#         depth = 1
#
#
# class RaceSerializer(serializers.ModelSerializer):
#     days = serializers.SerializerMethodField(many=True)
#
#     @staticmethod
#     def get_days(instance):
#         return instance.
#
#     class Meta:
#         model = Race
#         fields = ('pk', 'year', 'name', 'days')
#         depth = 1
#
#
# class RaceTeamTimeSerializer(serializers.ModelSerializer):
#     race_team = serializers.SerializerMethodField()
#
#     @staticmethod
#     def get_race_team(instance):
#         return RaceTeamSerializer(instance.team).data
#
#     class Meta:
#         model = RaceTeamTime
#         fields = ('pk', 'hours', 'minutes', 'dnf', 'race_team')
#         depth = 1
#
#
# class RaceTeamSerializer(serializers.ModelSerializer):
#     team = serializers.SerializerMethodField(read_only=True)
#
#     @staticmethod
#     def get_team(instance):
#         return TeamSerializer(instance.team).data
#
#     class Meta:
#         model = RaceTeam
#         fields = ('pk', 'team')
#         depth = 1
