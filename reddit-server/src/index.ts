import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
// import { faker } from "@faker-js/faker";
// ======================================
import { __prod__ } from "./constants";
import microOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microOrmConfig);
  // await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);
  app.use(
    session({
      name: "qid",

      store: new RedisStore({ client: redisClient as any, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // cookie only works in https
      },
      secret:
        "dfjsdhfgsdfsxbcmxzbyuwewe7823483rhdasdwe6yrr78dfysdhj47987elrklweur89w7r893",
      resave: false,
      saveUninitialized: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.info("[info] - server started on localhost:4000...");
  });
};
main().catch((e) => console.error(e));

// const posts = await orm.em.find(Post, {});
// console.log("posts", posts);
// await orm.isConnected();
// const post = new Post(
//   faker.lorem.slug(),
//   faker.lorem.paragraphs(2, "<br/>\n")
// );

// const post = orm.em.create(Post, {
//   title: faker.lorem.slug(),
//   body: faker.lorem.paragraphs(2, "<br/>\n"),
// });
// console.log("post", post);
// await orm.em.persistAndFlush(post);
