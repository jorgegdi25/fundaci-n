-- This marker is checked by the Live service before reading or writing gifts.
CREATE TABLE IF NOT EXISTS paypal_environment (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton=true),
 environment text NOT NULL CHECK(environment='production')
);
INSERT INTO paypal_environment(singleton,environment) VALUES(true,'production') ON CONFLICT(singleton) DO NOTHING;
CREATE TABLE IF NOT EXISTS donation_rate_limits (
 bucket text PRIMARY KEY, count integer NOT NULL DEFAULT 1, expires_at timestamptz NOT NULL
);
-- Dedicated Live database only. PayPal handles payment details and recurring billing.
CREATE TABLE IF NOT EXISTS paypal_gifts (
 id uuid PRIMARY KEY, access_hash text NOT NULL,
 amount integer NOT NULL CHECK(amount BETWEEN 100 AND 1000000),
 currency text NOT NULL CHECK(currency IN ('USD','EUR')),
 frequency text NOT NULL CHECK(frequency IN ('once','monthly')),
 cause text NOT NULL CHECK(cause IN ('general','el-cairo','sierra-nevada','amazonas','mhuysqa')),
 lang text NOT NULL CHECK(lang IN ('es','en')),
 environment text NOT NULL DEFAULT 'production' CHECK(environment='production'),
 consent jsonb NOT NULL, order_id text UNIQUE, subscription_id text UNIQUE, plan_id text,
 status text NOT NULL DEFAULT 'CREATED', subscription_state text NOT NULL DEFAULT 'APPROVAL_PENDING',
 next_charge_at timestamptz, provider_updated_at timestamptz, cancelled_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS paypal_payments (
 id text PRIMARY KEY, gift_id uuid NOT NULL REFERENCES paypal_gifts(id),
 amount integer NOT NULL, currency text NOT NULL, status text NOT NULL,
 paid_at timestamptz NOT NULL, updated_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS paypal_payment_gift ON paypal_payments(gift_id,paid_at DESC);
CREATE TABLE IF NOT EXISTS paypal_events (
 id text PRIMARY KEY, event_type text NOT NULL, processed_at timestamptz NOT NULL DEFAULT now()
);

-- Dedicated PayPal Live database. Email delivery requires a separate explicit opt-in.
-- Only whitelisted receipt fields are stored. No card data or access tokens.
CREATE TABLE IF NOT EXISTS donation_communications (
  event_key text PRIMARY KEY,
  payload jsonb NOT NULL,
  donor_sent_at timestamptz,
  donor_skipped boolean NOT NULL DEFAULT false,
  foundation_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  lease_until timestamptz,
  lease_id uuid,
  first_attempt_at timestamptz,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0,
  needs_review boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS donation_communications_due ON donation_communications(next_attempt_at) WHERE needs_review=false;
