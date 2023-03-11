NESSIE_VERSION=2.0.10

run:
	@deno run --allow-all src/index.ts

fmt:
	@deno fmt

migrate-setup:
	@deno run -A --unstable https://deno.land/x/nessie/cli.ts init

create-migration:
	@deno run -A --unstable https://deno.land/x/nessie@${NESSIE_VERSION}/cli.ts make:migration $(MIGRATION_NAME)

migrate:
	@deno run -A --unstable https://deno.land/x/nessie/cli.ts migrate

rollback:
	@deno run -A --unstable https://deno.land/x/nessie/cli.ts rollback

