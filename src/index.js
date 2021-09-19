const fs = require('fs');
const path = require('path');

const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { GraphQLScalarType } = require('graphql');


const prisma = new PrismaClient();

const resolvers = {
    Query: {
        cyclists: async (parent, args, context) => {
            return context.prisma.cyclist.findMany({
                include: {
                    articles: true,
                }
            });
        },
        articles: async (parent, args, context) => {
            return context.prisma.article.findMany();
        },
    },
    Mutation: {
        article: (parent, args, context) => create(context.prisma, 'article', {
            published: args.published,
            url: args.url,
            medium: args.medium,
            cyclistId: args.cyclistId,
        }),
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'A date and time, represented as an ISO-8601 string',
        serialize: (value) => value.toISOString(),
        parseValue: (value) => new Date(value),
        parseLiteral: (ast) => new Date(ast.value)
    }),
}

const create = (prisma, serviceName, data) => {
    const newItem = prisma[serviceName].create({
        data
    })
    return newItem;
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, './schema/schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );