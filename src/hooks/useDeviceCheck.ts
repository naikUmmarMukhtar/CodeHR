// src/hooks/useDeviceCheck.ts
import { useEffect, useState } from "react";

export const useDeviceCheck = () => {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPlatform = () => {
      const ua =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const platform = navigator.platform?.toLowerCase() || "";

      const isMobile =
        /android|iphone|ipad|ipod/i.test(ua) ||
        /mobile|tablet/i.test(ua) ||
        /arm|aarch64/.test(platform);

      const isDesktop =
        /win|mac|linux|cros/.test(platform) ||
        (!isMobile && !/android|iphone|ipad|ipod/i.test(ua));

      setIsMobileDevice(!isDesktop);
    };

    checkPlatform();
  }, []);

  return isMobileDevice;
};
