-- Sandbox only. PayPal handles payment details and recurring billing.
CREATE TABLE IF NOT EXISTS paypal_gifts (
 id uuid PRIMARY KEY, access_hash text NOT NULL,
 amount integer NOT NULL CHECK(amount BETWEEN 100 AND 1000000),
 currency text NOT NULL CHECK(currency IN ('USD','EUR')),
 frequency text NOT NULL CHECK(frequency IN ('once','monthly')),
 cause text NOT NULL CHECK(cause IN ('general','el-cairo','sierra-nevada','amazonas','mhuysqa')),
 lang text NOT NULL CHECK(lang IN ('es','en')),
 environment text NOT NULL DEFAULT 'sandbox' CHECK(environment='sandbox'),
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
