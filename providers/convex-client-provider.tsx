"use client";
import { FC, ReactNode } from "react";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, AuthLoading, ConvexReactClient } from "convex/react";
import { LoadingLogo } from "@/components/shared";

interface ConvexClientProviderProps {
  children?: ReactNode;
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexReactClient(CONVEX_URL);

export const ConvexClientProvider: FC<ConvexClientProviderProps> = ({
  children,
}) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <SignedOut>
          <header className="flex h-16 items-center justify-end gap-4 p-4">
            <SignInButton />
            <SignUpButton />
          </header>
        </SignedOut>

        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <LoadingLogo />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
