-- DEBUG SCRIPT: Run this in Supabase SQL Editor to verify the state

-- 1. List all users (to confirm seed ran)
SELECT id, email, role, left(password_hash, 10) || '...' as hash_preview 
FROM app_users;

-- 2. Test Login Logic Manually for 'clearing@demo.com'
DO $$
DECLARE
    v_email text := 'clearing@demo.com';
    v_pass text := 'Demo@1234';
    v_user app_users;
    v_match boolean;
BEGIN
    -- Find
    SELECT * INTO v_user FROM app_users WHERE email = v_email;
    
    IF v_user IS NULL THEN
        RAISE NOTICE '❌ User % NOT FOUND', v_email;
    ELSE
        RAISE NOTICE '✅ User % FOUND (ID: %)', v_email, v_user.id;
        
        -- Check Hash
        v_match := (v_user.password_hash = crypt(v_pass, v_user.password_hash));
        
        IF v_match THEN
            RAISE NOTICE '✅ Password MATCHES for %', v_email;
        ELSE
            RAISE NOTICE '❌ Password MISMATCH for %. Hash: %, Input Re-hashed: %', v_email, v_user.password_hash, crypt(v_pass, v_user.password_hash);
        END IF;
    END IF;
END $$;
