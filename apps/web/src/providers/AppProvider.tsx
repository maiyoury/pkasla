"use client";

import React from "react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { useSyncAuthSession } from "@/store/auth";

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Sync NextAuth session with auth store
  useSyncAuthSession();

  return (
    <ProgressProvider
      options={{
        showSpinner: false,
      }}
      height="4px"
      color="#FA6DECFF"
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
