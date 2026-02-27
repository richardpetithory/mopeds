import inspect

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from graphql import GraphQLError


def notfound_handler(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ObjectDoesNotExist as e:
            return GraphQLError(extensions={"code": "NOT_FOUND"}, message=str(e))

    return wrapper


class WrappedObjectType(graphene.ObjectType):
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        for name, method in inspect.getmembers(cls, predicate=inspect.isfunction):
            if name.startswith("resolve_"):
                setattr(cls, name, notfound_handler(method))


def validation_error_handler(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            return GraphQLError(extensions=e.message_dict, message=str(e))

    return wrapper
