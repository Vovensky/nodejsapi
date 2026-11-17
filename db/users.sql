CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);

CREATE OR REPLACE FUNCTION create_user(user_data JSONB)
RETURN UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_id UUID;
BEGIN
    INSERT INTO users (name)
    VALUES (user_data->>'name')
    RETURNING id INTO v_new_id;
    RETURN v_new_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_user(user_id UUID)
RETURN JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_user JSONB;
BEGIN
    SELECT row_to_json(u) INTO v_user
    FROM users u
    WHERE u.id = user_id;
    RETURN v_user;
END;
$$;