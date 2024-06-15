"use client";

// ------------------------------------------------------------

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

// ------------------------------------------------------------
// ------------------------------------------------------------

const Page = () => {
  const serachParams = useSearchParams();
  const router = useRouter();
  // sign-in?as=seller
  const isSeller = serachParams.get("as") === "seller";
  // when we want to redirect from for ex the card page to the sign in becasue only authenticated user can should be able to access the card but we want to redirect them back to where they were after they sign in successfully
  const origin = serachParams.get("origin");

  // ------------------------------------------------------------

  // when ever we want to log in as seller or buyer all we need to do is change the url and everything is handle for us
  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  // ------------------------------------------------------------

  const continueAsBuyer = () => {
    // need to get rid of as=seller from url
    router.replace("/sign-in", undefined);
  };

  // ------------------------------------------------------------

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  // ------------------------------------------------------------

  // create a user once they enter their credentials and they are valid
  // const { data } = trpc.anyApiRoute.useQuery();

  // like a post request that anything that change data. this signIn is from auth-router.ts
  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success("Signed in successfully");

      router.refresh();

      // orgin where uwer was redirected from for example if you want to access the card and then get redirected to the sigin well we want to send themback to where they were for a good user experience so
      if (origin) {
        router.push(`/${origin}`);
        return;
      }

      if (isSeller) {
        router.push(`/sell`);
        return;
      }

      router.push("/");
    },

    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password.");
      }
    },
  });

  // ------------------------------------------------------------

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    // signIn is mutate
    signIn({ email, password });
  };

  // ------------------------------------------------------------
  // ------------------------------------------------------------

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your {isSeller ? "seller" : ""} account
            </h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-up"
            >
              Don&apos;t have an account?
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="you@example.com"
                  />

                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    type="password"
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder="Password"
                  />

                  {/* this msg come from account-credentials-validators.ts */}
                  {errors?.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button>Sign in</Button>
              </div>
            </form>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <span className="w-full border-t" />
              </div>

              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {/* if user is trying to login as seller in that case we are going to render */}
            {isSeller ? (
              <Button
                onClick={continueAsBuyer}
                variant="secondary"
                disabled={isLoading}
              >
                Continue as customer
              </Button>
            ) : (
              <Button
                onClick={continueAsSeller}
                variant="secondary"
                disabled={isLoading}
              >
                Continue as seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export default Page;
