import { useEffect, useState } from 'react';

/** A cleanup-safe countdown; starting/restarting it never leaks intervals. */
export function useResendCountdown(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds(current => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  return {
    seconds,
    isRunning: seconds > 0,
    start: () => setSeconds(initialSeconds),
    stop: () => setSeconds(0),
  };
}
