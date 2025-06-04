import SignInForm from "@/components/auth/SignInForm";
import AuthLayout from "./_layout";

export default function Home() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}