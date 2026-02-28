import graphene
from django.db import IntegrityError
from django.db.models import Max
from graphql import GraphQLError

from bakers.models import Race, RaceDay, RaceTeamTime
from bakers.schema.types import RaceType, RaceDayType, RaceTeamTimeType


class SaveRaceMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String()
        year = graphene.Int(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        starting_address = graphene.String()
        starting_address_coordinates = graphene.String()
        starting_location = graphene.String()

    race = graphene.Field(lambda: RaceType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user

        if not user.is_staff:
            raise GraphQLError("Only staff may perform this action.")

        race_id = kwargs.pop("id", None)

        try:
            saved_race, created = Race.objects.update_or_create(
                id=race_id, defaults=kwargs
            )

            return SaveRaceMutation(race=saved_race)
        except IntegrityError:
            raise GraphQLError(f"A race already exists for {kwargs.get("year")}")


class DeleteRaceMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String()

    ok = graphene.Field(graphene.Boolean)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user

        if not user.is_staff:
            raise GraphQLError("Only staff may perform this action.")

        race_id = kwargs.pop("id", None)

        try:
            Race.objects.get(id=race_id).delete()

            return DeleteRaceMutation(ok=True)
        except Exception as e:
            raise GraphQLError(str(e))


class SaveRaceDayMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String()
        race_id = graphene.String(required=True)
        day_number = graphene.Int()
        description = graphene.String()
        day_off = graphene.Boolean()
        starting_datetime = graphene.types.datetime.DateTime()
        starting_is_previous_finish = graphene.Boolean()
        starting_address = graphene.String()
        starting_address_coordinates = graphene.String()
        starting_location = graphene.String()
        finishing_address = graphene.String()
        finishing_address_coordinates = graphene.String()
        finishing_location = graphene.String()
        commentary = graphene.String()

    race_day = graphene.Field(lambda: RaceDayType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user

        if not user.is_staff:
            raise GraphQLError("Only staff may perform this action.")

        day_id = kwargs.pop("id", None)
        race_id = kwargs.pop("race_id", None)
        day_number = kwargs.pop("day_number", None)

        try:
            if race_id and day_id:
                saved_race_day, _ = RaceDay.objects.update_or_create(
                    id=day_id, race_id=race_id, defaults=kwargs
                )
            else:
                if not day_number:
                    day_number = (
                        (
                            RaceDay.objects.filter(race=race_id)
                            .aggregate(Max("day_number"))
                            .get("day_number__max", 0)
                        )
                        or 0
                    ) + 1

                previous_day = (
                    RaceDay.objects.filter(race_id=race_id, day_off=False)
                    .order_by("day_number")
                    .last()
                )

                saved_race_day = RaceDay.objects.create(
                    race_id=race_id,
                    day_number=int(day_number),
                    **(kwargs | {"previous_day": previous_day}),
                )

            return SaveRaceDayMutation(race_day=saved_race_day)
        except IntegrityError:
            raise GraphQLError("That race day already exists.")
        except Exception as e:
            raise GraphQLError(str(e))


class DeleteRaceDayMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Field(graphene.Boolean)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user

        if not user.is_staff:
            raise GraphQLError("Only staff may perform this action.")

        day_id = kwargs.pop("id", None)

        try:
            RaceDay.objects.get(id=day_id).delete()

            return DeleteRaceDayMutation(ok=True)
        except Exception as e:
            raise GraphQLError(str(e))


class SaveRaceTeamTimeMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String()
        day_id = graphene.String(required=True)
        race_team_id = graphene.String(required=True)
        finish_time = graphene.String()
        dnf = graphene.Boolean()
        commentary = graphene.String()

    race_team_time = graphene.Field(lambda: RaceTeamTimeType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user

        if not user.is_staff:
            raise GraphQLError("Only staff may perform this action.")

        race_team_time_id = kwargs.pop("id", None)

        try:
            saved_team_time, _ = RaceTeamTime.objects.update_or_create(
                id=race_team_time_id,
                defaults=kwargs,
            )

            return SaveRaceTeamTimeMutation(race_team_time=saved_team_time)
        except IntegrityError:
            raise GraphQLError("A time for that team on this day already exists.")
        except Exception as e:
            raise GraphQLError(str(e))


class DeleteRaceTeamTimeMutation(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Field(graphene.Boolean)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user

        if not user.is_staff:
            raise GraphQLError("Only staff may perform this action.")

        race_team_time_id = kwargs.pop("id", None)

        try:
            RaceTeamTime.objects.get(id=race_team_time_id).delete()

            return DeleteRaceTeamTimeMutation(ok=True)
        except Exception as e:
            raise GraphQLError(str(e))
