
import { cn } from "@/lib/utils";
import React from "react";

export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className={cn("space-y-2")}>{children}</div>;
}
