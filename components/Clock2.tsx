"use client";
import { useEffect, useState, useRef } from "react";

const CLOCK2_STORAGE_KEY = "workTimeClock2";
const CLOCK2_RUNNING_KEY = "isRunningClock2";
const CLOCK2_INTERACTED_KEY = "hasInteractedClock2";
const CLOCK2_LAST_UPDATE_KEY = "lastUpdateClock2";
const CLOCK1_STARTED_KEY = "startedClock1";

export default function Clock2() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [clock1Started, setClock1Started] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(CLOCK2_STORAGE_KEY);
    const savedElapsed = saved ? parseInt(saved) : 0;
    setElapsed(savedElapsed);

    const interacted = localStorage.getItem(CLOCK2_INTERACTED_KEY) === "true";
    setHasInteracted(interacted);

    const wasRunning = localStorage.getItem(CLOCK2_RUNNING_KEY) === "true";
    const lastUpdate = localStorage.getItem(CLOCK2_LAST_UPDATE_KEY);

    if (wasRunning && lastUpdate) {
      const timeSinceLastUpdate = Date.now() - parseInt(lastUpdate);
      if (timeSinceLastUpdate <= 120000) {
        setIsRunning(true);
        startTimer(savedElapsed);
      } else {
        setIsRunning(false);
        localStorage.setItem(CLOCK2_RUNNING_KEY, "false");
      }
    } else {
      setIsRunning(false);
    }

    // Initial check for Clock1
    const clock1Started = localStorage.getItem(CLOCK1_STARTED_KEY) === "true";
    setClock1Started(clock1Started);
  }, []);

  // Continuously monitor Clock1 status
  useEffect(() => {
    const interval = setInterval(() => {
      const started = localStorage.getItem(CLOCK1_STARTED_KEY) === "true";
      setClock1Started(started);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = (initialElapsed: number) => {
    let lastRecordedMinute = Math.floor(initialElapsed / 60);

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const newElapsed = prev + 1;
        localStorage.setItem(CLOCK2_STORAGE_KEY, newElapsed.toString());

        const currentMinute = Math.floor(newElapsed / 60);
        if (currentMinute > lastRecordedMinute) {
          localStorage.setItem(CLOCK2_LAST_UPDATE_KEY, Date.now().toString());
          lastRecordedMinute = currentMinute;
        }

        return newElapsed;
      });
    }, 1000);
  };

  const handleStart = () => {
    if (!isRunning && clock1Started) {
      setIsRunning(true);
      localStorage.setItem(CLOCK2_RUNNING_KEY, "true");
      localStorage.setItem(CLOCK2_LAST_UPDATE_KEY, Date.now().toString());

      if (!hasInteracted) {
        setHasInteracted(true);
        localStorage.setItem(CLOCK2_INTERACTED_KEY, "true");
      }

      startTimer(elapsed);
    }
  };

  const handlePause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    localStorage.setItem(CLOCK2_RUNNING_KEY, "false");
    localStorage.setItem(CLOCK2_STORAGE_KEY, elapsed.toString());
    localStorage.setItem(CLOCK2_LAST_UPDATE_KEY, Date.now().toString());

    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem(CLOCK2_INTERACTED_KEY, "true");
    }
  };

  // Save on tab/browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRunning) {
        localStorage.setItem(CLOCK2_LAST_UPDATE_KEY, Date.now().toString());
        localStorage.setItem(CLOCK2_STORAGE_KEY, elapsed.toString());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRunning, elapsed]);

  return (
    <div className="text-center">
      <h2 className="font-mono text-4xl font-semibold mb-4">
        Total Worked Hour
      </h2>
      <p className="text-9xl font-mono">{formatTime(elapsed)}</p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleStart}
          disabled={isRunning || !clock1Started}
          className="font-mono text-2xl px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          className="font-mono text-2xl px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50"
        >
          Pause
        </button>
      </div>
      <div className="mt-4 h-6">
        {!hasInteracted && (
          <p className="text-black text-lg font-mono">
            {!clock1Started
              ? "start the forever clock first to enable this timer"
              : "start and pause to track your work time"}
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
