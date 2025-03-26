import { Redirect } from "expo-router";
import { useAuthState } from "../app/auth/context";
import React from "react";

export function ProtectedRoute({ children }: { children: any }) {
  const { auth } = useAuthState(); // Assuming useAuth is your context hook
  if (!auth) return <Redirect href="/auth/login" />;
  return children;
}
