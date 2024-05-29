"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface WorkoutControlsContextType {
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  workoutDuration: number;
  setWorkoutDuration: React.Dispatch<React.SetStateAction<number>>;
  workoutStartTime: number | null;
  setWorkoutStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  activeWorkoutRoutine: string | null;
  setActiveWorkoutRoutine: React.Dispatch<React.SetStateAction<string | null>>;
  formatDuration: (seconds: number) => string;
  togglePause: () => void;
  startWorkout: (workoutId: string) => void;
}

const WorkoutControlsContext = createContext<
  WorkoutControlsContextType | undefined
>(undefined);

export const WorkoutControlsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<
    string | null
  >(null);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [totalPausedDuration, setTotalPausedDuration] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);

  useEffect(() => {
    const handleWorkoutTimer = () => {
      if (workoutStartTime && !isPaused) {
        const currentTime = Date.now();
        const elapsedMilliseconds =
          currentTime - workoutStartTime - totalPausedDuration;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        setWorkoutDuration(elapsedSeconds);
      }
    };

    if (workoutStartTime && !isPaused) {
      intervalRef.current = window.setInterval(handleWorkoutTimer, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [workoutStartTime, isPaused, totalPausedDuration]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const remainingSeconds = seconds - hours * 3600 - minutes * 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const togglePause = () => {
    if (!workoutStartTime) {
      toast.error("Workout has not started yet");
      return;
    }

    if (isPaused) {
      // Resume the workout
      const pauseEndTime = Date.now();
      const pauseDuration = pauseEndTime - pauseStartTime!;
      setPausedTime((prevPausedTime) => prevPausedTime + pauseDuration);
      setPauseStartTime(null);
    } else {
      // Pause the workout
      setPauseStartTime(Date.now());
    }

    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const startWorkout = (workoutId: string) => {
    if (!workoutStartTime) {
      setWorkoutStartTime(Date.now());
      setActiveWorkoutRoutine(workoutId);
      setTotalPausedDuration(0);
      setPauseStartTime(null);
      toast.success("Workout Session Started!");
    }
  };

  return (
    <WorkoutControlsContext.Provider
      value={{
        //States
        isPaused,
        setIsPaused,
        isSaving,
        setIsSaving,
        workoutDuration,
        setWorkoutDuration,
        workoutStartTime,
        setWorkoutStartTime,
        activeWorkoutRoutine,
        setActiveWorkoutRoutine,
        //Functions
        formatDuration,
        togglePause,
        startWorkout,
      }}
    >
      {children}
    </WorkoutControlsContext.Provider>
  );
};

export const useWorkoutControls = () => {
  const context = useContext(WorkoutControlsContext);
  if (context === undefined) {
    throw new Error(
      "useWorkoutControls must be used within a WorkoutControlsProvider",
    );
  }
  return context;
};
