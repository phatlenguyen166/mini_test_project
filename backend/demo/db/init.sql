-- =========================
-- 1) Create Database
-- =========================
CREATE DATABASE IF NOT EXISTS transfer_simulator
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE transfer_simulator;

-- =========================
-- 2) Create Table: transfer_simulations
-- =========================
CREATE TABLE IF NOT EXISTS transfer_simulations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- User inputs / stored values
  send_amount_jpy BIGINT UNSIGNED NOT NULL,
  receive_amount_vnd BIGINT UNSIGNED NOT NULL,

  -- Calculated fee (JPY)
  fee_jpy INT UNSIGNED NOT NULL,

  -- Exchange rate at time of simulation (JPY -> VND)
  rate_jpy_to_vnd DECIMAL(18, 8) NOT NULL,

  -- Optional: how the user filled the form (for auditing/UX)
  input_mode ENUM('JPY_INPUT', 'VND_INPUT', 'BOTH') NOT NULL DEFAULT 'BOTH',

  -- Optional: lightweight audit fields (no personal info)
  client_ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,

  PRIMARY KEY (id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =========================
-- 3) (Optional) Add a simple view for latest history
-- =========================
CREATE OR REPLACE VIEW v_public_history AS
SELECT
  id,
  created_at,
  send_amount_jpy,
  fee_jpy,
  rate_jpy_to_vnd,
  receive_amount_vnd,
  input_mode
FROM transfer_simulations
ORDER BY created_at DESC;
