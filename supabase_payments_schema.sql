-- Run this in your Supabase SQL Editor

-- 1. Create the payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID, -- If you have a users table, you can add: REFERENCES public.users(id)
    amount NUMERIC NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Optional: Set up Row Level Security (RLS) policies 
--    if you want to restrict access to payments data
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- If you want authenticated users to view only their own payments
CREATE POLICY "Users can view their own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- If you want authenticated users to insert their own payments from frontend (though done securely from backend is better)
CREATE POLICY "Backend script can insert payments"
    ON public.payments FOR INSERT
    WITH CHECK (true); -- Or remove RLS for inserts if handled purely via anon/service_role keys on backend

-- 3. Note: Ensure that the user's subscription_status in users table is updated.
-- Update snippet example that you might want to add:
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive';
