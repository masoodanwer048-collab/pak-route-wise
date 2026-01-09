-- Add SUBMITTED to manifest_status enum
ALTER TYPE manifest_status ADD VALUE IF NOT EXISTS 'SUBMITTED';
