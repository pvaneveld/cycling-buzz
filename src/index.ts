import fs from 'fs';
import path from 'path';

import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { GraphQLScalarType } from 'graphql';

import Sentry from "@sentry/node";
import Tracing from "@sentry/tracing";

Sentry.init({
    dsn: "https://357348179eba40f0b38601dceab72210@o1041077.ingest.sentry.io/6010032",
    integrations: [
        new Tracing.Integrations.Mysql(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

try {
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
            parseLiteral: (ast: any) => new Date(ast.value)
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
} catch (error) {
    Sentry.captureException(error);
}

