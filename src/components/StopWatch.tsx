// @ts-nocheck
import { useEffect, useState, useRef } from "react";

export default function Stopwatch({ startTime, isRunning }) {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate elapsed time based on real time (not local state)
  const getElapsedSeconds = (start) => {
    const now = new Date();
    const diff = (now.getTime() - start.getTime()) / 1000;
    return Math.max(0, Math.floor(diff));
  };

  useEffect(() => {
    if (isRunning && startTime) {
      setElapsed(getElapsedSeconds(startTime));

      // update every second in real time
      timerRef.current = setInterval(() => {
        setElapsed(getElapsedSeconds(startTime));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, startTime]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="text-center text-xl font-mono text-green-600">
      {formatTime(elapsed)}
    </div>
  );
}
