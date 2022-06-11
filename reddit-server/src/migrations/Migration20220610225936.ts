import { Migration } from '@mikro-orm/migrations';

export class Migration20220610225936 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("_id" serial primary key, "name" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "bio" text null, "password" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
