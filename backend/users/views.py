from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User
from users.serializers import (
    UserSerializer,
    RegistrationSerializer,
    PasswordUpdateSerializer,
)


@api_view(['GET', 'POST'])
def users_multiple(request):
    if request.method == 'GET':
        return _get_users(request)
    else:
        return _create_user(request)


def _get_users(request):
    users = User.objects.exclude(pk=1)

    serializer = UserSerializer(instance=users, context={'request': request}, many=True)

    return Response(serializer.data)


def _create_user(request):
    serializer = RegistrationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def users_single(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return _get_user(request, user)

    elif request.method == 'PUT':
        return _modify_user(request, user)

    elif request.method == 'DELETE':
        return _delete_user(request, user)


def _get_user(request, user):
    serializer = UserSerializer(instance=user, context={'request': request}, many=False)

    return Response(serializer.data)


@login_required
def _modify_user(request, user):
    serializer = UserSerializer(user, data=request.data, context={'request': request})

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
def _delete_user(request, user):
    user.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def users_self(request):
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return _get_user(request, user)


@api_view(['POST'])
def change_password(request):
    try:
        user = User.objects.get(pk=request.user.pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = PasswordUpdateSerializer(user, data=request.data, context={'request': request})

    errors = {}

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(serializer.initial_data['old_password']):
        errors['old_password'] = ["Old password is not correct"]

    strength_errors = validate_password(serializer.initial_data['password'])

    if serializer.initial_data['password'] != serializer.initial_data['password2']:
        errors['password2'] = ["Passwords do not match"]
    elif strength_errors:
        errors['password'] = strength_errors

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(serializer.initial_data['password'])
    user.save()

    return Response(serializer.data, status=status.HTTP_200_OK)
