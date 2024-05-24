-- CreateTable
CREATE TABLE "UserEquipment" (
    "userId" TEXT NOT NULL,
    "equipmentType" "EquipmentType" NOT NULL,

    CONSTRAINT "UserEquipment_pkey" PRIMARY KEY ("userId","equipmentType")
);
