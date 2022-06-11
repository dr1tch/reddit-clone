import { Migration } from '@mikro-orm/migrations';

export class Migration20220610232459 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "password" type varchar(255) using ("password"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "password" type text using ("password"::text);');
  }

}
