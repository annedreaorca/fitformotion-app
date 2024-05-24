-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[],
    "primary_muscles" "Muscle"[],
    "secondary_muscles" "Muscle"[],
    "force" "ForceType",
    "level" "LevelType" NOT NULL,
    "mechanic" "MechanicType",
    "equipment" "EquipmentType",
    "category" "CategoryType" NOT NULL,
    "instructions" TEXT[],
    "description" TEXT,
    "tips" TEXT[],
    "image" TEXT,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);
