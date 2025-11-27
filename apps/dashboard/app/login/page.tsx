import { loginWithGoogle } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
