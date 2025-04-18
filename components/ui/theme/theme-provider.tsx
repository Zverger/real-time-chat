"use client";
import { FC, PropsWithChildren } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { cn } from "@/lib";

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};
