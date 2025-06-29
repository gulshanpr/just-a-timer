"use client";
import { useEffect, useState } from "react";

const CLOCK1_STORAGE_KEY = "startTimeClock1";
const CLOCK1_STARTED_KEY = "startedClock1";

export default function Clock1() {
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  // On initial mount, check if previously started
  useEffect(() => {
    const hasStarted = localStorage.getItem(CLOCK1_STARTED_KEY) === "true";
    setStarted(hasStarted);
  }, []);

  // When started becomes true, start interval
  useEffect(() => {
    if (!started) return;

    let startTime = localStorage.getItem(CLOCK1_STORAGE_KEY);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(CLOCK1_STORAGE_KEY, startTime);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const start = parseInt(
        localStorage.getItem(CLOCK1_STORAGE_KEY) || startTime!
      );
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  const handleStart = () => {
    const now = Date.now().toString();
    localStorage.setItem(CLOCK1_STORAGE_KEY, now);
    localStorage.setItem(CLOCK1_STARTED_KEY, "true");
    setStarted(true);
  };

  return (
    <div className="text-center">
      <h2 className="font-mono text-4xl font-semibold mb-4">Forever Clock</h2>
      <p className="text-9xl font-mono">{formatTime(elapsed)}</p>
      {/* Fixed button area that matches Clock2 exactly */}
      <div className="mt-6 flex justify-center gap-4">
        {!started ? (
          <button
            onClick={handleStart}
            className="font-mono text-2xl px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Start
          </button>
        ) : (
          // Invisible placeholder buttons to maintain exact same height
          <>
            <div className="text-2xl px-6 py-2 opacity-0">Start</div>
            <div className="text-2xl px-6 py-2 opacity-0">Pause</div>
          </>
        )}
      </div>
      {/* Message area - shows only when not started */}
      <div className="mt-4 h-6">
        {!started && (
          <p className="text-black text-lg font-mono">
            once start button is clicked, it will start counting forever.
            <br />
            don’t clear the local storage mf 😡
          </p>
        )}
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
