// src/hooks/useDeviceCheck.ts
import { useEffect, useState } from "react";

export const useDeviceCheck = () => {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPlatform = async () => {
      const uaData = (navigator as any).userAgentData;
      const ua = navigator.userAgent.toLowerCase();

      const isAndroid = /android/.test(ua);
      const isIOS = /iphone|ipad|ipod/.test(ua);

      let isDesktop = false;

      if (uaData?.platform) {
        const platform = uaData.platform.toLowerCase();
        isDesktop =
          platform.includes("windows") ||
          platform.includes("mac") ||
          platform.includes("linux");
      } else {
        isDesktop =
          /windows|macintosh|linux/.test(ua) &&
          !/android|iphone|ipad|ipod/.test(ua);
      }

      if (isAndroid || isIOS) {
        setIsMobileDevice(true);
      } else if (isDesktop) {
        setIsMobileDevice(false);
      } else {
        // Fallback for ChromeOS, SmartTVs, etc.
        setIsMobileDevice(/mobile|tablet/.test(ua));
      }
    };

    checkPlatform();
  }, []);

  return isMobileDevice;
};
