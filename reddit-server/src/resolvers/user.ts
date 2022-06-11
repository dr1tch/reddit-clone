import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
@InputType()
class RegisterUserInfoInput {
  @Field()
  username: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  bio: string;
}

@InputType()
class LoginUserInfoInput {
  @Field()
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class ErrorHandler {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [ErrorHandler], { nullable: true })
  errors?: ErrorHandler[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }
  @Mutation(() => User)
  async register(
    @Arg("userDetails") userDetails: RegisterUserInfoInput,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const password = await argon2.hash(userDetails.password);

    const user = em.create(User, {
      email: userDetails.email,
      password,
      username: userDetails.username,
      bio: userDetails.bio,
      name: userDetails.name,
    });
    await em.persistAndFlush(user).catch((e) => console.error(e));
    return user;
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("userDetails") userDetails: LoginUserInfoInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      //   email: userDetails.email,
      username: userDetails.username,
    });
    if (!user) {
      return {
        errors: [
          {
            message: "User doesn't exist!",
            field: "password",
          },
        ],
      };
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      userDetails.password
    );
    if (userDetails.password.length < 8) {
      return {
        errors: [
          {
            message: "Password must be greater than 8 characters!",
            field: "password",
          },
        ],
      };
    }
    if (!isPasswordValid)
      return {
        errors: [
          {
            message: "Password not valid!",
            field: "password",
          },
        ],
      };
    // if (isPasswordValid) return user;

    // const password = await argon2.hash(userDetails.password);

    // const user = em.create(User, {
    //   email: userDetails.email,
    //   password,
    //   username: userDetails.username,
    // });
    // await em.persistAndFlush(user).catch((e) => console.error(e));
    return { user };
  }
}
