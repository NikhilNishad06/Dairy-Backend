-- Run this script in your Supabase SQL Editor (https://app.supabase.com/)

-- 1. Create the addresses table (Stores delivery details)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- References auth.users(id) if available (optional)
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the orders table (Stores order summary and payment status)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- References auth.users(id) if available (optional)
    address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    total_amount NUMERIC NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the payments table (Stores detailed payment/transaction information)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- References auth.users(id) if available (optional)
    amount NUMERIC NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_id VARCHAR(255), -- Stores the Razorpay Payment ID (e.g. pay_ABC123)
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: In Supabase, usually Row Level Security (RLS) is enabled by default for new tables.
-- If you face issues with inserting data from the backend/frontend, you might need to:
-- 1. Disable RLS for these tables (Quickest for development)
--    ALTER TABLE public.addresses DISABLE ROW LEVEL SECURITY;
--    ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
--    ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
-- 2. OR Create appropriate policies for authenticated/anonymous users.
