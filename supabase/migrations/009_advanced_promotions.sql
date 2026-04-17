-- Add advanced rules for promotions
ALTER TABLE promotions 
ADD COLUMN min_subtotal NUMERIC DEFAULT 0,
ADD COLUMN min_items INTEGER DEFAULT 1;

-- Update the existing combo promotion if it exists
UPDATE promotions 
SET min_subtotal = 5000, 
    min_items = 2 
WHERE promotion_type = 'combo';
