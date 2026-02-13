import graphene

import pages.schema
import rallies.schema
import users.schema


class Query(
    pages.schema.Query,
    rallies.schema.Query,
    users.schema.Query,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query)
