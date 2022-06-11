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
  @Query(() => User)
  async current(@Ctx() { em, req }: MyContext): Promise<User | null> {
    // The user is not logged in
    if (!req.session.userId) return null;
    const user = await em.findOne(User, { _id: parseInt(req.session.userId) });
    return user;
  }

  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("userDetails") userDetails: RegisterUserInfoInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (userDetails.username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            message: "username too short!",
          },
        ],
      };
    }
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
    const password = await argon2.hash(userDetails.password);

    const user = em.create(User, {
      email: userDetails.email,
      password,
      username: userDetails.username,
      bio: userDetails.bio,
      name: userDetails.name,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      console.error(err);
      if (err.code === "23505" && err.constraint.includes("username"))
        return {
          errors: [
            {
              message: "username already exists!",
              field: "username",
            },
          ],
        };
      else if (err.code === "23505" && err.constraint.includes("email"))
        return {
          errors: [
            {
              message: "Email already exists!",
              field: "email",
            },
          ],
        };
    }
    // store the user id in the session
    // this will set a cookie for the user
    // Keep the user logged in
    req.session.userId = user._id.toString();
    return { user };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("userDetails") userDetails: LoginUserInfoInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (userDetails.username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            message: "username too short!",
          },
        ],
      };
    }
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
    const user = await em.findOne(User, {
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
    if (!isPasswordValid)
      return {
        errors: [
          {
            message: "Password not valid!",
            field: "password",
          },
        ],
      };
    req.session.userId = user._id.toString();
    return { user };
  }
}
