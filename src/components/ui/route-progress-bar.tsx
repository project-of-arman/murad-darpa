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
    setProgress(0);
    setIsVisible(false);
  }, [pathname, searchParams]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // This is a simplified progress simulation.
    // When the component is first mounted for a new route, start the progress.
    if (!isVisible && progress === 0) {
      setIsVisible(true);
      // Start with a small initial progress
      setProgress(10); 
      
      // Simulate loading progress
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer);
            return prev;
          }
          // Slow down progress as it gets closer to 100
          const increment = prev > 80 ? 1 : (prev > 50 ? 5 : 10);
          return Math.min(prev + increment, 95);
        });
      }, 200);
    }
    
    // On cleanup (when new page is fully loaded and this component unmounts),
    // we want to quickly finish the progress bar.
    return () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setProgress(0), 500);
      }, 500);
    };
  }, [pathname, searchParams]); // Rerun effect on route change
  
   React.useEffect(() => {
    // When the component unmounts (because the new route has loaded),
    // we set progress to 100 to complete the bar.
    return () => {
      setProgress(100);
    };
  }, [pathname, searchParams]);

  return (
    <Progress
      value={progress}
      className={cn(
        "fixed top-0 left-0 right-0 h-1 w-full rounded-none bg-transparent transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    />
  );
}
