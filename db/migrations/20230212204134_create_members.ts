import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    await this.client.queryObject(
      "CREATE TABLE members (id BIGSERIAL PRIMARY KEY, name text, gather_id text, icon text)",
    );
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    await this.client.queryObject("DROP TABLE members");
  }
}
