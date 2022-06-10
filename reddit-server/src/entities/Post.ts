import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  _id!: number;

  @Field()
  @Property({ type: "string" })
  title!: string;

  @Field()
  @Property({ type: "text" })
  body!: string;

  @Field()
  @Property({ type: "date" })
  createdAt?: Date = new Date();

  @Field()
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
  }
}
