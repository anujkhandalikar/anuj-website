CREATE TABLE IF NOT EXISTS chotu_signups (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL,
  type       text NOT NULL CHECK (type IN ('curious', 'pay')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(email)
);
