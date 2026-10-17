import type {
  AuthUser,
  GoogleVerifyCodeResponseData,
  LoginResponseData,
  VerifyEmailResponseData,
} from "@/types/api";
import type { SignInResponse } from "next-auth/react";

export type CredentialSignInParams = {
  email: string;
  accessToken?: string | null;
  userId: string | number;
  name: string;
  image?: string | null;
  role?: AuthUser["role"];
};

export type CredentialSignInFromAuthResponse =
  LoginResponseData | VerifyEmailResponseData | GoogleVerifyCodeResponseData;

export type GoogleSignInResult = {
  result: SignInResponse | undefined;
  user?: AuthUser;
  redirectTo: string;
};
