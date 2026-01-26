CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_plan_enum AS ENUM ('free', 'premium');

CREATE TYPE goal_status_enum AS ENUM ('active', 'completed', 'canceled');

CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,

  plan user_plan_enum DEFAULT 'free',
  stripe_customer_id VARCHAR(255),

  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,

  target_amount NUMERIC(10,2) NOT NULL,
  current_amount NUMERIC(10,2) DEFAULT 0,

  category VARCHAR(255),
  deadline DATE,

  status goal_status_enum DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_goals_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID NOT NULL,
  type transaction_type_enum NOT NULL,

  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0.01),
  category VARCHAR(255) NOT NULL,

  date DATE DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);


CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  provider TEXT NOT NULL, 
  -- 'kirvano', 'stripe', 'pix', 'manual', etc

  provider_payment_id TEXT NOT NULL,
  -- ID da transação no gateway

  email VARCHAR(255) NOT NULL,

  code TEXT NOT NULL UNIQUE,

  status TEXT NOT NULL DEFAULT 'ACTIVE',
  -- ACTIVE | USED | REFUNDED | EXPIRED

  user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,

  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (provider, provider_payment_id)
);

INSERT INTO users (
  id,
  email,
  name,
  password_hash,
  plan
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'thiago@email.com',
  'Thiago',
  '$2a$10$E6x6J6N5Jz5sY2K0u8fN5OeOVeFZ8VxTnWzM6F0ZJYwzH3z7bQe9S',
  'premium'
);


INSERT INTO goals (
  user_id,
  title,
  target_amount,
  current_amount,
  category,
  deadline,
  status
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Reserva de Emergência',
  10000.00,
  2500.00,
  'financeiro',
  '2026-12-31',
  'active'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Comprar Notebook',
  8000.00,
  8000.00,
  'equipamentos',
  '2025-11-01',
  'completed'
);

INSERT INTO transactions (
  user_id,
  type,
  amount,
  category,
  date,
  description
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'income',
  5000.00,
  'salário',
  '2025-01-10',
  'Pagamento mensal'
),
(
  '11111111-1111-1111-1111-111111111111',
  'expense',
  1200.00,
  'aluguel',
  '2025-01-05',
  'Aluguel do mês'
),
(
  '11111111-1111-1111-1111-111111111111',
  'expense',
  300.00,
  'alimentação',
  '2025-01-08',
  'Mercado'
);
