"use client";

import React from "react";
import AuthProvider from "./AuthProvider";

type Props = {
  children: React.ReactNode;
};

export default function RootProvider({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}
