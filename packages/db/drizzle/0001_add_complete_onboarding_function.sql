CREATE OR REPLACE FUNCTION complete_onboarding_step(step_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET onboarding_steps = array_append(onboarding_steps, step_name::public.onboarding_steps)
  WHERE id = auth.uid()
  AND NOT (onboarding_steps @> ARRAY[step_name::public.onboarding_steps]);
END;
$$;
