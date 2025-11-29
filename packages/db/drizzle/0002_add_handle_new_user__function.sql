-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS
$$
BEGIN
  INSERT INTO public.profiles (id, email)
  SELECT 
    new.id, 
    new.email
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = new.id
  );
  RETURN new;
END;
$$;

-- Trigger to call the function on new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
