
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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;
    
    // Reset progress on route change
    setIsVisible(false);
    setProgress(0);
    
    // Use a timeout to allow the old page to unmount and the new one to start mounting.
    const startTimer = setTimeout(() => {
        setIsVisible(true);
        setProgress(10); // Initial progress
    }, 100);

    return () => clearTimeout(startTimer);
  }, [pathname, searchParams, isMounted]);

  React.useEffect(() => {
    if (!isVisible) return;

    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressTimer);
          return 95;
        }
        const increment = prev > 80 ? 1 : (prev > 50 ? 5 : 10);
        return Math.min(prev + increment, 95);
      });
    }, 200);

    return () => clearInterval(progressTimer);
  }, [isVisible]);

  // When the component unmounts (new page is fully loaded), we want to quickly finish the progress bar.
   React.useEffect(() => {
    return () => {
      setProgress(100);
      setTimeout(() => {
          setIsVisible(false);
          // We don't reset to 0 here because the new instance will handle it.
      }, 500);
    };
  }, [pathname, searchParams]);

  if (!isMounted) {
    return null;
  }

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
