-- Migration: Add Payment Approval System
-- Date: 2025-10-22
-- Description: Add cash payment support with Super Admin approval workflow

-- 1. Update Payment model to support cash payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'credit_card',
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_approval_status ON payments(approval_status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);

-- Add comment for payment_type values
COMMENT ON COLUMN payments.payment_type IS 'credit_card, cash, free';

-- Add comment for approval_status values
COMMENT ON COLUMN payments.approval_status IS 'pending, approved, rejected (only for cash/free payments)';

-- 2. Update Challenge model to track who created it
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'credit_card',
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON challenges(created_by);
CREATE INDEX IF NOT EXISTS idx_challenges_approval_status ON challenges(approval_status);
CREATE INDEX IF NOT EXISTS idx_challenges_payment_type ON challenges(payment_type);

-- Add comment for payment_type values
COMMENT ON COLUMN challenges.payment_type IS 'credit_card, cash, free';

-- Add comment for approval_status values
COMMENT ON COLUMN challenges.approval_status IS 'pending, approved, rejected (only for cash/free payments)';

-- 3. Create Payment Approval Requests table for tracking
CREATE TABLE IF NOT EXISTS payment_approval_requests (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    
    -- Request details
    requested_by INTEGER NOT NULL REFERENCES users(id),
    requested_for INTEGER NOT NULL REFERENCES users(id), -- The trader/user
    amount NUMERIC(10, 2) NOT NULL,
    payment_type VARCHAR(20) NOT NULL, -- cash, free
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
    
    -- Approval/Rejection
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_payment_type CHECK (payment_type IN ('cash', 'free')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON payment_approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_approval_requests_requested_by ON payment_approval_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_approval_requests_requested_for ON payment_approval_requests(requested_for);
CREATE INDEX IF NOT EXISTS idx_approval_requests_challenge_id ON payment_approval_requests(challenge_id);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_payment_approval_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payment_approval_requests_updated_at
    BEFORE UPDATE ON payment_approval_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_approval_requests_updated_at();

-- 4. Update existing records to have default values
UPDATE payments 
SET payment_type = 'credit_card', 
    approval_status = 'approved' 
WHERE payment_type IS NULL;

UPDATE challenges 
SET payment_type = 'credit_card', 
    approval_status = 'approved' 
WHERE payment_type IS NULL;

-- 5. Add constraints after updating existing data
ALTER TABLE payments 
ALTER COLUMN payment_type SET NOT NULL,
ALTER COLUMN approval_status SET NOT NULL;

ALTER TABLE challenges 
ALTER COLUMN payment_type SET NOT NULL,
ALTER COLUMN approval_status SET NOT NULL;

-- Add check constraints
ALTER TABLE payments 
ADD CONSTRAINT valid_payment_type CHECK (payment_type IN ('credit_card', 'cash', 'free')),
ADD CONSTRAINT valid_approval_status CHECK (approval_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE challenges 
ADD CONSTRAINT valid_payment_type_challenges CHECK (payment_type IN ('credit_card', 'cash', 'free')),
ADD CONSTRAINT valid_approval_status_challenges CHECK (approval_status IN ('pending', 'approved', 'rejected'));

COMMIT;

