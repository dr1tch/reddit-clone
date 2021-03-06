import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  _id!: number;

  @Field()
  @Property({ type: "string" })
  name!: string;

  @Field()
  @Property({ type: "string", unique: true })
  username!: string;

  @Field()
  @Property({ type: "string", unique: true })
  email!: string;

  @Field()
  @Property({ type: "text", nullable: true })
  bio?: string;

  @Property({ type: "string" })
  password!: string;

  @Field()
  @Property({ type: "date" })
  createdAt?: Date = new Date();

  @Field()
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  //   constructor(title: string, body: string) {
  //     this.title = title;
  //     this.body = body;
  //   }
}
