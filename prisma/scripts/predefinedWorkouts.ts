interface WorkoutPlanExerciseBase {
  exerciseId: string;
  sets: number;
  order: number;
  trackingType: "reps" | "duration";
}

interface WorkoutPlanExerciseReps extends WorkoutPlanExerciseBase {
  reps: number;
  duration?: never;
}

interface WorkoutPlanExerciseDuration extends WorkoutPlanExerciseBase {
  reps?: never;
  duration: number;
}

type WorkoutPlanExercise =
  | WorkoutPlanExerciseReps
  | WorkoutPlanExerciseDuration;

interface WorkoutPlanInput {
  name: string;
  notes: string;
  systemRoutineCategory: string;
  WorkoutPlanExercises: WorkoutPlanExercise[];
}

export const predefinedWorkouts: WorkoutPlanInput[] = [
  // Strength
  {
    name: "Full-Body Strength Builder",
    systemRoutineCategory: "Strength",
    notes:
      "This workout is designed to target all major muscle groups, providing a solid foundation of strength. Perfect for those looking to improve overall strength and endurance.",
    WorkoutPlanExercises: [
      {
        exerciseId: "47ebbf9e-82ba-48be-b149-afef96895960", // Barbell Squat
        sets: 3,
        reps: 8,
        order: 1,
        trackingType: "reps",
      },
      {
        exerciseId: "c3d7de0b-d4f2-4b72-9298-9fb20f987a59", // Barbell Bench Press - Medium Grip
        sets: 3,
        reps: 8,
        order: 2,
        trackingType: "reps",
      },
      {
        exerciseId: "83e1548b-7dfc-4e9e-8c2d-fccf7181a545", // Barbell Deadlift
        sets: 3,
        reps: 8,
        order: 3,
        trackingType: "reps",
      },
      {
        exerciseId: "efa36c0c-71fc-48d2-9b1d-a010484add72", // Wide-Grip Lat Pulldown
        sets: 3,
        reps: 8,
        order: 4,
        trackingType: "reps",
      },
      {
        exerciseId: "0becd8f5-d92f-4fc8-a0c0-b2f2b157c1f0", // Machine Shoulder (Military) Press
        sets: 3,
        reps: 8,
        order: 5,
        trackingType: "reps",
      },
      {
        exerciseId: "e6fe0a08-c0f7-47b7-8530-924cee18d697", // Plank
        sets: 3,
        duration: 30,
        order: 6,
        trackingType: "duration",
      },
    ],
  },
  {
    name: "Upper Body Power",
    systemRoutineCategory: "Strength",
    notes:
      "Focus on building strength in the chest, back, shoulders, and arms. Ideal for those wanting to increase upper body power and muscular definition.",
    WorkoutPlanExercises: [
      {
        exerciseId: "c3d7de0b-d4f2-4b72-9298-9fb20f987a59", // Barbell Bench Press - Medium Grip
        sets: 4,
        reps: 6,
        order: 1,
        trackingType: "reps",
      },
      {
        exerciseId: "58aa5936-d637-4ece-8b5a-a5975b0e8685", // Bent Over Barbell Row
        sets: 4,
        reps: 6,
        order: 2,
        trackingType: "reps",
      },
      {
        exerciseId: "342d0c9b-afec-4613-9615-08f9d1bd3644", // Dumbbell Shoulder Press
        sets: 3,
        reps: 8,
        order: 3,
        trackingType: "reps",
      },
      {
        exerciseId: "e6531b21-ac49-40ff-836d-092282f2bd84", // Pullups
        sets: 3,
        reps: 10,
        order: 4,
        trackingType: "reps",
      },
      {
        exerciseId: "585d14ab-3f2b-4828-ad3f-98fdf0737c59", // Dumbbell Bicep Curl
        sets: 3,
        reps: 10,
        order: 5,
        trackingType: "reps",
      },
      {
        exerciseId: "a44dc2ef-99c6-482c-8ef1-e8fee4b8b63c", // Dips - Triceps Version
        sets: 3,
        reps: 10,
        order: 6,
        trackingType: "reps",
      },
    ],
  },
  {
    name: "Lower Body Blast",
    systemRoutineCategory: "Strength",
    notes:
      "A comprehensive lower body workout aimed at strengthening and toning the legs and glutes. Great for building power and endurance.",
    WorkoutPlanExercises: [
      {
        exerciseId: "47ebbf9e-82ba-48be-b149-afef96895960", // Barbell Squat
        sets: 4,
        reps: 8,
        order: 1,
        trackingType: "reps",
      },
      {
        exerciseId: "83e1548b-7dfc-4e9e-8c2d-fccf7181a545", // Barbell Deadlift
        sets: 4,
        reps: 8,
        order: 2,
        trackingType: "reps",
      },
      {
        exerciseId: "038dd550-cb89-4aba-b21d-1bcc471368bb", // Dumbbell Lunges
        sets: 3,
        reps: 10,
        order: 3,
        trackingType: "reps",
      },
      {
        exerciseId: "faab93b7-daea-4b45-9e5c-80c647f022f5", // Leg Press
        sets: 3,
        reps: 10,
        order: 4,
        trackingType: "reps",
      },
      {
        exerciseId: "3a98fe3e-fcc1-4597-ad20-0ea60d1aa569", // Standing Dumbbell Calf Raise
        sets: 3,
        reps: 15,
        order: 5,
        trackingType: "reps",
      },
    ],
  },
  {
    name: "Core Stability and Strength",
    systemRoutineCategory: "Strength",
    notes:
      "This routine is centered around building core muscle strength and stability, which is essential for overall fitness and injury prevention.",
    WorkoutPlanExercises: [
      {
        exerciseId: "e6fe0a08-c0f7-47b7-8530-924cee18d697", // Plank
        sets: 3,
        duration: 30,
        order: 1,
        trackingType: "duration",
      },
      {
        exerciseId: "e67473e5-2482-4c81-9db4-1f5b9e0d1b22", // Standing Cable Wood Chop
        sets: 3,
        reps: 12,
        order: 2,
        trackingType: "reps",
      },
      {
        exerciseId: "4d793405-d1ff-442f-9e86-e7f1d6ceaddf", // Russian Twist
        sets: 3,
        reps: 15,
        order: 3,
        trackingType: "reps",
      },
      {
        exerciseId: "dd318273-44b6-4d60-a49a-abd7042e7439", // Cross-Body Crunch
        sets: 3,
        reps: 20,
        order: 4,
        trackingType: "reps",
      },
      {
        exerciseId: "bcd4d565-e08d-43b8-a7d3-715f81b1275b", // Hanging Leg Raise
        sets: 3,
        reps: 10,
        order: 5,
        trackingType: "reps",
      },
    ],
  },

  // Weight Loss

  // Beginner
];
