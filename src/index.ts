import fs from 'fs';
import path from 'path';

import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { GraphQLScalarType } from 'graphql';

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

Sentry.init({
    dsn: 'https://357348179eba40f0b38601dceab72210@o1041077.ingest.sentry.io/6010032',
    integrations: [new Tracing.Integrations.Postgres()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

try {
    const prisma = new PrismaClient();

    const resolvers = {
        Query: {
            cyclist: async (parent, args, context) => {
                const { id } = args;
                if (id) {
                    return await context.prisma.cyclist.findUnique({
                        where: {
                            id,
                        },
                    });
                }
            },
            cyclists: async (parent, args, context) => {
                return await context.prisma.cyclist.findMany({
                    include: {
                        articles: true,
                    },
                });
            },
            articles: async (parent, args, context) => {
                return await context.prisma.article.findMany({
                    orderBy: args.orderBy,
                    include: {
                        cyclist: true,
                    }
                });
            },
        },
        Date: new GraphQLScalarType({
            name: 'Date',
            description: 'A date and time, represented as an ISO-8601 string',
            serialize: (value) => value.toISOString(),
            parseValue: (value) => new Date(value),
            parseLiteral: (ast: any) => new Date(ast.value),
        }),
    };

    const server = new ApolloServer({
        typeDefs: fs.readFileSync(
            path.join(__dirname, './schema/schema.graphql'),
            'utf8'
        ),
        resolvers,
        context: {
            prisma,
        },
    });

    server
        .listen({ port: process.env.PORT || 4000 })
        .then(({ url }) => console.log(`Server is running on ${url}`));
} catch (error) {
    console.log(error);
    Sentry.captureException(error);
}
