// src/hooks/useDeviceCheck.ts
//@ts-nocheck
import { useEffect, useState } from "react";

export const useDeviceCheck = () => {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPlatform = () => {
      const ua =
        navigator.userAgent || navigator.vendor || (window as any).opera;

      // Check for mobile device user agents
      const isMobileUA =
        /android/i.test(ua) || (/iphone|ipod/i.test(ua) && !window.MSStream);

      // Exclude iPads and tablets
      const isTabletUA = /ipad/i.test(ua) || /tablet/i.test(ua);

      // Additional check: screen size (optional but helpful)
      const isSmallScreen = window.innerWidth <= 768;

      // Final decision: must be mobile UA, not tablet, and small screen
      const isPhysicalMobile = isMobileUA && !isTabletUA && isSmallScreen;

      setIsMobileDevice(isPhysicalMobile);
    };

    checkPlatform();
  }, []);

  return isMobileDevice;
};
