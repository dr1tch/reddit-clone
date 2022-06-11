import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }
  @Query(() => Post, { nullable: true })
  post(
    @Arg("_id") _id: number,
    @Ctx()
    { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { _id });
  }
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Arg("body") body: string,
    @Ctx()
    { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, {
      title,
      body,
    });
    console.log("post", post);
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Ctx() { em }: MyContext,
    @Arg("_id") _id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("body", () => String, { nullable: true }) body: string
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { _id });
    if (!post) {
      return null;
    } else {
      if (typeof title !== "undefined") post.title = title;
      if (typeof body !== "undefined") post.body = body;
    }
    console.log("post", post);
    await em.persistAndFlush(post);
    return post;
  }
  @Mutation(() => Boolean)
  async deletePost(
    @Ctx() { em }: MyContext,
    @Arg("_id") _id: number
  ): Promise<boolean> {
    // const post = await em.findOne(Post, { _id });
    // if (!post) {
    //   return false;
    // } else {
    await em.nativeDelete(Post, { _id });
    return true;
    // }
    // console.log("post", post);
    // await em.persistAndFlush(post);
    // return post;
  }
}
