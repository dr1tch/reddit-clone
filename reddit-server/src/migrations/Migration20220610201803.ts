import { Migration } from '@mikro-orm/migrations';

export class Migration20220610201803 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("_id" serial primary key, "title" varchar(255) not null, "body" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
