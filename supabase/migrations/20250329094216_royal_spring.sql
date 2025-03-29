/*
  # Remove Order Column from Info Cards Table
  
  1. Schema Changes
    - Drop "order" column from info_cards table since we'll use id for ordering
*/

-- Drop order column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'info_cards' AND column_name = 'order'
  ) THEN
    ALTER TABLE info_cards DROP COLUMN "order";
  END IF;
END $$;