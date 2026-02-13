from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from ..models import Team
from ..serializers import TeamSerializer, TeamCreatorSerializer


@api_view(["GET", "POST"])
def teams_multiple(request):
    if request.method == "GET":
        return _get_teams(request)
    else:
        return _post_team(request)


def _get_teams(request):
    teams = Team.objects.all()

    serializer = TeamSerializer(instance=teams, context={"request": request}, many=True)

    return Response(serializer.data)


@login_required
def _post_team(request):
    request.data["captain"] = request.user.pk

    serializer = TeamCreatorSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def teams_single(request, pk):
    try:
        team = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return _get_team(request, team)

    elif request.method == "PUT":
        return _modify_team(request, team)

    elif request.method == "DELETE":
        return _delete_team(request, team)


def _get_team(request, team):
    serializer = TeamSerializer(instance=team, context={"request": request}, many=False)

    return Response(serializer.data)


@login_required
def _modify_team(request, team):
    if request.user != team.captain:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    serializer = TeamSerializer(team, data=request.data, context={"request": request})

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
def _delete_team(request, team):
    team.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)
