import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
// import { faker } from "@faker-js/faker";
// ======================================
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
const main = async () => {
  const orm = await MikroORM.init(microOrmConfig);
  // await orm.getMigrator().up();
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
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
