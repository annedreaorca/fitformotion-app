"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfetti } from "@/contexts/ConfettiContext";
import { TrackingType } from "@prisma/client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button, ButtonGroup } from "@nextui-org/button";
import { IconPlus, IconX } from "@tabler/icons-react";

import { useWorkoutControls } from "@/contexts/WorkoutControlsContext";
import { useWorkoutData } from "@/contexts/WorkoutDataContext";

import ExerciseTable from "./ExerciseTable";
import StatusBar from "./StatusBar";
import { handleSaveWorkout } from "@/server-actions/WorkoutServerActions";
import ExerciseOrderIndicator from "@/components/Generic/ExerciseOrderIndicator";

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutPlanExercise {
  Exercise: Exercise;
  sets: number;
  reps: number | null;
  exerciseDuration: number | null;
  trackingType: string;
  order: number | null;
}

interface Workout {
  id: string;
  name: string;
  notes: string | null;
  WorkoutPlanExercise: WorkoutPlanExercise[];
}

export default function WorkoutManager({ workout }: { workout: Workout }) {
  const router = useRouter();
  const workoutPlanId = workout.id;

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { startConfetti } = useConfetti();
  const { workoutExercises, setWorkoutExercises } = useWorkoutData();
  const {
    setIsSaving,
    workoutDuration,
    setWorkoutDuration,
    workoutStartTime,
    setWorkoutStartTime,
    activeWorkoutRoutine,
    setActiveWorkoutRoutine,
    startWorkout,
  } = useWorkoutControls();

  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [remainingRestTime, setRemainingRestTime] = useState(0);
  const [setCompletionTimes, setSetCompletionTimes] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (!isDataLoaded && !activeWorkoutRoutine && workout) {
      const initialWorkoutExercises = workout.WorkoutPlanExercise.map(
        (exerciseDetail) => ({
          exerciseId: exerciseDetail.Exercise.id,
          exerciseName: exerciseDetail.Exercise.name,
          sets: Array.from({ length: exerciseDetail.sets }, () => ({
            completed: false,
            reps: exerciseDetail.reps || null,
            duration: exerciseDetail.exerciseDuration || null,
            weight: null,
          })),
          trackingType: exerciseDetail.trackingType,
        }),
      );
      setWorkoutExercises(initialWorkoutExercises);
      setIsDataLoaded(true);
    }
  }, [workout, activeWorkoutRoutine, setWorkoutExercises, isDataLoaded]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && remainingRestTime > 0) {
      timer = setInterval(() => {
        setRemainingRestTime((prev) => prev - 1);
      }, 1000);
    } else if (isResting && remainingRestTime === 0) {
      setIsResting(false);
      toast.success("Rest period over. Time to continue your workout!");
    }
    return () => clearInterval(timer);
  }, [isResting, remainingRestTime]);

  const startRestPeriod = (seconds: number) => {
    setRestTime(seconds);
    setRemainingRestTime(seconds);
    setIsResting(true);
  };

  const skipRestPeriod = () => {
    setIsResting(false);
    setRemainingRestTime(0);
    toast.success("Rest period skipped. Continue your workout!");
  };

  const handleCompleteSet = (
    exerciseIndex: number,
    setIndex: number,
    exerciseName: string,
  ) => {
    if (!workoutExercises) {
      toast.error("Workout exercises data is not loaded yet");
      return;
    }

    const exerciseDetail = workoutExercises[exerciseIndex];
    const set = exerciseDetail.sets[setIndex];

    if (set.completed) {
      toast.error("This set is already completed and cannot be unchecked.");
      return;
    }

    const currentTime = Date.now();
    const minTimePerRep = 2; // Assuming 2 seconds per rep
    const minDuration =
      exerciseDetail.trackingType === "duration"
        ? (set.duration ?? 0) * 1000
        : (set.reps || 0) * minTimePerRep * 1000;

    const previousSetCompletionTime =
      setCompletionTimes[`${exerciseIndex}-${setIndex - 1}`] ||
      workoutStartTime ||
      0;
    const requiredTimeElapsed =
      previousSetCompletionTime + minDuration + restTime * 1000;

    if (currentTime < requiredTimeElapsed) {
      toast.error(
        "Please complete the required exercise duration or repetitions first.",
      );
      return;
    }

    if (
      set.weight === null ||
      !Number(set.weight) ||
      (exerciseDetail.trackingType === "reps" &&
        (set.reps === null || !Number(set.reps))) ||
      (exerciseDetail.trackingType === "duration" &&
        (set.duration === null || !Number(set.duration)))
    ) {
      toast.error(
        "Please fill in all fields before marking the set as completed",
      );
      return;
    }

    if (!workoutStartTime) {
      startWorkout(workoutPlanId);
      setWorkoutStartTime(Date.now());
    }

    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;
      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.completed = true;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      toast.success(`${exerciseName} Set ${setIndex + 1} completed`);
      return updatedWorkoutExercises;
    });

    setSetCompletionTimes((prevTimes) => ({
      ...prevTimes,
      [`${exerciseIndex}-${setIndex}`]: currentTime,
    }));
  };

  const handleWeightChange = (
    exerciseIndex: number,
    setIndex: number,
    newValue: number,
  ) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;

      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.weight = newValue;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      return updatedWorkoutExercises;
    });
  };

  const handleRepChange = (
    exerciseIndex: number,
    setIndex: number,
    newValue: number | null,
  ) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;

      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.reps = newValue;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      return updatedWorkoutExercises;
    });
  };

  const handleDurationChange = (
    exerciseIndex: number,
    setIndex: number,
    newValue: number | null,
  ) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;

      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const setToUpdate = { ...exerciseToUpdate.sets[setIndex] };
      setToUpdate.duration = newValue;
      exerciseToUpdate.sets[setIndex] = setToUpdate;
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      return updatedWorkoutExercises;
    });
  };

  const addSet = (exerciseIndex: number, exerciseName: string) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;
      const updatedWorkoutExercises = [...prevWorkoutExercises];
      const exerciseToUpdate = { ...updatedWorkoutExercises[exerciseIndex] };
      const newSet = {
        completed: false,
        reps: workout.WorkoutPlanExercise[exerciseIndex].reps || null,
        duration:
          workout.WorkoutPlanExercise[exerciseIndex].exerciseDuration || null,
        weight: null,
      };
      exerciseToUpdate.sets = [...exerciseToUpdate.sets, newSet];
      updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
      toast.success(`Set added to ${exerciseName}`);
      return updatedWorkoutExercises;
    });
  };

  const removeSet = (exerciseIndex: number, exerciseName: string) => {
    setWorkoutExercises((prevWorkoutExercises) => {
      if (!prevWorkoutExercises) return prevWorkoutExercises;
      const updatedWorkoutExercises = [...prevWorkoutExercises];
      if (updatedWorkoutExercises[exerciseIndex].sets.length > 1) {
        if (
          window.confirm(
            `Are you sure you want to delete the last set from ${exerciseName}?`,
          )
        ) {
          const exerciseToUpdate = {
            ...updatedWorkoutExercises[exerciseIndex],
          };
          exerciseToUpdate.sets.pop();
          updatedWorkoutExercises[exerciseIndex] = exerciseToUpdate;
          toast.success(`Set removed from ${exerciseName}`);
          return updatedWorkoutExercises;
        }
      } else {
        toast.error(
          `Cannot remove. At least one set is required for ${exerciseName}.`,
        );
      }
      return prevWorkoutExercises;
    });
  };

  const cancelWorkout = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel the workout? This cannot be undone.",
      )
    ) {
      setWorkoutExercises([]);
      setWorkoutDuration(0);
      setWorkoutStartTime(null);
      setActiveWorkoutRoutine(null);
      toast("Workout cancelled");
      router.push("/workout");
    }
  };

  const completeWorkout = async () => {
    if (workoutExercises) {
      const hasIncompleteSets = workoutExercises.some((exercise) =>
        exercise.sets.some((set) => !set.completed),
      );

      if (hasIncompleteSets) {
        const proceedWithIncompleteSets = window.confirm(
          "There are incomplete sets. These will not be saved. Do you want to proceed?",
        );
        if (!proceedWithIncompleteSets) {
          return;
        }
      }

      const filteredExercises = workoutExercises
        .filter((exercise) => exercise.sets.some((set) => set.completed))
        .map((exercise) => ({
          ...exercise,
          sets: exercise.sets.filter((set) => set.completed),
        }));

      if (filteredExercises.length === 0) {
        toast.error(
          "You need to complete at least one set to save the workout.",
        );
        return;
      }

      try {
        setIsSaving(true);

        const exercisesData = filteredExercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          trackingType:
            TrackingType[exercise.trackingType as keyof typeof TrackingType],
          sets: exercise.sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            duration: set.duration,
            completed: set.completed,
          })),
        }));

        const data = {
          name: workout.name,
          date: new Date().toISOString(),
          duration: workoutDuration,
          workoutPlanId: workout.id,
          exercises: exercisesData,
        };

        const response = await handleSaveWorkout(data);

        if (response.success) {
          startConfetti();
          router.push("/dashboard");
          setWorkoutExercises([]);
          setWorkoutDuration(0);
          setWorkoutStartTime(null);
          setActiveWorkoutRoutine(null);
          toast.success("Workout saved successfully!");
        } else {
          toast.error("Failed to save workout");
        }
      } catch (error) {
        toast.error("An error occurred while saving the workout");
      } finally {
        setIsSaving(false);
      }
    } else {
      toast.error("No workout exercises available.");
    }
  };

  const workoutName = workout.name;

  const totalSets = workoutExercises
    ? workoutExercises.reduce((acc, curr) => acc + curr.sets.length, 0)
    : 0;

  const completedSets = workoutExercises
    ? workoutExercises.reduce(
        (acc, curr) => acc + curr.sets.filter((set) => set.completed).length,
        0,
      )
    : 0;

  const progressPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="pb-32">
      {workout.notes && (
        <p className="mb-3 text-sm text-zinc-500">{workout.notes}</p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
        {workoutExercises?.map((exercise, index) => (
          <Card shadow="none" className="shadow-md" key={exercise.exerciseId}>
            <CardHeader className="text-lg px-5">
              <div className="flex gap-2 items-center mb-3">
                <ExerciseOrderIndicator position={index} />
                <p className="text-lg">{exercise.exerciseName}</p>
              </div>
            </CardHeader>
            <CardBody className="pb-1 pt-0">
              <ExerciseTable
                exerciseDetail={exercise}
                index={index}
                handleCompleteSet={handleCompleteSet}
                handleWeightChange={handleWeightChange}
                handleRepChange={handleRepChange}
                handleDurationChange={handleDurationChange}
              />
            </CardBody>
            <CardFooter className="gap-2 px-5 bg-default-100">
              <ButtonGroup className="shrink-0">
                <Button
                  size="sm"
                  onPress={() => addSet(index, exercise.exerciseName)}
                >
                  <IconPlus size={16} />
                  Add Set
                </Button>
                <Button
                  size="sm"
                  onPress={() => removeSet(index, exercise.exerciseName)}
                >
                  <IconX size={16} />
                  Remove Set
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
        <div className="hidden max-md:block">
          <div className="py-[80px]"> </div>
        </div>
      </div>
      <div className="separator mt-[40px] max-md:hidden">
        <hr className="opacity-10" />
      </div>
      <div className="flex max-md:flex-col justify-center mt-10 max-md:mt-0 max-md:fixed max-md:bottom-0 max-md:mb-[130px]  z-40 ">
        {" "}
        {/* changes on className */}
        <div className="flex items-center justify-center gap-2 bg-zinc-700 p-[15px] rounded-[10px]">
          {/* changes on className */}
          <div className="relative">
            <input
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              disabled={!workoutStartTime}
              className="border rounded px-2 py-1 pr-16 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50"
              placeholder="Enter rest time"
            />
            {/* changes on className */}
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              second{"/s"}
            </span>
          </div>
          <Button
            size="sm"
            className="bg-zinc-100 text-zinc-900"
            onPress={() => startRestPeriod(restTime)}
            disabled={!workoutStartTime}
          >
            Start Rest
          </Button>
        </div>
        {/* add this from this */}
        <div className="flex hidden max-md:block items-center justify-center gap-2 max-md:bg-zinc-700 p-[5px] rounded-[10px] my-[15px]">
          {isResting && (
            <div className="flex justify-center items-center">
              <p className="max-md:text-sm max-md:text-zinc-200 mr-4">
                Resting... {remainingRestTime}s remaining
              </p>
              <Button
                size="md"
                className="bg-slate-100 text-zinc-900"
                onPress={skipRestPeriod}
              >
                Skip Rest
              </Button>
            </div>
          )}
        </div>
        {/* to this */}
      </div>

      {isResting && (
        <div className="flex justify-center items-center max-md:hidden mt-5">
          {/* changes on className */}
          <p className="max-md:text-sm max-md:text-zinc-200 mr-4">
            {/* changes on className */}
            Resting... {remainingRestTime}s remaining
          </p>
          <Button
            size="md"
            className="bg-slate-100 text-zinc-900"
            onPress={skipRestPeriod}
          >
            {/* changes on className */}
            Skip Rest
          </Button>
        </div>
      )}
      <StatusBar
        completeWorkout={completeWorkout}
        progressPercentage={progressPercentage}
        activeRoutineId={workoutPlanId}
        cancelWorkout={cancelWorkout}
      />
    </div>
  );
}
