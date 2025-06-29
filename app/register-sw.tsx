// app/register-sw.tsx
"use client";
import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    // Check if it's a mobile device - block PWA on mobile
    const isMobile = /iPhone|Android|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Mobile/i.test(
      navigator.userAgent
    );
    
    if (isMobile) {
      console.log("📱 Mobile device detected - PWA disabled");
      return;
    }

    console.log("🖥️ Desktop device detected - PWA enabled");

    // Check if service worker is supported
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          // Register the service worker
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });
          
          console.log("✅ Service Worker registered:", registration.scope);
          
          // Check if there's an update available
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            console.log("🔄 Service Worker update found");
            
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log("🆕 New content available, will update on next visit");
                  } else {
                    console.log("📦 Content cached for offline use");
                  }
                }
              });
            }
          });

          // Listen for controlling service worker changes
          let refreshing = false;
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (!refreshing) {
              refreshing = true;
              console.log("🔄 Service Worker controller changed, reloading...");
              window.location.reload();
            }
          });
          
        } catch (error) {
          console.error("❌ Service Worker registration failed:", error);
        }
      });
    } else {
      console.warn("⚠️ Service Worker not supported");
    }
  }, []);

  return null;
}