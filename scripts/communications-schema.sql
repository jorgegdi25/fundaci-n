-- Apply only to a verified Sandbox database before enabling donation emails.
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
