import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "@/api/apiCore";
import { LoaderCircle } from "lucide-react";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      navigate("/dashboard/home");
    },
  });

  const handleLoginSubmit = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (email && password) {
      mutation.mutate({ email, password });
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
            <br />
            {mutation.isError && (
              <span className="text-sm text-red-500">
                {"Something went wrong"}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleLoginSubmit();
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                ref={emailRef}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" ref={passwordRef} required />
            </div>
            <div className="grid gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}
                &nbsp;&nbsp;&nbsp; Sign In
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
