from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from ..models import Race
from ..serializers.race import RaceSerializerFull


@api_view(["GET", "POST"])
def races_multiple(request):
    if request.method == "GET":
        return _get_races(request)
    else:
        return _create_race(request)


def _get_races(request):
    races = Race.objects.all()

    serializer = RaceSerializerFull(
        instance=races, context={"request": request}, many=True
    )

    return Response(serializer.data)


@login_required
def _create_race(request):
    serializer = RaceSerializerFull(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def races_single(request, pk):
    try:
        race = Race.objects.get(pk=pk)
    except Race.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return _get_race(request, race)

    elif request.method == "PUT":
        return _modify_race(request, race)

    elif request.method == "DELETE":
        return _delete_race(request, race)


def _get_race(request, race):
    serializer = RaceSerializerFull(
        instance=race, context={"request": request}, many=False
    )

    return Response(serializer.data)


@login_required
def _modify_race(request, race):
    serializer = RaceSerializerFull(
        race, data=request.data, context={"request": request}
    )

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _delete_race(request, race):
    race.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)
