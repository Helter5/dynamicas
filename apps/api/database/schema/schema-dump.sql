CREATE TABLE IF NOT EXISTS "migrations" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "migration" varchar NOT NULL,
    "batch" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "email_verified_at" datetime,
    "password" varchar NOT NULL,
    "remember_token" varchar,
    "created_at" datetime,
    "updated_at" datetime
);
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "email" varchar NOT NULL,
    "token" varchar NOT NULL,
    "created_at" datetime,
    PRIMARY KEY ("email")
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "id" varchar NOT NULL,
    "user_id" integer,
    "ip_address" varchar,
    "user_agent" text,
    "payload" text NOT NULL,
    "last_activity" integer NOT NULL,
    PRIMARY KEY ("id")
);
CREATE INDEX "sessions_user_id_index" ON "sessions" ("user_id");
CREATE INDEX "sessions_last_activity_index" ON "sessions" ("last_activity");

CREATE TABLE IF NOT EXISTS "cache" (
    "key" varchar NOT NULL,
    "value" text NOT NULL,
    "expiration" integer NOT NULL,
    PRIMARY KEY ("key")
);

CREATE TABLE IF NOT EXISTS "cache_locks" (
    "key" varchar NOT NULL,
    "owner" varchar NOT NULL,
    "expiration" integer NOT NULL,
    PRIMARY KEY ("key")
);

CREATE TABLE IF NOT EXISTS "jobs" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "queue" varchar NOT NULL,
    "payload" text NOT NULL,
    "attempts" integer NOT NULL,
    "reserved_at" integer,
    "available_at" integer NOT NULL,
    "created_at" integer NOT NULL
);
CREATE INDEX "jobs_queue_index" ON "jobs" ("queue");

CREATE TABLE IF NOT EXISTS "job_batches" (
    "id" varchar NOT NULL,
    "name" varchar NOT NULL,
    "total_jobs" integer NOT NULL,
    "pending_jobs" integer NOT NULL,
    "failed_jobs" integer NOT NULL,
    "failed_job_ids" text NOT NULL,
    "options" text,
    "cancelled_at" integer,
    "created_at" integer NOT NULL,
    "finished_at" integer,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "failed_jobs" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" varchar NOT NULL,
    "connection" text NOT NULL,
    "queue" text NOT NULL,
    "payload" text NOT NULL,
    "exception" text NOT NULL,
    "failed_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" ON "failed_jobs" ("uuid");

CREATE TABLE IF NOT EXISTS "personal_access_tokens" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenable_type" varchar NOT NULL,
    "tokenable_id" integer NOT NULL,
    "name" text NOT NULL,
    "token" varchar NOT NULL,
    "abilities" text,
    "last_used_at" datetime,
    "expires_at" datetime,
    "created_at" datetime,
    "updated_at" datetime
);
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" ON "personal_access_tokens" ("token");
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" ON "personal_access_tokens" ("tokenable_type", "tokenable_id");
CREATE INDEX "personal_access_tokens_expires_at_index" ON "personal_access_tokens" ("expires_at");

CREATE TABLE IF NOT EXISTS "api_logs" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anon_token" varchar,
    "endpoint" varchar NOT NULL,
    "command" text NOT NULL,
    "status" varchar NOT NULL,
    "error_message" text,
    "meta" text,
    "created_at" datetime,
    "updated_at" datetime
);
CREATE INDEX "api_logs_anon_token_index" ON "api_logs" ("anon_token");

CREATE TABLE IF NOT EXISTS "cas_user_states" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anon_token" varchar NOT NULL,
    "script" text NOT NULL DEFAULT '',
    "created_at" datetime,
    "updated_at" datetime,
    "last_eval_at" datetime
);
CREATE UNIQUE INDEX "cas_user_states_anon_token_unique" ON "cas_user_states" ("anon_token");

CREATE TABLE IF NOT EXISTS "simulation_usages" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "simulation" varchar NOT NULL,
    "anon_token" varchar NOT NULL,
    "ip_address" varchar,
    "city" varchar,
    "country" varchar,
    "used_at" datetime NOT NULL,
    "created_at" datetime,
    "updated_at" datetime
);
CREATE INDEX "simulation_usages_simulation_index" ON "simulation_usages" ("simulation");
CREATE INDEX "simulation_usages_anon_token_index" ON "simulation_usages" ("anon_token");
CREATE INDEX "simulation_usages_used_at_index" ON "simulation_usages" ("used_at");
CREATE INDEX "simulation_usages_simulation_anon_token_used_at_index" ON "simulation_usages" ("simulation", "anon_token", "used_at");
