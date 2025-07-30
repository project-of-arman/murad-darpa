
"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // When the route changes, we want to start the progress bar.
    // We use a timeout to give the browser a moment to start rendering.
    setIsVisible(true);
    setProgress(10); // Start with a small amount of progress

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressTimer);
          return 95;
        }
        // Simulate loading progress with varying increments
        const increment = prev > 80 ? 1 : (prev > 50 ? 5 : 10);
        return Math.min(prev + increment, 95);
      });
    }, 200);

    // This is the cleanup function that runs when the component unmounts
    // (i.e., the new page has finished loading and this component instance is destroyed).
    return () => {
      clearInterval(progressTimer);
      // Quickly complete the progress bar
      setProgress(100);
      // And then hide it after a short delay
      setTimeout(() => {
          setIsVisible(false);
      }, 500);
    };
  }, [pathname, searchParams]);


  return (
    <Progress
      value={progress}
      className={cn(
        "fixed top-0 left-0 right-0 h-1 w-full rounded-none bg-transparent transition-opacity duration-300 z-50",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    />
  );
}
