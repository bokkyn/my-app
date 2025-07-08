// components/AutoAd.js
import { useEffect } from "react";

const AutoAd = () => {
  useEffect(() => {
    // Load PropellerAds Auto Ads script dynamically
    const script = document.createElement("script");
    script.src = "https://a.propellerads.com/js/auto.js"; // Auto Ads script URL
    script.async = true;
    script.type = "text/javascript";
    
    // Append script to the document head
    document.head.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null; // No UI, just script injection for Auto Ads
};

export default AutoAd;
