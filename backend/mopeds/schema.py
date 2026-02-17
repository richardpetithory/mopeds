import graphene

import bakers.schema
import users.schema


class Query(
    bakers.schema.Queries,
    # pages.schema.Query,
    # rallies.schema.Query,
    users.schema.Queries,
    graphene.ObjectType,
):
    pass


class Mutation(
    # bakers.schema.Mutations,
    users.schema.Mutations,
    graphene.ObjectType,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
