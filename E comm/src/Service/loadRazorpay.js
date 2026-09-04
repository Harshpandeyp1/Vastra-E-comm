// src/Service/loadRazorpay.js
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // 1. If Razorpay is already available globally on window, resolve immediately
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    // 2. Check if script tag is already in the document
    const existingScript = document.getElementById("razorpay-checkout-script");
    if (existingScript) {
      // If it exists but window.Razorpay isn't ready, remove it to force a clean reload
      existingScript.remove();
    }

    // 3. Inject script cleanly
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay checkout SDK script");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};