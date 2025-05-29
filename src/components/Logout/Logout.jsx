  "use client";
  import React, { useEffect, useRef } from "react";

  const INACTIVITY_LIMIT = 60 * 60 * 1000; // example 5 mins

  const Logout = ({ logout }) => {
    const timerIdRef = useRef(null);

    const resetTimer = () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      timerIdRef.current = setTimeout(logout, INACTIVITY_LIMIT);
    };

    useEffect(() => {
      // Setup event listeners for user activity to reset timer
      const events = ["mousemove", "keydown", "click", "scroll"];
      events.forEach((event) => window.addEventListener(event, resetTimer));

      // Start timer on mount
      resetTimer();

      return () => {
        // Cleanup listeners and timer on unmount
        events.forEach((event) => window.removeEventListener(event, resetTimer));
        if (timerIdRef.current) clearTimeout(timerIdRef.current);
      };
    }, [logout]); // only run on mount/unmount or if logout changes

    return null; // or your logout UI if any
  };

  export default Logout;
