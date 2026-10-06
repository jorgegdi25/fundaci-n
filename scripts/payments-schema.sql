-- Dedicated Sandbox database. No card numbers or CVV are stored.
CREATE TABLE IF NOT EXISTS donation_intents (
  id uuid PRIMARY KEY,
  access_hash text NOT NULL,
  amount integer NOT NULL CHECK (amount BETWEEN 1000 AND 100000000),
  cause text NOT NULL CHECK (cause IN ('general','el-cairo','sierra-nevada','amazonas','mhuysqa')),
  frequency text NOT NULL CHECK (frequency IN ('once','monthly')),
  lang text NOT NULL CHECK (lang IN ('es','en')),
  environment text NOT NULL DEFAULT 'sandbox' CHECK (environment = 'sandbox'),
  email text,
  consent jsonb,
  payment_source_id bigint,
  payment_source_type text,
  source_state text NOT NULL DEFAULT 'new',
  subscription_state text NOT NULL DEFAULT 'pending',
  anchor_day integer,
  next_charge_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS donation_attempts (
  reference text PRIMARY KEY,
  intent_id uuid NOT NULL REFERENCES donation_intents(id),
  transaction_id text UNIQUE,
  status text NOT NULL DEFAULT 'CREATED',
  cycle integer NOT NULL DEFAULT 0,
  due_at timestamptz NOT NULL DEFAULT now(),
  event_timestamp bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (intent_id, cycle)
);
CREATE TABLE IF NOT EXISTS donation_rate_limits (
  bucket text PRIMARY KEY,
  count integer NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS donation_due ON donation_intents(next_charge_at) WHERE subscription_state='active';
