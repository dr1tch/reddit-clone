import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+.*\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "reddit",
  type: "postgresql",
  debug: !__prod__,
  user: "dr1tch",
  password: "1HRMBD99DYH",
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
