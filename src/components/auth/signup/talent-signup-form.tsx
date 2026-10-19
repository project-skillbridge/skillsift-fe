"use client";

import { useEffect, useState } from "react";
import { appToast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  register as registerAccount,
  talentRegisterBody,
} from "@/actions/auth";
import { AuthNavigationLoading } from "@/components/auth/auth-navigation-loading";
import { FormInput } from "@/components/custom/form-input";
import { GoogleButton } from "@/components/custom/google-button";
import { Button } from "@/components/ui/button";
import { authKeys } from "@/hooks/api/keys";
import { authFailureMessage } from "@/lib/api";
import { signInWithGoogle } from "@/lib/auth-client";
import { prepareGoogleAuth } from "@/lib/google-auth";
import { useSignupFlowStore } from "@/stores/signup-flow-store";
import {
  signupFormSchema,
  type SignupFormValues,
  type TalentSignup,
} from "@/types/form-schema";

function TalentSignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setTalentSignup = useSignupFlowStore((s) => s.setTalentSignup);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isAuthNavigating, setIsAuthNavigating] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const confirmPasswordValue =
    useWatch({ control, name: "confirmPassword" }) ?? "";

  const isPasswordValid =
    !errors.password &&
    passwordValue.length >= 8 &&
    /[A-Z]/.test(passwordValue) &&
    /[a-z]/.test(passwordValue) &&
    /[0-9]/.test(passwordValue);

  const passwordsMatch =
    passwordValue === confirmPasswordValue && confirmPasswordValue !== "";

  useEffect(() => {
    let isMounted = true;

    prepareGoogleAuth()
      .then(() => {
        if (isMounted) setIsGoogleReady(true);
      })
      .catch(() => {
        if (isMounted) setIsGoogleReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await registerAccount(
        talentRegisterBody({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
      );
      setTalentSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      } satisfies TalentSignup);
      router.push("/signup/verify-talent");
      router.refresh();
    } catch (e) {
      appToast.error(authFailureMessage(e));
    }
  };

  const onGoogleSignIn = async () => {
    setIsGooglePending(true);

    try {
      const { result, redirectTo } = await signInWithGoogle();

      if (result?.error) {
        appToast.error(
          "Signed in with Google, but couldn't start your session. Try again.",
        );
        return;
      }

      queryClient.removeQueries({ queryKey: authKeys.all });
      setIsAuthNavigating(true);
      router.replace(redirectTo);
      router.refresh();
    } catch (e) {
      setIsAuthNavigating(false);
      appToast.error(authFailureMessage(e));
    } finally {
      setIsGooglePending(false);
    }
  };

  return (
    <>
      {isAuthNavigating && <AuthNavigationLoading />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full min-w-0 flex-col gap-6 font-sans"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput
            label="First name"
            required
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <FormInput
            label="Last name"
            required
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <FormInput
          label="Email"
          required
          type="email"
          validateEmail
          placeholder="Enter your email address"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormInput
          label="Create password"
          required
          type="password"
          placeholder="Password must be 8 characters"
          error={errors.password?.message}
          success={isPasswordValid}
          {...register("password")}
        />

        <FormInput
          label="Confirm password"
          required
          type="password"
          placeholder="Password must be 8 characters"
          error={errors.confirmPassword?.message}
          success={passwordsMatch && !errors.confirmPassword}
          {...register("confirmPassword")}
        />

        <p className="body-2 mx-auto w-full max-w-100 text-center font-light text-muted-foreground">
          By continuing, you agree to SkillSift Talent&apos;s{" "}
          <Link
            href="/terms-of-use"
            className="underline decoration-muted-foreground underline-offset-4 transition-colors hover:text-foreground"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="underline decoration-muted-foreground underline-offset-4 transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          disabled={isSubmitting || isAuthNavigating}
          className="h-12 w-full rounded-xl bg-primary-900 text-base font-bold text-primary-foreground transition-all hover:bg-primary-900/90 active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="relative flex items-center gap-4" role="separator">
          <div className="h-px flex-1 bg-border" />
          <span className="body-2 shrink-0 text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton
          disabled={
            !isGoogleReady ||
            isGooglePending ||
            isSubmitting ||
            isAuthNavigating
          }
          label={isGooglePending ? "Connecting..." : "Sign Up with Google"}
          loading={!isGoogleReady}
          onClick={() => void onGoogleSignIn()}
        />

        <p className="body-2 text-center font-light text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-normal text-foreground underline decoration-foreground underline-offset-4 transition-all hover:opacity-80"
          >
            Login
          </Link>
        </p>
      </form>
    </>
  );
}

export { TalentSignupForm };
