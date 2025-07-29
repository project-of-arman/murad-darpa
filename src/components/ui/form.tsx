
"use client";

import * as React from "react";
import { useFormContext, FormProvider } from "react-hook-form";
import { cn } from "@/lib/utils";

export function Form({ children, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const methods = useFormContext();
  return (
    <form {...props} className={cn("space-y-6", props.className)}>
      {children}
    </form>
  );
}
