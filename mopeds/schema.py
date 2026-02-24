import graphene

import users.schema
from bakers.schema import queries, mutations


class Query(
    queries.Queries,
    # pages.schema.Query,
    # rallies.schema.Query,
    users.schema.Queries,
    graphene.ObjectType,
):
    pass


class Mutation(
    mutations.Mutations,
    users.schema.Mutations,
    graphene.ObjectType,
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
